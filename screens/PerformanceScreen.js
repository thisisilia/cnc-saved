import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import NavHeader from '../components/NavHeader';
import PerformanceChart from '../components/PerformanceChart';
import ChartRange, { rangeSeries } from '../components/vehicle/ChartRange';
import AppIcon from '../components/icons/AppIcon';
import { HISTORY, PURCHASE_VALUE, formatCurrency } from '../data/portfolio';
import { portfolio as portfolioSeed } from '../data/garage';
import { color, font, radius, spacing } from '../theme/tokens';

/** Turns a range toggle value into a "vs past …" phrase. */
const PERIOD_LABEL = {
  Max: 'vs all time',
  '5Y': 'vs past 5 years',
  '3Y': 'vs past 3 years',
  '1Y': 'vs past year',
  '3M': 'vs past 3 months',
  '1M': 'vs past month',
};
const periodLabel = (range) => PERIOD_LABEL[range] ?? `vs ${range}`;

function Tooltip({ point, baseline }) {
  const diff = point.value - baseline;
  const pct = ((diff / baseline) * 100).toFixed(1);
  const up = diff >= 0;

  return (
    <View style={styles.tooltip}>
      <View style={styles.tooltipRow}>
        <View style={[styles.dot, { backgroundColor: color.icon.successBold }]} />
        <Text style={styles.tooltipLabel}>Current</Text>
        <Text style={styles.tooltipValue}>{formatCurrency(point.value)}</Text>
      </View>
      <View style={styles.tooltipRow}>
        <View style={[styles.dot, { backgroundColor: color.background.neutralBold }]} />
        <Text style={styles.tooltipLabel}>Bought</Text>
        <Text style={styles.tooltipValue}>{formatCurrency(baseline)}</Text>
      </View>
      <Text style={styles.tooltipDelta}>
        {up ? '+' : '−'}
        {formatCurrency(Math.abs(diff))} ({pct}%)
      </Text>
      <Text style={styles.tooltipDate}>{point.label}</Text>
    </View>
  );
}

/**
 * Overall performance — the combined market performance of every vehicle in the
 * garage, over a selectable period. A full page (previously a bottom sheet) so
 * the chart gets the whole screen.
 */
export default function PerformanceScreen({ navigation, route }) {
  const portfolio = route.params?.portfolio ?? portfolioSeed;
  const title = route.params?.title ?? 'Overall performance';
  const [range, setRange] = useState('5Y');
  const [selected, setSelected] = useState(null);

  const full = HISTORY.MAX;
  const points = rangeSeries(
    range,
    full[0]?.value ?? PURCHASE_VALUE,
    full[full.length - 1]?.value ?? PURCHASE_VALUE
  );
  const selectedIndex = selected == null ? points.length - 1 : Math.min(selected, points.length - 1);

  const changeRange = (next) => {
    setRange(next);
    setSelected(null);
  };

  return (
    <View style={styles.screen}>
      <NavHeader title={title} onBack={() => navigation.goBack()} />

      <View style={styles.body}>
        <View style={styles.summary}>
          <Text style={styles.total}>{portfolio.totalValue}</Text>
          <View style={styles.summaryRow}>
            <AppIcon name="arrow-up-right" size={14} color={color.icon.successBold} />
            <Text style={styles.summaryDeltaStrong}>{portfolio.delta}</Text>
            <Text style={styles.summaryDeltaStrong}>{portfolio.deltaValue}</Text>
            <Text style={styles.summaryMuted}>{periodLabel(range)}</Text>
          </View>
        </View>

        <PerformanceChart
          style={styles.chart}
          points={points}
          baseline={PURCHASE_VALUE}
          selectedIndex={selectedIndex}
          onSelectIndex={setSelected}
          renderTooltip={(point) => <Tooltip point={point} baseline={PURCHASE_VALUE} />}
        />

        <ChartRange value={range} onChange={changeRange} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.background.neutralWhite,
  },
  body: {
    flex: 1,
    padding: spacing[4],
    gap: spacing[4],
  },
  chart: {
    flex: 1,
  },
  summary: {
    gap: spacing[1],
  },
  total: {
    ...font.title2Emphasized,
    color: color.text.neutralBold,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    flexWrap: 'wrap',
  },
  summaryDelta: {
    ...font.bodyXsRegular,
    color: color.text.successBold,
  },
  summaryDeltaStrong: {
    ...font.bodyXsEmphasized,
    color: color.text.successBold,
  },
  summaryMuted: {
    ...font.bodyXsRegular,
    color: color.text.neutralRegular,
  },
  tooltip: {
    backgroundColor: color.background.neutralWhite,
    borderRadius: radius.md,
    padding: spacing[3],
    gap: spacing[1],
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  tooltipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1.5],
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  tooltipLabel: {
    ...font.bodyXsRegular,
    color: color.text.neutralRegular,
  },
  tooltipValue: {
    ...font.bodyXsEmphasized,
    color: color.text.neutralBold,
  },
  tooltipDelta: {
    ...font.bodyXsRegular,
    color: color.text.neutralBold,
  },
  tooltipDate: {
    ...font.bodyXsRegular,
    color: color.text.neutralRegular,
  },
});
