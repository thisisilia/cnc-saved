import { useId, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, G, Line, LinearGradient, Path, Stop, Text as SvgText } from 'react-native-svg';
import { formatAxisValue } from '../data/portfolio';
import { color, font, fontFamily } from '../theme/tokens';

const PADDING = { top: 8, right: 8, bottom: 28, left: 44 };
const TICK_STEP = 20000;
/** Gridlines above zero. Fixed, so a £200k chart isn't striped with 11 lines. */
const TICK_INTERVALS = 4;
// Narrow enough that the card always clears the marker on one side or the
// other: at ~330px wide, anything past ~150 leaves a mid-chart point with room
// on neither flank.
const TOOLTIP_WIDTH = 150;
const SCATTER_TOOLTIP_WIDTH = 150;
/** How close a tap must land to a bullet to select it. */
const SCATTER_HIT_RADIUS = 22;
/** Clearance between a marker and the card describing it. */
const TOOLTIP_GAP = 14;

/** Axis ceiling rounded up to a whole step, so every gridline is a round value. */
function niceCeiling(max) {
  return Math.max(Math.ceil(max / TICK_STEP) * TICK_STEP, TICK_STEP);
}

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/**
 * Trend chart with an optional scatter layer.
 *
 * Two selection modes, never both at once: without `scatter` a tap picks the
 * nearest point on the line (portfolio performance); with `scatter` a tap picks
 * the nearest individual sale bullet (vehicle market).
 */
export default function PerformanceChart({
  points,
  baseline,
  selectedIndex,
  onSelectIndex,
  renderTooltip,
  scatter,
  selectedSaleId,
  onSelectSale,
  renderSaleTooltip,
  axisMax,
  hideBaseline = false,
  showMarkers = false,
  formatYAxis = formatAxisValue,
  style,
}) {
  // Measured rather than fixed, so the chart fills whatever room the sheet gives it.
  const [{ width, height }, setSize] = useState({ width: 0, height: 0 });
  const scatterMode = Boolean(scatter?.length);
  // Measured so the card can be seated fully above or below its marker.
  const [tipHeight, setTipHeight] = useState(0);
  // Unique per instance — see Sparkline: a shared SVG id resolves document-wide.
  const gradientId = `perfFade-${useId()}`;

  const geometry = useMemo(() => {
    if (!width || !height || points.length === 0) return null;

    const plotWidth = width - PADDING.left - PADDING.right;
    const plotHeight = height - PADDING.top - PADDING.bottom;
    // Bullets sit outside the trend line's range, so they raise the ceiling too
    // — unless a fixed ceiling is given, which pins the gridlines regardless.
    const maxValue =
      axisMax ??
      niceCeiling(
        Math.max(...points.map((p) => p.value), ...(scatter ?? []).map((s) => s.value), baseline)
      );

    const x = (i) => PADDING.left + (plotWidth * i) / Math.max(points.length - 1, 1);
    const xAt = (t) => PADDING.left + plotWidth * t;
    const y = (value) => PADDING.top + plotHeight * (1 - value / maxValue);

    const line = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(2)},${y(p.value).toFixed(2)}`)
      .join(' ');
    const area = `${line} L${x(points.length - 1).toFixed(2)},${(PADDING.top + plotHeight).toFixed(
      2
    )} L${x(0).toFixed(2)},${(PADDING.top + plotHeight).toFixed(2)} Z`;

    const ticks = Array.from(
      { length: TICK_INTERVALS + 1 },
      (_, i) => (maxValue / TICK_INTERVALS) * i
    );

    // One label per month, spread evenly across the plot rather than sitting on
    // the first point that carries it — which bunched them toward the left and
    // left a gap at the right edge.
    const months = [];
    points.forEach((p) => {
      if (!months.includes(p.label)) months.push(p.label);
    });
    const xLabels = months.map((label, i) => ({
      label,
      x: PADDING.left + (plotWidth * (i + 0.5)) / months.length,
    }));

    const bullets = (scatter ?? []).map((sale) => ({
      ...sale,
      cx: xAt(sale.t),
      cy: y(sale.value),
    }));

    return { plotWidth, plotHeight, maxValue, x, xAt, y, line, area, ticks, xLabels, bullets };
  }, [width, height, points, baseline, scatter, axisMax]);

  const interactive = Boolean(onSelectIndex) || Boolean(onSelectSale);

  const handleTouch = (event) => {
    if (!geometry) return;
    const { locationX, locationY } = event.nativeEvent;

    if (scatterMode) {
      if (!onSelectSale) return;
      // Nearest bullet wins, but only if the tap actually landed near one —
      // tapping empty space should dismiss rather than snap to a far-off sale.
      let best = null;
      let bestDistance = Infinity;
      for (const bullet of geometry.bullets) {
        const distance = Math.hypot(bullet.cx - locationX, bullet.cy - locationY);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = bullet;
        }
      }
      onSelectSale(best && bestDistance <= SCATTER_HIT_RADIUS ? best : null);
      return;
    }

    if (!onSelectIndex) return;
    const ratio = (locationX - PADDING.left) / geometry.plotWidth;
    const index = Math.round(ratio * (points.length - 1));
    onSelectIndex(clamp(index, 0, points.length - 1));
  };

  const selectedSale =
    scatterMode && selectedSaleId != null
      ? geometry?.bullets.find((b) => b.id === selectedSaleId)
      : null;

  /**
   * Seat the tooltip beside the marker it describes.
   *
   * It sits to the right of the point, flipping to the left once the right edge
   * would clip it — so the marker stays visible and the card never sits under
   * the finger scrubbing along the line. If a chart is ever too narrow for
   * either flank, it falls back to sitting above (or below) the point rather
   * than overlapping it.
   */
  const placeTooltip = (cx, cy, tipWidth) => {
    const maxX = Math.max(width - tipWidth, 0);
    const verticalCentre = clamp(
      cy - tipHeight / 2,
      PADDING.top,
      Math.max(height - tipHeight - 4, PADDING.top)
    );

    const rightX = cx + TOOLTIP_GAP;
    if (rightX <= maxX) return { left: rightX, top: verticalCentre };

    const leftX = cx - TOOLTIP_GAP - tipWidth;
    if (leftX >= 0) return { left: leftX, top: verticalCentre };

    const above = cy - TOOLTIP_GAP - tipHeight;
    return {
      left: clamp(cx - tipWidth / 2, 0, maxX),
      top: clamp(
        above >= PADDING.top ? above : cy + TOOLTIP_GAP,
        PADDING.top,
        Math.max(height - tipHeight - 4, PADDING.top)
      ),
    };
  };

  return (
    <View
      style={[styles.container, style]}
      onLayout={(e) => {
        const { width: w, height: h } = e.nativeEvent.layout;
        setSize((prev) => (prev.width === w && prev.height === h ? prev : { width: w, height: h }));
      }}
      onStartShouldSetResponder={() => interactive}
      onMoveShouldSetResponder={() => interactive && !scatterMode}
      onResponderGrant={handleTouch}
      onResponderMove={scatterMode ? undefined : handleTouch}
    >
      {geometry && (
        <Svg width={width} height={height}>
          <Defs>
            <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={color.icon.successBold} stopOpacity="0.16" />
              <Stop offset="1" stopColor={color.icon.successBold} stopOpacity="0" />
            </LinearGradient>
          </Defs>

          {/* Horizontal gridlines + y-axis labels */}
          {geometry.ticks.map((tick) => (
            <G key={tick}>
              <Line
                x1={PADDING.left}
                x2={width - PADDING.right}
                y1={geometry.y(tick)}
                y2={geometry.y(tick)}
                stroke={color.border.neutralSubtle}
                strokeWidth={1}
              />
              <SvgText
                x={PADDING.left - 8}
                y={geometry.y(tick) + 4}
                fill={color.text.neutralRegular}
                fontSize={font.bodyXsRegular.fontSize}
                fontFamily={fontFamily.display}
                textAnchor="end"
              >
                {formatYAxis(tick)}
              </SvgText>
            </G>
          ))}

          {/* x-axis labels */}
          {geometry.xLabels.map((label) => (
            <SvgText
              key={`${label.label}-${label.x}`}
              x={label.x}
              y={height - 8}
              fill={color.text.neutralRegular}
              fontSize={font.bodyXsRegular.fontSize}
              fontFamily={fontFamily.display}
              textAnchor="middle"
            >
              {label.label}
            </SvgText>
          ))}

          {/* The fill would muddy the bullets, so it drops out in scatter mode. */}
          {!scatterMode && <Path d={geometry.area} fill={`url(#${gradientId})`} />}

          <Path
            d={geometry.line}
            stroke={color.icon.successBold}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {!scatterMode && !hideBaseline && (
            <Line
              x1={PADDING.left}
              x2={width - PADDING.right}
              y1={geometry.y(baseline)}
              y2={geometry.y(baseline)}
              stroke={color.text.neutralBold}
              strokeWidth={1}
              strokeDasharray="2 3"
            />
          )}

          {/* A dot on every value, so individual readings are legible. */}
          {showMarkers &&
            points.map((p, i) => (
              <Circle
                key={`marker-${i}`}
                cx={geometry.x(i)}
                cy={geometry.y(p.value)}
                r={3.5}
                fill={color.icon.successBold}
              />
            ))}

          {scatterMode &&
            geometry.bullets.map((bullet) => {
              const active = bullet.id === selectedSaleId;
              return (
                <Circle
                  key={bullet.id}
                  cx={bullet.cx}
                  cy={bullet.cy}
                  r={active ? 5 : 3.5}
                  fill={active ? color.icon.successBold : color.background.neutralBold}
                  opacity={active ? 1 : 0.75}
                />
              );
            })}

          {!scatterMode && selectedIndex != null && (
            <G>
              <Line
                x1={geometry.x(selectedIndex)}
                x2={geometry.x(selectedIndex)}
                y1={PADDING.top}
                y2={PADDING.top + geometry.plotHeight}
                stroke={color.text.neutralRegular}
                strokeWidth={1}
                strokeDasharray="2 3"
              />
              <Circle
                cx={geometry.x(selectedIndex)}
                cy={geometry.y(baseline)}
                r={4}
                fill={color.background.neutralBold}
              />
              <Circle
                cx={geometry.x(selectedIndex)}
                cy={geometry.y(points[selectedIndex].value)}
                r={5}
                fill={color.icon.successBold}
              />
            </G>
          )}
        </Svg>
      )}

      {/* Tooltips sit clear of their marker so scrubbing stays unobstructed. */}
      {geometry && !scatterMode && renderTooltip && selectedIndex != null && (
        <View
          pointerEvents="none"
          onLayout={(e) => setTipHeight(e.nativeEvent.layout.height)}
          style={[
            styles.tooltip,
            { width: TOOLTIP_WIDTH },
            placeTooltip(
              geometry.x(selectedIndex),
              geometry.y(points[selectedIndex].value),
              TOOLTIP_WIDTH
            ),
          ]}
        >
          {renderTooltip(points[selectedIndex])}
        </View>
      )}

      {geometry && selectedSale && renderSaleTooltip && (
        <View
          pointerEvents="none"
          onLayout={(e) => setTipHeight(e.nativeEvent.layout.height)}
          style={[
            styles.tooltip,
            { width: SCATTER_TOOLTIP_WIDTH },
            placeTooltip(selectedSale.cx, selectedSale.cy, SCATTER_TOOLTIP_WIDTH),
          ]}
        >
          {renderSaleTooltip(selectedSale)}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
  },
  tooltip: {
    position: 'absolute',
  },
});
