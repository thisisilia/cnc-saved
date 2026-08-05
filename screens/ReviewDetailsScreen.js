import { Feather } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppIcon from '../components/icons/AppIcon';
import Button from '../components/vehicle/Button';
import CarInfoSection from '../components/vehicle/CarInfoSection';
import DetailRow from '../components/vehicle/DetailRow';
import SectionCard from '../components/vehicle/SectionCard';
import ServiceHistorySection from '../components/vehicle/ServiceHistorySection';
import VehicleHero, { HERO_HEIGHT } from '../components/vehicle/VehicleHero';
import { CURRENCIES, estimateValue } from '../data/addVehicle';
import { getVehicleDetails } from '../data/vehicleDetails';
import { useAddVehicleDraft } from '../state/addVehicleDraft';
import { useGarage } from '../state/garage';
import { color, font, layout, radius, spacing } from '../theme/tokens';

const TITLE_HANDOFF = HERO_HEIGHT - 140;

// Last-resort hero when the draft carries no photos; disclosed placeholder.
const FALLBACK_IMAGE = require('../assets/cars/mini-cooper-hero.jpg');

function slug(value) {
  return (value || 'vehicle')
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** Distils the draft into the garage card the flow commits. */
function buildCard({ draft, purchase, photos, video }) {
  const name =
    draft.title || [draft.year, draft.make].filter(Boolean).join(' ') || 'New vehicle';
  const estimate = estimateValue({
    conditionId: draft.conditionId,
    mileage: draft.mileage,
    notApplicable: draft.notApplicable,
  });
  const image = photos?.items?.[0]?.image ?? video?.items?.[0]?.image ?? FALLBACK_IMAGE;
  return {
    id: `${slug(draft.registration || name)}-added`,
    name,
    price: estimate.label,
    estimate: estimate.label,
    delta: '5%',
    make: draft.make,
    logo: draft.logo,
    image,
  };
}

/** The user's own purchase entries, when they filled that step. */
function purchaseSection(purchase) {
  if (!purchase) return null;
  const symbol = CURRENCIES.find((c) => c.code === purchase.currency)?.symbol ?? '£';
  return {
    title: 'Purchase information',
    rows: [
      { id: 'year', label: 'Purchase year', value: purchase.year },
      { id: 'price', label: 'Purchase price', value: `${symbol}${purchase.price}` },
      { id: 'source', label: 'Purchased from', value: purchase.source },
    ],
  };
}

/** Overlays the draft's known specs onto the placeholder car-info grid. */
function carInfo(base, draft) {
  const overrides = {
    odometer: draft.mileage && `${Number(draft.mileage).toLocaleString()} miles`,
    year: draft.year,
    colour: draft.colour,
  };
  return base.map((item) => (overrides[item.id] ? { ...item, label: overrides[item.id] } : item));
}

/**
 * Add-vehicle review (per the "replicate vehicle details" request).
 *
 * A trimmed Vehicle Details page for the draft: the reminders, market, similar-
 * sold and insurance sections are dropped. Identity, valuation and purchase come
 * from the draft; the remaining sections borrow a default profile as placeholder
 * until the vehicle has its own data. "Save vehicle" commits it to My Garage.
 */
export default function ReviewDetailsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [frameWidth, setFrameWidth] = useState(Math.min(width, layout.frameWidth));
  const scrollY = useRef(new Animated.Value(0)).current;

  const { draft, purchase, history, photos, video, reset } = useAddVehicleDraft();
  const { addVehicle } = useGarage();

  const card = buildCard({ draft: draft ?? {}, purchase, photos, video });
  const vehicle = getVehicleDetails(card.id, card);
  const purchaseData = purchaseSection(purchase) ?? vehicle.purchase;
  const carInfoItems = carInfo(vehicle.carInfo, draft ?? {});
  const serviceHistory = history?.entries?.length ? history.entries : vehicle.serviceHistory;

  const headerTop = Math.max(insets.top, layout.headerTop);

  const navOpacity = scrollY.interpolate({
    inputRange: [TITLE_HANDOFF, TITLE_HANDOFF + 60],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const heroOpacity = scrollY.interpolate({
    inputRange: [TITLE_HANDOFF, TITLE_HANDOFF + 60],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const [navActive, setNavActive] = useState(false);
  const onScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
    useNativeDriver: true,
    listener: (e) => {
      const past = e.nativeEvent.contentOffset.y > TITLE_HANDOFF + 30;
      setNavActive((prev) => (prev === past ? prev : past));
    },
  });

  const confirm = () => {
    addVehicle(card);
    reset();
    // Land on My Garage with the new card present; drop the whole add-vehicle
    // stack so Back does not return into the finished flow.
    navigation.navigate('MyGarage');
  };

  return (
    <View style={styles.screen} onLayout={(e) => setFrameWidth(e.nativeEvent.layout.width)}>
      <Animated.ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onScroll}
      >
        <VehicleHero vehicle={vehicle} width={frameWidth} />

        <View style={styles.sections}>
          <SectionCard gap={spacing[5]}>
            <View style={styles.valuationHead}>
              <Text style={styles.sectionTitle}>Valuation</Text>
              <Text style={styles.valuationUpdated}>{vehicle.valuation.updated}</Text>
              <View style={styles.valuationValueRow}>
                <Text style={styles.valuationValue}>{vehicle.valuation.value}</Text>
                <AppIcon name="circle-info" size={20} color={color.icon.neutralRegular} />
              </View>
            </View>
            <Text style={styles.blurb}>{vehicle.valuation.blurb}</Text>
          </SectionCard>

          <SectionCard title={purchaseData.title} gap={spacing[5]}>
            <View style={styles.rows}>
              {purchaseData.rows.map((row) => (
                <DetailRow key={row.id} label={row.label} value={row.value} />
              ))}
            </View>
          </SectionCard>

          <CarInfoSection items={carInfoItems} onEdit={() => navigation.goBack()} />

          <SectionCard title={vehicle.mot.title} gap={spacing[5]}>
            <View style={styles.rows}>
              <DetailRow
                label="Status"
                value={vehicle.mot.status}
                leading={<Feather name="check-circle" size={16} color={color.text.neutralBold} />}
              />
              {vehicle.mot.rows.map((row) => (
                <DetailRow key={row.id} label={row.label} value={row.value} />
              ))}
            </View>
          </SectionCard>

          <ServiceHistorySection entries={serviceHistory} onAdd={() => navigation.goBack()} />
        </View>
      </Animated.ScrollView>

      <Animated.View
        style={[styles.floatingControls, { top: headerTop, opacity: heroOpacity }]}
        pointerEvents={navActive ? 'none' : 'box-none'}
      >
        <Pressable
          style={styles.heroButton}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Back"
          hitSlop={8}
        >
          <Feather name="chevron-left" size={17} color="#ececec" />
        </Pressable>
      </Animated.View>

      <Animated.View
        style={[styles.navBar, { paddingTop: headerTop, opacity: navOpacity }]}
        pointerEvents={navActive ? 'box-none' : 'none'}
      >
        <Pressable
          style={styles.stickyButton}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Back"
          hitSlop={8}
        >
          <Feather name="chevron-left" size={22} color={color.icon.neutralBold} />
        </Pressable>
        <Text style={styles.navTitle} numberOfLines={1}>
          {vehicle.title}
        </Text>
      </Animated.View>

      <View style={[styles.footer, { paddingBottom: insets.bottom || spacing[4] }]}>
        <Button
          label="Save vehicle"
          leading={<Feather name="check" size={18} color={color.text.inverseBold} />}
          onPress={confirm}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.background.neutralWhite,
  },
  content: {
    // Clears the sticky action bar; spacing has no [10] key, so this was
    // resolving to undefined and the last section sat under the bar.
    paddingBottom: 120,
  },
  sections: {
    padding: spacing[4],
    gap: spacing[4],
  },
  rows: {
    gap: spacing[3],
  },
  sectionTitle: {
    ...font.bodyEmphasized,
    color: color.text.neutralBold,
  },
  valuationHead: {
    gap: spacing[1],
  },
  valuationUpdated: {
    ...font.caption2Regular,
    color: color.text.neutralRegular,
  },
  valuationValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    marginTop: spacing[2],
  },
  valuationValue: {
    ...font.title2Emphasized,
    color: color.text.neutralBold,
  },
  blurb: {
    ...font.bodyXsRegular,
    color: color.text.neutralRegular,
  },
  navBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2.5],
    backgroundColor: color.background.neutralWhite,
    paddingHorizontal: spacing[4],
    paddingBottom: layout.headerBottom,
    borderBottomWidth: 1,
    borderBottomColor: color.border.neutralSubtle,
  },
  navTitle: {
    ...font.bodyEmphasized,
    color: color.text.neutralBold,
    flex: 1,
  },
  floatingControls: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
  },
  heroButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  stickyButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    backgroundColor: color.background.neutralWhite,
    borderTopWidth: 1,
    borderTopColor: color.border.neutralSubtle,
  },
});
