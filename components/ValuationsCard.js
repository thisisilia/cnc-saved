import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { color, font, radius, spacing } from '../theme/tokens';
import DecorativeIcon from './saved/DecorativeIcon';
import EmptyPrompt from './saved/EmptyPrompt';
import SectionHeading from './SectionHeading';
import TrendDelta from './TrendDelta';

function ValuationTile({ valuation, onPress }) {
  return (
    <Pressable
      style={styles.tile}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${valuation.name}, ${valuation.price}`}
    >
      {/* Brand-green rule pinned to the leading edge, over the border. */}
      <View style={styles.accent} />
      <View style={styles.tileContent}>
        <View style={styles.tileHeader}>
          <Text style={styles.name} numberOfLines={1}>
            {valuation.name}
          </Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{valuation.price}</Text>
            <TrendDelta value={valuation.delta} />
          </View>
        </View>
        <Text style={styles.expiry}>{valuation.expiry}</Text>
      </View>
    </Pressable>
  );
}

export default function ValuationsCard({
  title,
  subtitle,
  valuations,
  onSeeAll,
  onSelect,
  onAdd,
  variant = 'multiple',
}) {
  if (variant === 'empty') {
    return (
      <Pressable
        style={styles.card}
        onPress={onAdd}
        accessibilityRole="button"
        accessibilityLabel="Get a free market valuation"
      >
        <EmptyPrompt
          icon={<DecorativeIcon name="valuations" />}
          title="Valuations"
          subtitle="Get a free market valuation"
        />
      </Pressable>
    );
  }

  if (variant === 'single') {
    const valuation = valuations[0];
    return (
      <View style={styles.card}>
        <SectionHeading title={title} subtitle={undefined} onPress={onSeeAll} />
        <ValuationTile valuation={valuation} onPress={onSelect ? () => onSelect(valuation) : undefined} />
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <SectionHeading title={title} subtitle={subtitle} onPress={onSeeAll} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.listScroll}
        contentContainerStyle={styles.list}
      >
        {valuations.map((valuation) => (
          <ValuationTile
            key={valuation.id}
            valuation={valuation}
            onPress={onSelect ? () => onSelect(valuation) : undefined}
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
  // Run the carousel to the card edge so a peeking tile isn't clipped early.
  listScroll: {
    marginHorizontal: -spacing[4],
  },
  list: {
    gap: spacing[3],
    paddingHorizontal: spacing[4],
  },
  tile: {
    width: 180,
    backgroundColor: color.background.neutralWhite,
    borderWidth: 1,
    borderColor: color.icon.inverseBold,
    borderRadius: spacing[2.5],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    overflow: 'hidden',
  },
  accent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: color.background.brandPrimaryBold,
  },
  tileContent: {
    gap: spacing[2],
  },
  tileHeader: {
    gap: spacing[1],
  },
  name: {
    ...font.bodySmEmphasized,
    color: color.text.neutralBold,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  price: {
    ...font.bodySmEmphasized,
    color: color.text.neutralBold,
  },
  expiry: {
    ...font.bodyXsRegular,
    color: color.text.neutralRegular,
  },
});
