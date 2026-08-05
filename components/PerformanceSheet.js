import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { HISTORY, PURCHASE_DATE, PURCHASE_VALUE, formatCurrency } from '../data/portfolio';
import { color, font, radius, spacing } from '../theme/tokens';
import BottomSheet from './BottomSheet';
import PerformanceChart from './PerformanceChart';
import ChartRange, { rangeSeries } from './vehicle/ChartRange';
import AppIcon from './icons/AppIcon';

/** Gap left above the sheet, so the chart gets as much height as possible. */
const SHEET_TOP_INSET = 40;

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
 * Portfolio Performance sheet: the combined market performance of every vehicle
 * in the garage, over a selectable period.
 */
export default function PerformanceSheet({ visible, onClose, portfolio }) {
  const [range, setRange] = useState('5Y');
  const [selected, setSelected] = useState(null);

  const full = HISTORY.MAX;
  const points = rangeSeries(range, full[0]?.value ?? PURCHASE_VALUE, full[full.length - 1]?.value ?? PURCHASE_VALUE);
  const selectedIndex = selected == null ? points.length - 1 : Math.min(selected, points.length - 1);

  const changeRange = (next) => {
    setRange(next);
    setSelected(null);
  };

  return (
    // `fill` gives the sheet a real height — the chart below flexes into the
    // slack, and would collapse to nothing in a content-hugging sheet.
    <BottomSheet visible={visible} onClose={onClose} topInset={SHEET_TOP_INSET} fill>
      <View style={styles.body}>
        <Text style={styles.title}>Performance</Text>

        <View style={styles.summary}>
          <Text style={styles.total}>{portfolio.totalValue}</Text>
          <View style={styles.summaryRow}>
            <AppIcon name="arrow-up-right" size={14} color={color.icon.successBold} />
            <Text style={styles.summaryDelta}>{portfolio.delta}</Text>
            <Text style={styles.summaryDelta}>{portfolio.deltaValue}</Text>
            <Text style={styles.summaryMuted}>
              {portfolio.sinceLabel} • {PURCHASE_DATE}
            </Text>
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
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignSelf: 'stretch',
    padding: spacing[4],
    gap: spacing[4],
  },
  // Absorbs the slack once the title, summary and period pills are laid out.
  chart: {
    flex: 1,
  },
  title: {
    ...font.title3Emphasized,
    color: color.text.neutralBold,
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
