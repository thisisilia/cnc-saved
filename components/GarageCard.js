import { LinearGradient } from 'expo-linear-gradient';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { color, font, radius, spacing } from '../theme/tokens';
import { Feather } from '@expo/vector-icons';
import DecorativeIcon from './saved/DecorativeIcon';
import EmptyPrompt from './saved/EmptyPrompt';
import GainBadge from './GainBadge';
import SectionHeading from './SectionHeading';
import Sparkline from './Sparkline';
import { garageTotals } from '../data/garage';

// Icons/Images - icon.svg — gallery/stack glyph for the "See all" tile.
const IMAGES_ICON = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.24187 10.3049L2.53441 5.8813C2.37911 4.91468 2.7501 4.34328 3.63442 4.1671L9.44075 3.03859C10.3294 2.86717 10.847 3.26715 11.0066 4.23376L11.218 5.55751H12.1455C13.0427 5.55751 13.5 6.05272 13.5 7.03363V11.5239C13.5 12.5048 13.0427 13 12.1455 13H6.25288C5.34698 13 4.89835 12.5095 4.89835 11.5239V11.481L4.80776 11.5001C3.91481 11.6667 3.40148 11.2715 3.24187 10.3049ZM3.91913 10.1335C3.99678 10.6192 4.27286 10.8239 4.69992 10.743L4.89835 10.7049V7.03363C4.89835 6.05272 5.34698 5.55751 6.25288 5.55751H10.5149L10.3294 4.40519C10.2517 3.91949 9.96703 3.7195 9.54859 3.79569L3.76815 4.91945C3.34108 5.00039 3.14696 5.30038 3.22461 5.79083L3.91913 10.1335ZM5.59287 7.07648V11.043L6.56778 10.1049C6.73602 9.94777 6.89563 9.87158 7.06386 9.87158C7.24936 9.87158 7.42622 9.94777 7.59014 10.1144L8.28466 10.8049L10.0274 9.10019C10.2043 8.92401 10.3941 8.84782 10.6098 8.84782C10.8168 8.84782 11.0239 8.93353 11.1921 9.10495L12.8055 10.7858V7.07648C12.8055 6.58127 12.5596 6.32414 12.1325 6.32414H6.2615C5.83013 6.32414 5.59287 6.58127 5.59287 7.07648ZM7.97407 9.20971C7.46936 9.20971 7.05955 8.74783 7.05955 8.19071C7.05955 7.64312 7.46936 7.18124 7.97407 7.18124C8.47446 7.18124 8.88427 7.64312 8.88427 8.19071C8.88427 8.74783 8.47446 9.20971 7.97407 9.20971Z" fill="#ECECEC"/></svg>`;

const CARD_WIDTH = 165;
const IMAGE_HEIGHT = 123;
// Saved-page garage card shows at most this many vehicles; the rest collapse
// into a "See all" tile (Figma 1322-28018).
const MAX_TILES = 3;
// Sized so the single-vehicle card matches the multiple card's overall height
// (header + gap + tile row), rather than standing taller.
const HERO_HEIGHT = 185;

function VehicleTile({ vehicle, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityLabel={vehicle.name}
    >
      <View style={styles.imageFrame}>
        <Image source={vehicle.image} style={styles.image} resizeMode="cover" />
      </View>
      <View style={styles.tileContent}>
        <Text style={styles.tileTitle}>{vehicle.name}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{vehicle.price}</Text>
          <GainBadge value={vehicle.delta} profit={vehicle.profit} />
        </View>
      </View>
    </Pressable>
  );
}

/** Collapsed "See all" tile shown when the garage has more than MAX_TILES cars. */
function SeeAllTile({ vehicle, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="See all my vehicle list"
    >
      <View style={styles.imageFrame}>
        <Image source={vehicle.image} style={styles.image} resizeMode="cover" />
        <View style={styles.seeAllOverlay}>
          <SvgXml xml={IMAGES_ICON} width={22} height={22} />
          <Text style={styles.seeAllText}>See all</Text>
        </View>
      </View>
      <View style={styles.tileContent}>
        <View style={styles.seeAllCaption}>
          <Text style={styles.tileTitle} numberOfLines={1}>
            See all my vehicle list
          </Text>
          <Feather name="chevron-right" size={14} color={color.icon.neutralBold} />
        </View>
      </View>
    </Pressable>
  );
}

export default function GarageCard({
  title,
  subtitle,
  delta,
  deltaCaption,
  vehicles,
  onPress,
  onSelectVehicle,
  onAdd,
  resume,
  highlighted = false,
  variant = 'multiple',
}) {
  const totals = garageTotals(vehicles || []);
  if (variant === 'empty') {
    return (
      <Pressable
        style={[styles.card, highlighted && styles.cardHighlighted]}
        onPress={onAdd}
        accessibilityRole="button"
        accessibilityLabel="Add vehicle to your garage"
      >
        {resume}
        <EmptyPrompt
          icon={<DecorativeIcon name="garage" />}
          title="Add vehicle to your garage"
          subtitle="Track the value of your vehicles"
        />
      </Pressable>
    );
  }

  if (variant === 'single') {
    const vehicle = vehicles[0];
    // Header (title + count on the left, trend chart on the right) sits above a
    // clean photo carrying just the vehicle name and price — matching the comp.
    return (
      <View style={styles.card}>
        {resume}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <SectionHeading title={title} subtitle={subtitle} onPress={onPress} />
          </View>
          <View style={styles.chartColumn}>
            <Sparkline width={120} height={25} />
            <View style={styles.chartCaption}>
              {/* Single view is one car, so mirror its own gain, not the
                  portfolio-computed return. */}
              <GainBadge
                value={vehicle?.delta ?? totals.gainLabel}
                profit={vehicle?.profit ?? totals.profitLabel}
              />
            </View>
          </View>
        </View>

        <Pressable
          style={styles.singleImage}
          onPress={onSelectVehicle && vehicle ? () => onSelectVehicle(vehicle) : undefined}
          accessibilityRole="button"
          accessibilityLabel={vehicle?.name}
        >
          <Image source={vehicle?.image} style={styles.heroImage} resizeMode="cover" />
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.05)', 'rgba(0,0,0,0.8)']}
            locations={[0, 0.45, 1]}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          <View style={styles.singleImageBottom} pointerEvents="none">
            <Text style={styles.heroName} numberOfLines={2}>
              {vehicle?.name}
            </Text>
            <Text style={styles.heroPrice}>{vehicle?.price}</Text>
          </View>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      {/* An unfinished vehicle setup rides at the top of the garage card. */}
      {resume}

      <View style={styles.header}>
        <View style={styles.headerText}>
          <SectionHeading title={title} subtitle={subtitle} onPress={onPress} />
        </View>
        <View style={styles.chartColumn}>
          {/* Chart + caption together match the title + count block beside it:
              25 + 4 gap + 18 caption = 47. */}
          <Sparkline width={120} height={25} />
          <View style={styles.chartCaption}>
            <GainBadge value={totals.gainLabel} profit={totals.profitLabel} />
          </View>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.listScroll}
        contentContainerStyle={styles.list}
      >
        {(() => {
          const overflow = vehicles.length > MAX_TILES;
          return (
            <>
              {vehicles.slice(0, MAX_TILES).map((vehicle) => (
                <VehicleTile
                  key={vehicle.id}
                  vehicle={vehicle}
                  onPress={onSelectVehicle ? () => onSelectVehicle(vehicle) : undefined}
                />
              ))}
              {overflow && <SeeAllTile vehicle={vehicles[MAX_TILES]} onPress={onPress} />}
            </>
          );
        })()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.background.neutralSubtle,
    borderRadius: radius.lg,
    padding: spacing[4],
    gap: spacing[4],
    overflow: 'hidden',
  },
  // Spotlight for the onboarding coachmark: a green tint (no shadow).
  cardHighlighted: {
    backgroundColor: color.background.brandPrimarySubtle,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[4],
  },
  headerText: {
    flex: 1,
  },
  chartColumn: {
    alignItems: 'flex-end',
    gap: spacing[1],
  },
  chartCaption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing[1],
  },
  caption: {
    ...font.bodyXsRegular,
    color: color.text.neutralRegular,
  },
  // Breaks the carousel out of the card's padding so a peeking tile is cut at
  // the card edge, not clipped early by the padding.
  listScroll: {
    marginHorizontal: -spacing[4],
  },
  list: {
    gap: spacing[3],
    paddingHorizontal: spacing[4],
  },
  tile: {
    width: CARD_WIDTH,
  },
  tilePressed: {
    opacity: 0.7,
  },
  imageFrame: {
    height: IMAGE_HEIGHT,
    borderRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  seeAllOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
    backgroundColor: 'rgba(30,31,30,0.55)',
  },
  seeAllText: {
    ...font.bodySmEmphasized,
    color: color.text.inverseBold,
  },
  seeAllCaption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  tileContent: {
    paddingTop: spacing[1],
    paddingHorizontal: spacing[1],
    gap: spacing[1],
  },
  tileTitle: {
    ...font.bodyXsEmphasized,
    color: color.text.neutralBold,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  price: {
    ...font.bodyXsEmphasized,
    color: color.text.neutralBold,
  },
  // Single-vehicle photo (name + price overlaid; header/chart sit above it).
  singleImage: {
    height: HERO_HEIGHT,
    borderRadius: radius.lg,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    backgroundColor: color.background.neutralRegular,
  },
  // Explicit size: an absolutely-positioned <img> otherwise renders at its
  // natural resolution instead of covering the card.
  heroImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  singleImageBottom: {
    padding: spacing[4],
    gap: spacing[1],
  },
  heroName: {
    ...font.bodyEmphasized,
    color: color.text.inverseBold,
  },
  heroPrice: {
    ...font.title3Emphasized,
    color: color.text.inverseBold,
  },
});
