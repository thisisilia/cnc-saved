import { Feather } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheet from '../components/BottomSheet';
import ConfirmSheet from '../components/ConfirmSheet';
import DatePickerSheet from '../components/DatePickerSheet';
import MileageBlock from '../components/addVehicle/MileageBlock';
import AppIcon from '../components/icons/AppIcon';
import NotificationSheet from '../components/NotificationSheet';
import PerformanceChart from '../components/PerformanceChart';
import ReminderSummaryCard from '../components/ReminderSummaryCard';
import Button from '../components/vehicle/Button';
import CarInfoSection from '../components/vehicle/CarInfoSection';
import DetailRow from '../components/vehicle/DetailRow';
import CircleInfo from '../components/icons/CircleInfo';
import GradeScale from '../components/vehicle/GradeScale';
import InsuranceAd from '../components/InsuranceAd';
import MarketSection from '../components/vehicle/MarketSection';
import SectionCard from '../components/vehicle/SectionCard';
import SellBar from '../components/vehicle/SellBar';
import SellSheet from '../components/vehicle/SellSheet';
import ServiceHistorySection from '../components/vehicle/ServiceHistorySection';
import ValuationSheet from '../components/vehicle/ValuationSheet';
import ShareSheet from '../components/vehicle/ShareSheet';
import WelcomeCarAlert from '../components/vehicle/WelcomeCarAlert';
import VehicleHero, { HERO_HEIGHT } from '../components/vehicle/VehicleHero';
import { buildMileage, getVehicleDetails } from '../data/vehicleDetails';
import { gradeRange } from '../data/portfolio';
import { useGarage } from '../state/garage';
import { applyVehicleEdits, useVehicleEdits } from '../state/vehicleEdits';
import { color, font, layout, radius, spacing } from '../theme/tokens';

const parseMileage = (value = '') => {
  const match = String(value).match(/^([\d,.]+)\s*(miles|km)?/i);
  return {
    amount: match?.[1]?.replace(/,/g, '') ?? '',
    unit: match?.[2]?.toLowerCase() === 'km' ? 'km' : 'miles',
  };
};

/** Today as DD/MM/YYYY — the default for a new mileage record's date. */
const todayLabel = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};

/** The hero title clears the nav bar around here, so the nav title takes over. */
const TITLE_HANDOFF = HERO_HEIGHT - 140;

/**
 * Page control. Over the hero it is a translucent square with a light glyph;
 * once the sticky header takes over it becomes a bare dark glyph on white.
 */
function ControlButton({ icon, label, onPress, sticky = false }) {
  return (
    <Pressable
      style={[styles.heroButton, sticky && styles.stickyButton]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
    >
      <Feather name={icon} size={sticky ? 22 : 17} color={sticky ? color.icon.neutralBold : '#ececec'} />
    </Pressable>
  );
}

/** Prompt shown when a section the owner should fill is still empty. */
function EmptyStateCard({ icon, title, message, cta, onPress }) {
  return (
    <SectionCard gap={spacing[3]}>
      <View style={styles.emptyState}>
        <AppIcon name={icon} size={24} color={color.icon.brandPrimaryRegular} />
        <Text style={styles.emptyTitle}>{title}</Text>
        <Text style={styles.emptyMessage}>{message}</Text>
      </View>
      <Button label={cta} onPress={onPress} />
    </SectionCard>
  );
}

export default function VehicleDetailsScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [frameWidth, setFrameWidth] = useState(Math.min(width, layout.frameWidth));
  const [frameHeight, setFrameHeight] = useState(0);
  // Y offset of the Market section — the sticky Sell bar appears once it reaches
  // the top (the Valuation card, with its own "Sell this car", is above it).
  const [marketY, setMarketY] = useState(0);
  const [sellActive, setSellActive] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const lastY = useRef(0);
  // Whether the sticky Sell bar has been triggered (Market section reached).
  const sellArmed = useRef(false);
  // Accumulated scroll in the current direction, so a stray pixel doesn't flip it.
  const sellAccum = useRef(0);
  // Slide the bar up/down smoothly with scroll direction (0 hidden → 1 shown).
  const sellBar = useRef(new Animated.Value(0)).current;
  const [sellBarHeight, setSellBarHeight] = useState(120);
  const { getEdits, saveEdits } = useVehicleEdits();
  const { removeVehicle } = useGarage();
  const id = route.params?.id;
  // Owner edits from the edit flows override the static/added detail.
  const vehicle = applyVehicleEdits(getVehicleDetails(id), getEdits(id));

  const openHub = () => navigation.navigate('EditDetails', { id });
  // Inline section buttons go straight to their form; the hub is only via the
  // kebab menu.
  const openSection = (section) => navigation.navigate('EditVehicle', { id, section });

  const headerTop = Math.max(insets.top, layout.headerTop);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [valuationOpen, setValuationOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [sellOpen, setSellOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  // A just-added car opens here with the welcome prompt over its detail page —
  // but only after the page itself has painted, so the modal reads as appearing
  // *on top of* the vehicle rather than before it.
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  useEffect(() => {
    if (!route.params?.welcome) return undefined;
    const timer = setTimeout(() => setWelcomeOpen(true), 650);
    return () => clearTimeout(timer);
  }, [route.params?.welcome]);

  const startAdvert = () => {
    setSellOpen(false);
    navigation.navigate('CreateAdvert', { id });
  };

  const hasPurchase = Boolean(vehicle.purchase?.rows?.length);

  // Car-info order per the comp (column-major: the section fills the left column
  // then the right). Odometer is dropped — mileage has its own section.
  const DETAIL_ORDER = ['steering', 'registration', 'transmission', 'fuel', 'engine', 'year', 'colour'];
  const carInfoDisplay = DETAIL_ORDER.map((key) =>
    vehicle.carInfo.find((item) => item.id === key)
  ).filter(Boolean);

  // Mileage is derived from the current odometer so edits show immediately, and
  // is edited in a bottom sheet rather than a page.
  const odometer = parseMileage(vehicle.carInfo.find((i) => i.id === 'odometer')?.label);
  const mileage = buildMileage(odometer.amount);
  const [mileageOpen, setMileageOpen] = useState(false);
  const [milesAmount, setMilesAmount] = useState(odometer.amount);
  const [milesUnit, setMilesUnit] = useState(odometer.unit);
  const [milesNA, setMilesNA] = useState(false);
  const [milesDate, setMilesDate] = useState('');
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const openMileage = () => {
    setMilesAmount(odometer.amount);
    setMilesUnit(odometer.unit);
    setMilesNA(false);
    setMilesDate('');
    setMileageOpen(true);
  };
  const saveMileage = () => {
    const label = milesNA
      ? 'Not applicable'
      : `${Number(milesAmount || 0).toLocaleString('en-GB')} ${milesUnit}`;
    const next = vehicle.carInfo.some((i) => i.id === 'odometer')
      ? vehicle.carInfo.map((i) => (i.id === 'odometer' ? { ...i, label } : i))
      : [...vehicle.carInfo, { id: 'odometer', glyph: 'dial', label }];
    saveEdits(id, { carInfo: next });
    setMileageOpen(false);
  };

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

  // "Sell my car" appears once the Valuation card — which already carries the
  // in-page "Sell this car" — has scrolled out of view, i.e. the Market section
  // reaches the top under the pinned nav bar.
  const sellThreshold =
    marketY > 0 && frameHeight > 0 ? Math.max(marketY - (headerTop + 44), 0) : null;

  const [navActive, setNavActive] = useState(false);
  const onScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
    useNativeDriver: true,
    listener: (e) => {
      const y = e.nativeEvent.contentOffset.y;
      const dy = y - lastY.current;
      lastY.current = y;

      const navPast = y > TITLE_HANDOFF + 30;
      setNavActive((prev) => (prev === navPast ? prev : navPast));

      // The sticky Sell bar appears once the Market section reaches the top and
      // then stays put while the user reads — scrolling slowly down (past the
      // market) keeps it visible. Only a fast fling *down* hides it, to free up
      // the content area; any slower scroll (or scrolling up) brings it back. It
      // never shows above the Market section.
      // The sticky Sell bar appears once the Market section reaches the top, then
      // hides on scrolling down and reappears on scrolling up. A small
      // accumulation threshold keeps a stray pixel from flipping it. It never
      // shows above the Market section.
      const past = sellThreshold != null && y > sellThreshold;
      if (!past) {
        sellArmed.current = false;
        sellAccum.current = 0;
        setSellActive(false);
      } else if (!sellArmed.current) {
        sellArmed.current = true;
        sellAccum.current = 0;
        setSellActive(true);
      } else {
        if ((dy > 0 && sellAccum.current < 0) || (dy < 0 && sellAccum.current > 0)) {
          sellAccum.current = 0;
        }
        sellAccum.current += dy;
        if (sellAccum.current > 48) setSellActive(false);
        else if (sellAccum.current < -32) setSellActive(true);
      }
    },
  });

  // Slide the sticky bar in/out smoothly whenever its shown-state flips.
  useEffect(() => {
    Animated.timing(sellBar, {
      toValue: sellActive ? 1 : 0,
      duration: 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [sellActive, sellBar]);
  const sellBarTranslate = sellBar.interpolate({
    inputRange: [0, 1],
    outputRange: [sellBarHeight + 24, 0],
  });

  const goBack = () => navigation.goBack();

  const deleteVehicle = () => {
    setConfirmDelete(false);
    removeVehicle(id);
    navigation.navigate('MyGarage');
  };

  return (
    <View
      style={styles.screen}
      onLayout={(e) => {
        setFrameWidth(e.nativeEvent.layout.width);
        setFrameHeight(e.nativeEvent.layout.height);
      }}
    >
      <Animated.ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onScroll}
      >
        <VehicleHero vehicle={vehicle} width={frameWidth} onAddPhotos={() => navigation.navigate('PhotosVideo', { id })} />

        <View style={styles.sections}>
          <SectionCard>
            <ReminderSummaryCard
              lines={vehicle.reminderSummary}
              onSeeAll={() => setNotificationsOpen(true)}
              bare
              showIcon={false}
            />
            <View style={styles.rows}>
              {vehicle.reminders.map((row) => (
                <DetailRow key={row.id} label={row.label} value={row.value} />
              ))}
            </View>
          </SectionCard>

          <SectionCard gap={spacing[5]}>
            <View style={styles.valuationMain}>
              <Pressable
                style={styles.valuationTitleRow}
                onPress={() => setValuationOpen(true)}
                accessibilityRole="button"
                accessibilityLabel="Valuation information"
                hitSlop={8}
              >
                <Text style={styles.sectionTitle}>Valuations</Text>
                <CircleInfo size={20} color={color.text.neutralRegular} />
              </Pressable>
              <View style={styles.valuationValueBlock}>
                <Text style={styles.valuationValue}>
                  {gradeRange(vehicle.valuation.grades, vehicle.valuation.value)}
                </Text>
                <Text style={styles.valuationUpdated}>{vehicle.valuation.updated}</Text>
              </View>
              <View style={styles.conditionBlock}>
                <Text style={styles.conditionTitle}>Vehicle condition</Text>
                <GradeScale grades={vehicle.valuation.grades} />
              </View>
            </View>
            <Text style={styles.blurb}>{vehicle.valuation.blurb}</Text>
            <View style={styles.actions}>
              <Button label="Sell this car" onPress={() => setSellOpen(true)} />
              <Button label="Get expert valuation" variant="secondary" onPress={() => {}} />
            </View>
          </SectionCard>

          <View onLayout={(e) => setMarketY(HERO_HEIGHT + e.nativeEvent.layout.y)}>
            <MarketSection
              market={vehicle.market}
              recentlySold={vehicle.recentlySold}
              similar={vehicle.similar}
              showBought
            />
          </View>

          <InsuranceAd ctaLabel="Get a quote in minutes" onGetQuote={() => {}} />

          {hasPurchase ? (
            <SectionCard title={vehicle.purchase.title} gap={spacing[5]}>
              <View style={styles.rows}>
                {vehicle.purchase.rows.map((row) => (
                  <DetailRow key={row.id} label={row.label} value={row.value} />
                ))}
              </View>
              <Button label="Edit details" variant="outline" onPress={() => openSection('purchase')} />
            </SectionCard>
          ) : (
            <EmptyStateCard
              icon="file-invoice-dollar"
              title="Add purchase details"
              message="Without your purchase details, your vehicle insights and valuation may be less accurate."
              cta="Add purchase details"
              onPress={() => openSection('purchase')}
            />
          )}

          <CarInfoSection items={carInfoDisplay} onEdit={() => openSection('details')} />

          <SectionCard title="Mileage" gap={spacing[4]}>
            <Text style={styles.mileageValue}>{mileage.value}</Text>
            <PerformanceChart
              style={styles.mileageChart}
              points={mileage.points}
              baseline={mileage.points[0]?.value ?? 0}
              axisMax={mileage.axisMax}
              formatYAxis={(v) => (v >= 1000 ? `${Math.round(v / 1000)}K` : `${v}`)}
              hideBaseline
              showMarkers
            />
            <Button label="Update mileage" variant="outline" onPress={openMileage} />
          </SectionCard>

          {vehicle.serviceHistory.length > 0 ? (
            <ServiceHistorySection
              entries={vehicle.serviceHistory}
              onAdd={() => navigation.navigate('History', { id })}
              onSeeAll={() => navigation.navigate('History', { id })}
            />
          ) : (
            <EmptyStateCard
              icon="screwdriver-wrench"
              title="Add vehicle history"
              message="Add service records, MOTs and past work to build a timeline buyers can trust."
              cta="Add record"
              onPress={() => navigation.navigate('History', { id })}
            />
          )}
        </View>
      </Animated.ScrollView>

      {/*
        Two pinned header states that cross-fade as the hero title scrolls away.
        Only the active one takes touches, so Back is always hit-testable.
      */}
      <Animated.View
        style={[styles.floatingControls, { top: headerTop, opacity: heroOpacity }]}
        pointerEvents={navActive ? 'none' : 'box-none'}
      >
        <ControlButton icon="chevron-left" label="Back" onPress={goBack} />
        <View style={styles.controlGroup}>
          <ControlButton icon="share-2" label="Share vehicle" onPress={() => setShareOpen(true)} />
          <ControlButton icon="more-vertical" label="Vehicle options" onPress={() => setOptionsOpen(true)} />
        </View>
      </Animated.View>

      <Animated.View
        style={[styles.navBar, { paddingTop: headerTop, opacity: navOpacity }]}
        pointerEvents={navActive ? 'box-none' : 'none'}
      >
        <ControlButton icon="chevron-left" label="Back" onPress={goBack} sticky />
        <View style={styles.navTitleBlock}>
          <Text style={styles.navTitle} numberOfLines={1}>
            {vehicle.title}
          </Text>
          <Text style={styles.navSummary} numberOfLines={1}>
            {vehicle.summary}
          </Text>
        </View>
        <View style={styles.controlGroup}>
          <ControlButton icon="share-2" label="Share vehicle" onPress={() => setShareOpen(true)} sticky />
          <ControlButton icon="more-vertical" label="Vehicle options" onPress={() => setOptionsOpen(true)} sticky />
        </View>
      </Animated.View>

      {/* Floating sticky bar: overlays the bottom so hiding it (on scroll down)
          frees the whole content area. It slides off-screen until armed. */}
      <Animated.View
        style={[styles.sellBar, { transform: [{ translateY: sellBarTranslate }], opacity: sellBar }]}
        onLayout={(e) => setSellBarHeight(e.nativeEvent.layout.height)}
        pointerEvents={sellActive ? 'auto' : 'none'}
      >
        <SellBar onSell={() => setSellOpen(true)} />
      </Animated.View>

      <ShareSheet
        visible={shareOpen}
        onClose={() => setShareOpen(false)}
        image={vehicle.photos?.[0] ?? vehicle.heroImage}
        registration={vehicle.registration}
        name={vehicle.name}
      />

      <SellSheet
        visible={sellOpen}
        onClose={() => setSellOpen(false)}
        onCreateAdvert={startAdvert}
        onAuction={() => setSellOpen(false)}
      />

      <NotificationSheet
        visible={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        reminders={vehicle.notifications}
      />

      <ValuationSheet
        visible={valuationOpen}
        onClose={() => setValuationOpen(false)}
        valuation={vehicle.valuation}
      />

      <BottomSheet visible={optionsOpen} onClose={() => setOptionsOpen(false)}>
        <View style={styles.optionsBody}>
          <Pressable
            style={({ pressed }) => [styles.optionPill, pressed && styles.optionPressed]}
            onPress={() => {
              setOptionsOpen(false);
              openHub();
            }}
            accessibilityRole="button"
            accessibilityLabel="Edit details"
          >
            <Text style={styles.optionLabel}>Edit details</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.optionPill, pressed && styles.optionPressed]}
            onPress={() => {
              setOptionsOpen(false);
              setConfirmDelete(true);
            }}
            accessibilityRole="button"
            accessibilityLabel="I no longer own the vehicle"
          >
            <Text style={[styles.optionLabel, styles.optionDanger]}>I no longer own the vehicle</Text>
          </Pressable>
        </View>
      </BottomSheet>

      <ConfirmSheet
        visible={confirmDelete}
        title="No longer own this vehicle?"
        message="We'll remove this vehicle from My Garage, along with its photos, history and records. This cannot be undone."
        confirmLabel="Remove vehicle"
        onConfirm={deleteVehicle}
        onClose={() => setConfirmDelete(false)}
      />

      <BottomSheet
        visible={mileageOpen}
        onClose={() => setMileageOpen(false)}
        hideGrabber={datePickerOpen}
        topInset={40}
        fill
      >
        <View style={styles.mileageSheet}>
          <View style={styles.mileageCard}>
            <Text style={styles.mileageCardTitle}>Mileage</Text>
            <MileageBlock
              mileage={milesAmount}
              onChangeMileage={setMilesAmount}
              unit={milesUnit}
              onChangeUnit={setMilesUnit}
              notApplicable={milesNA}
              onChangeNotApplicable={setMilesNA}
            />
            <Pressable
              style={styles.dateField}
              onPress={() => setDatePickerOpen(true)}
              accessibilityRole="button"
              accessibilityLabel="Recorded date"
            >
              {milesDate ? <Text style={styles.dateFloatLabel}>Recorded date</Text> : null}
              <Text style={[styles.dateInput, !milesDate && styles.datePlaceholder]}>
                {milesDate || 'Recorded date'}
              </Text>
            </Pressable>
          </View>
          <Button label="Update mileage" onPress={saveMileage} />
        </View>
      </BottomSheet>

      <DatePickerSheet
        visible={datePickerOpen}
        mode="date"
        value={milesDate}
        onClose={() => setDatePickerOpen(false)}
        onConfirm={setMilesDate}
      />

      <WelcomeCarAlert
        visible={welcomeOpen}
        onStart={() => {
          setWelcomeOpen(false);
          navigation.navigate('Photographs', { id, next: 'VehicleDetails' });
        }}
        onSkip={() => setWelcomeOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.background.neutralWhite,
  },
  sellBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    paddingBottom: spacing[4],
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
  valuationMain: {
    gap: spacing[4],
  },
  valuationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    alignSelf: 'flex-start',
  },
  valuationValueBlock: {
    gap: spacing[1],
  },
  valuationUpdated: {
    ...font.labelSm,
    color: color.text.neutralRegular,
  },
  valuationValue: {
    ...font.title2Emphasized,
    color: color.text.neutralBold,
  },
  conditionBlock: {
    gap: spacing[2],
  },
  conditionTitle: {
    ...font.bodySmEmphasized,
    color: color.text.neutralBold,
  },
  gradePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    minHeight: 24,
    paddingHorizontal: spacing[2.5],
    borderRadius: radius.full,
    backgroundColor: color.background.brandPrimaryBold,
  },
  gradePillLabel: {
    ...font.bodyXsEmphasized,
    color: color.text.inverseBold,
  },
  blurb: {
    ...font.bodyXsRegular,
    color: color.text.neutralRegular,
  },
  actions: {
    gap: spacing[4],
  },
  emptyState: {
    alignItems: 'center',
    gap: spacing[2],
    paddingTop: spacing[2],
  },
  emptyTitle: {
    ...font.bodyEmphasized,
    color: color.text.neutralBold,
  },
  emptyMessage: {
    ...font.bodySmRegular,
    color: color.text.neutralRegular,
    textAlign: 'center',
  },
  mileageValue: {
    ...font.title2Emphasized,
    color: color.text.neutralBold,
  },
  mileageChart: {
    height: 150,
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
  navTitleBlock: {
    flex: 1,
    minWidth: 0,
  },
  navSummary: {
    ...font.bodyXsRegular,
    color: color.text.neutralRegular,
  },
  navTitle: {
    ...font.bodyEmphasized,
    color: color.text.neutralBold,
  },
  controlGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  floatingControls: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    backgroundColor: 'transparent',
  },
  optionsBody: {
    alignSelf: 'stretch',
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
    gap: spacing[3],
  },
  optionPill: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
    backgroundColor: color.background.neutralRegular,
  },
  optionPressed: {
    opacity: 0.7,
  },
  optionLabel: {
    ...font.calloutEmphasized,
    color: color.text.neutralBold,
  },
  optionDanger: {
    color: color.text.dangerBold,
  },
  mileageSheet: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
    paddingBottom: spacing[2],
    gap: spacing[4],
  },
  mileageCard: {
    backgroundColor: color.background.neutralSubtle,
    borderRadius: radius.lg,
    padding: spacing[4],
    gap: spacing[3],
  },
  mileageCardTitle: {
    ...font.bodyEmphasized,
    color: color.text.neutralBold,
  },
  dateField: {
    minHeight: 52,
    justifyContent: 'center',
    gap: 2,
    backgroundColor: color.background.neutralWhite,
    borderWidth: 1,
    borderColor: color.border.neutralSubtle,
    borderRadius: radius.md,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  dateFloatLabel: {
    ...font.bodyXsRegular,
    color: color.text.neutralRegular,
  },
  dateInput: {
    ...font.calloutRegular,
    color: color.text.neutralBold,
    padding: 0,
    outlineStyle: 'none',
  },
  datePlaceholder: {
    color: color.text.neutralRegular,
  },
});
