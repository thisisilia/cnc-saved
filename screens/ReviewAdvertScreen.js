import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppIcon from '../components/icons/AppIcon';
import PenToSquareIcon from '../components/vehicle/PenToSquareIcon';
import { ADVERT_CONFIRM, ADVERT_LOCATION, ADVERT_PRIVACY, CURRENCIES } from '../data/sell';
import { getVehicleDetails } from '../data/vehicleDetails';
import { useAdvertDraft } from '../state/advertDraft';
import { applyVehicleEdits, useVehicleEdits } from '../state/vehicleEdits';
import { color, font, radius, size, spacing } from '../theme/tokens';

/** Small pencil affordance next to each editable section label. */
function EditButton({ label, onPress }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`Edit ${label}`} hitSlop={8}>
      <PenToSquareIcon size={18} color={color.icon.neutralRegular} />
    </Pressable>
  );
}

function SectionLabel({ children, onEdit, editLabel }) {
  return (
    <View style={styles.sectionLabelRow}>
      <Text style={styles.sectionLabel}>{children}</Text>
      {onEdit ? <EditButton label={editLabel} onPress={onEdit} /> : null}
    </View>
  );
}

function DetailCell({ glyph, label }) {
  if (!label) return <View style={styles.detailCell} />;
  return (
    <View style={styles.detailCell}>
      <AppIcon name={glyph} size={size[6]} color={color.text.neutralBold} />
      <Text style={styles.detailText}>{label}</Text>
    </View>
  );
}

/**
 * The finished advert as a buyer would see it — a listing preview, distinct from
 * the owner's vehicle page. Each section links back to where it's edited; the
 * seller confirms authority before continuing.
 */
export default function ReviewAdvertScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const id = route.params?.id;
  const { getEdits } = useVehicleEdits();
  const vehicle = applyVehicleEdits(getVehicleDetails(id), getEdits(id));
  const { description, price, currency } = useAdvertDraft(id);
  const [confirmed, setConfirmed] = useState(false);

  const cur = CURRENCIES.find((c) => c.id === currency) ?? CURRENCIES[0];
  const askingPrice = price != null ? `${cur.symbol}${Math.round(price * cur.rate).toLocaleString('en-GB')}` : '—';

  const byId = (key) => vehicle.carInfo.find((i) => i.id === key)?.label;
  const details = [
    { glyph: 'driver-side', label: byId('steering') },
    { glyph: 'dial', label: byId('odometer') },
    { glyph: 'gearbox', label: byId('transmission') },
    { glyph: 'engine', label: byId('engine') },
    { glyph: 'calendar', label: byId('year') },
    { glyph: 'fuel', label: byId('fuel') },
    { glyph: 'user', label: 'Private seller' },
    { glyph: 'colour', label: byId('colour') },
  ];

  const photos = vehicle.photos ?? [];
  const cover = photos[0] ?? vehicle.heroImage;

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing[4] }} showsVerticalScrollIndicator={false}>
        {/* Cover photo */}
        <View style={styles.cover}>
          {cover ? <Image source={cover} style={styles.coverImage} resizeMode="cover" /> : null}
          <Pressable
            style={[styles.coverBack, { top: Math.max(insets.top, 24) }]}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Back"
            hitSlop={8}
          >
            <Feather name="chevron-left" size={17} color="#ececec" />
          </Pressable>
          {photos.length > 0 && (
            <View style={styles.photoBadge}>
              <Feather name="image" size={13} color={color.text.inverseBold} />
              <Text style={styles.photoBadgeLabel}>{photos.length} photos</Text>
            </View>
          )}
        </View>

        <View style={styles.body}>
          <SectionLabel onEdit={() => navigation.navigate('Price', { id })} editLabel="asking price">
            ASKING PRICE
          </SectionLabel>
          <Text style={styles.price}>{askingPrice}</Text>

          <View style={styles.rule} />
          <SectionLabel>ADVERT TITLE</SectionLabel>
          <Text style={styles.title}>{vehicle.name}</Text>

          <View style={styles.rule} />
          <SectionLabel onEdit={() => navigation.navigate('EditVehicle', { id, section: 'details' })} editLabel="details">
            DETAILS
          </SectionLabel>
          <View style={styles.detailGrid}>
            {details.map((d, i) => (
              <DetailCell key={i} glyph={d.glyph} label={d.label} />
            ))}
          </View>

          <View style={styles.rule} />
          <SectionLabel editLabel="location" onEdit={() => {}}>
            VEHICLE LOCATION
          </SectionLabel>
          <View style={styles.locationRow}>
            <Feather name="map-pin" size={16} color={color.icon.neutralBold} />
            <Text style={styles.location}>{ADVERT_LOCATION}</Text>
          </View>

          <View style={styles.rule} />
          <SectionLabel onEdit={() => navigation.navigate('Description', { id })} editLabel="description">
            DESCRIPTION
          </SectionLabel>
          <Text style={styles.description}>{description || 'No description yet.'}</Text>

          {/* The confirmation scrolls with the content rather than pinning to the
              bottom, so the seller reaches it after reading the advert. */}
          <View style={styles.confirmCard}>
            <Pressable
              style={styles.confirmRow}
              onPress={() => setConfirmed((v) => !v)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: confirmed }}
              accessibilityLabel="Confirm authority to sell"
            >
              <View style={[styles.checkbox, confirmed && styles.checkboxOn]}>
                {confirmed && <Feather name="check" size={14} color={color.text.inverseBold} />}
              </View>
              <Text style={styles.confirmText}>
                {ADVERT_CONFIRM} <Text style={styles.privacy}>{ADVERT_PRIVACY}</Text>
              </Text>
            </Pressable>
            <Pressable
              style={[styles.continue, !confirmed && styles.continueDisabled]}
              disabled={!confirmed}
              onPress={() => navigation.navigate('AdvertPackage', { id })}
              accessibilityRole="button"
              accessibilityLabel="Continue"
            >
              <Text style={styles.continueLabel}>Continue</Text>
              <Feather name="arrow-right" size={18} color={color.text.inverseBold} />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.background.neutralWhite,
  },
  cover: {
    height: 240,
    backgroundColor: color.background.neutralRegular,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverBack: {
    position: 'absolute',
    left: spacing[4],
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  photoBadge: {
    position: 'absolute',
    left: spacing[4],
    bottom: spacing[3],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1.5],
    paddingHorizontal: spacing[2.5],
    paddingVertical: spacing[1.5],
    borderRadius: radius.md,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  photoBadgeLabel: {
    ...font.labelSm,
    color: color.text.inverseBold,
  },
  body: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
  },
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionLabel: {
    ...font.labelSm,
    color: color.text.neutralRegular,
    letterSpacing: 0.6,
  },
  price: {
    ...font.title3Emphasized,
    color: color.text.neutralBold,
    marginTop: spacing[1],
  },
  title: {
    ...font.title3Emphasized,
    color: color.text.neutralBold,
    marginTop: spacing[1],
  },
  rule: {
    height: 1,
    backgroundColor: color.border.neutralSubtle,
    marginVertical: spacing[4],
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing[2],
    rowGap: spacing[3],
  },
  detailCell: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingRight: spacing[2],
  },
  detailText: {
    ...font.subheadlineRegular,
    color: color.text.neutralBold,
    flex: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginTop: spacing[2],
  },
  location: {
    ...font.subheadlineRegular,
    color: color.text.neutralBold,
  },
  description: {
    ...font.subheadlineRegular,
    color: color.text.neutralRegular,
    marginTop: spacing[2],
    lineHeight: 22,
  },
  confirmCard: {
    marginTop: spacing[5],
    padding: spacing[4],
    gap: spacing[4],
    borderRadius: radius.xl,
    backgroundColor: color.background.neutralSubtle,
  },
  confirmRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: color.border.neutralRegular,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: {
    backgroundColor: color.background.brandPrimaryRegular,
    borderColor: color.background.brandPrimaryRegular,
  },
  confirmText: {
    ...font.bodyXsRegular,
    color: color.text.neutralRegular,
    flex: 1,
  },
  privacy: {
    color: color.text.brandPrimaryRegular,
  },
  continue: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    minHeight: 52,
    borderRadius: radius.xl,
    backgroundColor: color.background.brandPrimaryRegular,
  },
  continueDisabled: {
    opacity: 0.4,
  },
  continueLabel: {
    ...font.bodyEmphasized,
    color: color.text.inverseBold,
  },
});
