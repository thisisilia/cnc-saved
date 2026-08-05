import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { color, font, radius, spacing } from '../../theme/tokens';
import BottomSheet from '../BottomSheet';

const DOT = 12;
const RAIL_X = 5;

function GradePill({ label }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillLabel}>{label}</Text>
    </View>
  );
}

/** The log of past valuations, opened from the valuation section's chevron. */
export default function ValuationSheet({ visible, onClose, valuation }) {
  const history = valuation.history ?? [
    { id: 'h1', value: valuation.value, grade: valuation.grade, date: '15 July 2026' },
  ];

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.historyHead}>
          <Text style={styles.title}>Valuation history</Text>
          <Text style={styles.updated}>{valuation.updated}</Text>
        </View>

        <View style={styles.timeline}>
          <View style={styles.rail} />
          {history.map((entry) => (
            <View key={entry.id} style={styles.entry}>
              <View style={styles.dotColumn}>
                <View style={styles.dot} />
              </View>
              <View style={styles.entryBody}>
                <View style={styles.valueRow}>
                  <Text style={styles.historyValue}>{entry.value}</Text>
                  <GradePill label={entry.grade} />
                </View>
                <Text style={styles.historyDate}>{entry.date}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  scroll: {
    alignSelf: 'stretch',
    flexShrink: 1,
  },
  body: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
    paddingBottom: spacing[2],
    gap: spacing[4],
  },
  head: {
    gap: spacing[1.5],
  },
  title: {
    ...font.bodyEmphasized,
    color: color.text.neutralBold,
  },
  updated: {
    ...font.labelSm,
    color: color.text.neutralRegular,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  value: {
    ...font.title2Emphasized,
    color: color.text.neutralBold,
  },
  pill: {
    minHeight: 20,
    justifyContent: 'center',
    paddingHorizontal: spacing[2],
    borderRadius: radius.full,
    backgroundColor: color.background.brandPrimaryBold,
  },
  pillLabel: {
    ...font.bodyXsRegular,
    color: color.text.inverseBold,
  },
  blurb: {
    ...font.bodyXsRegular,
    color: color.text.neutralRegular,
  },
  historyHead: {
    gap: spacing[1.5],
    marginTop: spacing[2],
  },
  timeline: {
    gap: spacing[4],
  },
  rail: {
    position: 'absolute',
    left: RAIL_X,
    top: DOT / 2,
    bottom: DOT,
    width: 2,
    backgroundColor: color.background.brandPrimaryRegular,
    opacity: 0.4,
  },
  entry: {
    flexDirection: 'row',
    gap: spacing[3],
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
  entryBody: {
    flex: 1,
    gap: spacing[1],
  },
  historyValue: {
    ...font.title3Emphasized,
    color: color.text.neutralBold,
  },
  historyDate: {
    ...font.bodySmRegular,
    color: color.text.neutralRegular,
  },
});
