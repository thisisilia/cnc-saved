import { LinearGradient } from 'expo-linear-gradient';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { color, font, radius, spacing } from '../theme/tokens';
import DecorativeIcon from './saved/DecorativeIcon';
import EmptyPrompt from './saved/EmptyPrompt';
import SectionHeading from './SectionHeading';
import Sparkline from './Sparkline';
import TrendDelta from './TrendDelta';

const CARD_WIDTH = 165;
const IMAGE_HEIGHT = 123;
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
          <TrendDelta value={vehicle.delta} />
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
              <TrendDelta value={delta} />
              <Text style={styles.caption}>{deltaCaption}</Text>
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
            <TrendDelta value={delta} />
            <Text style={styles.caption}>{deltaCaption}</Text>
          </View>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.listScroll}
        contentContainerStyle={styles.list}
      >
        {vehicles.map((vehicle) => (
          <VehicleTile
            key={vehicle.id}
            vehicle={vehicle}
            onPress={onSelectVehicle ? () => onSelectVehicle(vehicle) : undefined}
          />
        ))}
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
    width: 120,
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
