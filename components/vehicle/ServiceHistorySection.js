import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { color, font, radius, spacing } from '../../theme/tokens';
import AppIcon from '../icons/AppIcon';
import Button from './Button';
import SectionCard from './SectionCard';

const DOT = 12;
const RAIL_X = 6; // centre of the dot, so the rail runs through it

function Entry({ entry, last }) {
  return (
    <View style={styles.entry}>
      <View style={styles.dotColumn}>
        <View style={styles.dot} />
      </View>
      <View style={[styles.body, !last && styles.bodySpacing]}>
        {entry.mot ? (
          <>
            <View style={styles.motHead}>
              <Text style={styles.date}>{entry.date}</Text>
              <View style={styles.passed}>
                <Text style={styles.passedLabel}>{entry.status}</Text>
              </View>
            </View>
            <View style={styles.mileageRow}>
              <AppIcon name="dial" size={16} color={color.icon.neutralRegular} />
              <Text style={styles.mileage}>{entry.mileage}</Text>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.date}>{entry.date}</Text>
            {entry.category ? <Text style={styles.category}>{entry.category}</Text> : null}
            <Text style={styles.description}>{entry.description}</Text>
            {entry.image ? <Image source={entry.image} style={styles.thumb} resizeMode="cover" /> : null}
          </>
        )}
      </View>
    </View>
  );
}

const COLLAPSED_COUNT = 3;

/**
 * Chronological ownership history, threaded on a vertical rail. Both "See all"
 * and "Add record" open the full vehicle-history page, where records are managed.
 */
export default function ServiceHistorySection({ entries, onAdd, onSeeAll }) {
  const collapsible = entries.length > COLLAPSED_COUNT;
  const visible = entries.slice(0, COLLAPSED_COUNT);

  return (
    <SectionCard title="Vehicle history" gap={spacing[5]}>
      <View style={styles.timeline}>
        {/* Rail sits behind the dots and stops at the last one. */}
        <View style={styles.rail} />
        {visible.map((entry, i) => (
          <Entry key={entry.id} entry={entry} last={i === visible.length - 1} />
        ))}
      </View>

      {collapsible && (
        <Pressable onPress={onSeeAll} accessibilityRole="button" accessibilityLabel="See all vehicle history">
          <Text style={styles.seeAll}>See all vehicle history</Text>
        </Pressable>
      )}

      <Button label="Add record" variant="outline" onPress={onAdd} />
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  timeline: {
    gap: spacing[4],
  },
  rail: {
    position: 'absolute',
    left: RAIL_X,
    top: DOT / 2,
    bottom: DOT,
    width: 1,
    backgroundColor: color.border.neutralRegular,
  },
  entry: {
    flexDirection: 'row',
    gap: spacing[4],
  },
  dotColumn: {
    width: DOT,
    paddingTop: spacing[1],
  },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    backgroundColor: color.background.brandPrimaryRegular,
  },
  body: {
    flex: 1,
    gap: spacing[1],
  },
  bodySpacing: {
    paddingBottom: spacing[4],
  },
  motHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[2],
  },
  passed: {
    justifyContent: 'center',
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: radius.sm,
    backgroundColor: color.background.brandPrimaryRegular,
  },
  passedLabel: {
    ...font.bodyXsEmphasized,
    color: color.text.inverseBold,
  },
  mileageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  mileage: {
    ...font.bodySmRegular,
    color: color.text.neutralRegular,
  },
  date: {
    ...font.headlineEmphasized,
    color: color.text.neutralBold,
  },
  category: {
    ...font.caption2Regular,
    color: color.text.neutralRegular,
  },
  description: {
    ...font.subheadlineRegular,
    color: color.text.neutralRegular,
  },
  thumb: {
    width: 96,
    height: 64,
    borderRadius: 16,
    marginTop: spacing[1],
  },
  seeAll: {
    ...font.bodySmEmphasized,
    color: color.text.brandPrimaryRegular,
  },
});
