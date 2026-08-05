import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, font, radius, spacing } from '../../theme/tokens';

export const CHART_RANGES = ['Max', '5Y', '3Y', '1Y', '3M', '1M'];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
// Anchored to the app's "now" (Jul 2026) so labels read as recent history.
const END_YEAR = 2026;
const END_MONTH = 6; // July, 0-indexed

/** How many years each range spans — drives the label set and the value window. */
const RANGE_YEARS = { Max: 5, '5Y': 5, '3Y': 3, '1Y': 0.5, '3M': 0.25, '1M': 1 / 12 };

/** One label per point; the chart de-dupes them into evenly spaced axis ticks. */
function rangeLabels(range) {
  if (range === 'Max' || range === '5Y' || range === '3Y') {
    const years = range === '3Y' ? 3 : 5;
    const labels = [];
    for (let y = END_YEAR - years + 1; y <= END_YEAR; y += 1) {
      for (let m = 0; m < 12; m += 1) labels.push(String(y));
    }
    return labels; // 12 points/year → one tick per year
  }
  if (range === '1Y') {
    // The 1Y view reads as the recent six months on the small mobile axis.
    const labels = [];
    for (let k = 5; k >= 0; k -= 1) labels.push(MONTHS[((END_MONTH - k) % 12 + 12) % 12]);
    return labels; // last 6 months
  }
  if (range === '3M') {
    const labels = [];
    for (let k = 2; k >= 0; k -= 1) {
      const m = ((END_MONTH - k) % 12 + 12) % 12;
      for (let w = 0; w < 4; w += 1) labels.push(MONTHS[m]); // 4 weeks per month → 3 ticks
    }
    return labels;
  }
  return ['1', '8', '15', '22', '29']; // 1M → weekly day-of-month ticks
}

/**
 * A trend series shaped to the selected range: the right labels (years for the
 * long views, months for a year, weeks for a month) and a value window that sits
 * near the current level for short ranges and stretches back for long ones, so
 * the chart genuinely redraws to the period rather than just cropping.
 */
export function rangeSeries(range, from, to) {
  const labels = rangeLabels(range);
  const n = labels.length;
  const years = RANGE_YEARS[range] ?? 5;
  // Shorter ranges start closer to the current value (of a nominal 5-year rise).
  const startFraction = Math.max(0, (5 - years) / 5);
  const start = from + (to - from) * startFraction;
  const span = to - start;
  return labels.map((label, i) => {
    const t = n > 1 ? i / (n - 1) : 1;
    const wiggle = span * 0.06 * Math.sin(i * 1.3) + (to - from) * 0.008 * Math.sin(i * 2.1);
    return { value: Math.max(0, Math.round(start + span * t + wiggle)), label };
  });
}

/** Time-range selector beneath a trend chart: Max · 5Y · 3Y · 1Y · 3M · 1M. */
export default function ChartRange({ value, onChange, options = CHART_RANGES }) {
  return (
    <View style={styles.row}>
      {options.map((option) => {
        const active = option === value;
        return (
          <Pressable
            key={option}
            style={[styles.pill, active ? styles.pillActive : styles.pillInactive]}
            onPress={() => onChange(option)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`${option} range`}
          >
            <Text style={active ? styles.labelActive : styles.label}>{option}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  pill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[2],
    borderRadius: radius.md,
    borderWidth: 1,
  },
  pillActive: {
    backgroundColor: color.background.brandPrimaryRegular,
    borderColor: color.background.brandPrimaryRegular,
  },
  pillInactive: {
    backgroundColor: color.background.neutralWhite,
    borderColor: color.border.neutralRegular,
  },
  label: {
    ...font.bodyXsEmphasized,
    color: color.text.neutralBold,
  },
  labelActive: {
    ...font.bodyXsEmphasized,
    color: color.text.inverseBold,
  },
});
