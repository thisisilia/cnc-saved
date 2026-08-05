import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { formatCurrency } from '../../data/portfolio';
import { color, font, radius, spacing } from '../../theme/tokens';
import PerformanceChart from '../PerformanceChart';
import Toggle from '../Toggle';
import Sparkline from '../Sparkline';
import TrendDelta from '../TrendDelta';
import ChartRange, { rangeSeries } from './ChartRange';
import ComparableSection from './ComparableSection';
import MetricIcon from './MetricIcon';
import SectionCard from './SectionCard';

/** Legend shown when a point on the trend line is tapped: the market average at
 *  that point. On the vehicle page it also shows the bought baseline and change;
 *  the valuation page shows the average only. */
function TrendTooltip({ point, baseline, showBought }) {
  if (!showBought) {
    return (
      <View style={styles.tooltip}>
        <View style={styles.tooltipRow}>
          <View style={[styles.tooltipDot, { backgroundColor: color.icon.successBold }]} />
          <Text style={styles.tooltipLabel}>Average</Text>
          <Text style={styles.tooltipValue}>{formatCurrency(point.value)}</Text>
        </View>
        <Text style={styles.tooltipMeta}>{point.label}</Text>
      </View>
    );
  }

  const diff = point.value - baseline;
  const pct = ((diff / baseline) * 100).toFixed(1);
  const up = diff >= 0;
  return (
    <View style={styles.tooltip}>
      <View style={styles.tooltipRow}>
        <View style={[styles.tooltipDot, { backgroundColor: color.icon.successBold }]} />
        <Text style={styles.tooltipLabel}>Average</Text>
        <Text style={styles.tooltipValue}>{formatCurrency(point.value)}</Text>
      </View>
      <View style={styles.tooltipRow}>
        <View style={[styles.tooltipDot, { backgroundColor: color.background.neutralBold }]} />
        <Text style={styles.tooltipLabel}>Bought</Text>
        <Text style={styles.tooltipValue}>{formatCurrency(baseline)}</Text>
      </View>
      <Text style={styles.tooltipDelta}>
        {up ? '+' : '−'}
        {formatCurrency(Math.abs(diff))} ({pct}%)
      </Text>
      <Text style={styles.tooltipMeta}>{point.label}</Text>
    </View>
  );
}

/** Card shown when an individual sale bullet is tapped. */
function SaleTooltip({ sale }) {
  return (
    <View style={[styles.tooltip, styles.saleTooltip]}>
      <Image source={sale.image} style={styles.saleThumb} resizeMode="cover" />
      <View style={styles.saleBody}>
        <Text style={styles.tooltipLabel} numberOfLines={1}>
          {sale.name}
        </Text>
        <Text style={styles.salePrice}>{formatCurrency(sale.value)}</Text>
        <Text style={styles.tooltipMeta}>{sale.date}</Text>
      </View>
    </View>
  );
}

/** One "Performance" row: circular icon, label + value + footnote, and — for the
 *  trend metrics — a sparkline on the right. */
function MetricRow({ metric }) {
  return (
    <View style={styles.metricRow}>
      <View style={styles.metricIcon}>
        <MetricIcon id={metric.id} size={22} />
      </View>
      <View style={styles.metricBody}>
        <Text style={styles.metricLabel}>{metric.label}</Text>
        <Text style={styles.metricValue}>{metric.value}</Text>
        {metric.footnote ? (
          <Text style={styles.metricFootnote}>{metric.footnote}</Text>
        ) : (
          <View style={styles.metricDelta}>
            <TrendDelta value={metric.delta} />
            <Text style={styles.metricFootnote}>{metric.deltaCaption}</Text>
          </View>
        )}
      </View>
      {metric.chart && <Sparkline width={72} height={36} />}
    </View>
  );
}

/** Live market intelligence for comparable vehicles. */
export default function MarketSection({ market, recentlySold, similar, showBought = false }) {
  const [individualSales, setIndividualSales] = useState(false);
  const [trendIndex, setTrendIndex] = useState(null);
  const [saleId, setSaleId] = useState(null);
  const [range, setRange] = useState('5Y');

  // The chart redraws to the chosen range with period-appropriate labels; both
  // selections reset so no stale tooltip survives the redraw.
  const trendEnd = market.history[market.history.length - 1]?.value ?? market.baseline;
  const rangePoints = rangeSeries(range, market.baseline, trendEnd);
  const changeRange = (next) => {
    setRange(next);
    setTrendIndex(null);
    setSaleId(null);
  };

  // Each mode owns its own selection; leaving a mode clears it so returning
  // doesn't surface a stale tooltip.
  const toggleIndividualSales = (next) => {
    setIndividualSales(next);
    setTrendIndex(null);
    setSaleId(null);
  };

  return (
    <SectionCard gap={spacing[5]}>
      <View style={styles.intro}>
        <Text style={styles.heading}>{market.title}</Text>
        <Text style={styles.blurb}>{market.blurb}</Text>
      </View>

      <View style={styles.chartBlock}>
        <View>
          <Text style={styles.averageLabel}>{market.averageLabel}</Text>
          <Text style={styles.averageValue}>{market.averageValue}</Text>
        </View>

        <PerformanceChart
          style={styles.chart}
          points={rangePoints}
          baseline={rangePoints[0]?.value ?? market.baseline}
          axisMax={market.axisMax}
          selectedIndex={individualSales ? null : trendIndex}
          onSelectIndex={individualSales ? undefined : setTrendIndex}
          renderTooltip={(point) => (
            <TrendTooltip
              point={point}
              baseline={rangePoints[0]?.value ?? market.baseline}
              showBought={showBought}
            />
          )}
          scatter={individualSales ? market.sales : null}
          selectedSaleId={saleId}
          onSelectSale={(sale) => setSaleId(sale ? sale.id : null)}
          renderSaleTooltip={(sale) => <SaleTooltip sale={sale} />}
        />

        <ChartRange value={range} onChange={changeRange} />

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Show individual sales</Text>
          <Toggle
            value={individualSales}
            onValueChange={toggleIndividualSales}
            accessibilityLabel="Show individual sales"
          />
        </View>
      </View>

      <View style={styles.performance}>
        <Text style={styles.performanceTitle}>Performance</Text>
        {market.metrics.map((metric) => (
          <MetricRow key={metric.id} metric={metric} />
        ))}
      </View>

      <ComparableSection title="Recently sold" items={recentlySold} onSeeAll={() => {}} />
      <ComparableSection title="Similar vehicle for sale" items={similar} onSeeAll={() => {}} />
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  intro: {
    gap: spacing[1],
  },
  heading: {
    ...font.bodyEmphasized,
    color: color.text.neutralBold,
  },
  blurb: {
    ...font.bodyXsRegular,
    color: color.text.neutralRegular,
  },
  chartBlock: {
    gap: spacing[3],
  },
  averageLabel: {
    ...font.bodySmEmphasized,
    color: color.text.neutralBold,
  },
  averageValue: {
    ...font.title2Emphasized,
    color: color.text.neutralBold,
  },
  chart: {
    height: 150,
    // Fills the card's content width (inside its padding) — breaking it out to
    // the card edge made the axis and line sit on the border and read as overflow.
    alignSelf: 'stretch',
  },
  tooltip: {
    backgroundColor: color.background.neutralWhite,
    borderRadius: radius.md,
    padding: spacing[2],
    gap: spacing[1],
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  saleTooltip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  saleThumb: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
  },
  saleBody: {
    flex: 1,
  },
  salePrice: {
    ...font.bodyMdEmphasized,
    color: color.text.neutralBold,
  },
  tooltipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1.5],
  },
  tooltipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: color.icon.successBold,
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
  tooltipMeta: {
    ...font.bodyXsRegular,
    color: color.text.neutralRegular,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[2],
  },
  toggleLabel: {
    ...font.bodyXsRegular,
    color: color.text.neutralRegular,
    flex: 1,
    textAlign: 'left',
  },
  // Run the strip to the card edge so a peeking card is cut there, not clipped
  // early by the card padding.
  stripScroll: {
    marginHorizontal: -spacing[4],
  },
  strip: {
    gap: spacing[3],
    paddingHorizontal: spacing[4],
  },
  performance: {
    gap: spacing[4],
  },
  performanceTitle: {
    ...font.bodySmEmphasized,
    color: color.text.neutralBold,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.background.neutralRegular,
  },
  metricBody: {
    flex: 1,
    gap: 2,
  },
  metricLabel: {
    ...font.bodySmRegular,
    color: color.text.neutralRegular,
  },
  metricValue: {
    ...font.calloutEmphasized,
    fontSize: 16,
    color: color.text.neutralBold,
  },
  metricFootnote: {
    ...font.bodyXsRegular,
    color: color.text.neutralRegular,
  },
  metricDelta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
});
