import { useId } from 'react';
import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { color } from '../theme/tokens';

/**
 * Upward-trending valuation line with a soft fade beneath it. Figma ships this
 * as a flat image; drawing it keeps the stroke crisp at any size and lets the
 * series come from real data later.
 *
 * Values are unitless — they are normalised to the given height, so the same
 * series fills a 40px mini chart and a 60px card chart alike.
 */
const SERIES = [
  8, 8.6, 7.8, 9.9, 9.2, 11.6, 10.7, 12.9, 12.1, 11.4, 13.8, 15.2,
  14.4, 16.9, 16.1, 18.6, 17.7, 17.1, 19.8, 21.2, 20.4, 22.9, 22.2, 24.8,
  23.9, 23.2, 25.6, 27.1, 26.3, 28.8, 27.9, 30.4, 29.6, 28.9, 31.4, 32.8,
  31.9, 34.2, 33.4, 35.9,
];

const STROKE = 1.5;

function buildPath(series, width, height) {
  const min = Math.min(...series);
  const max = Math.max(...series);
  const range = max - min || 1;
  // Inset by the stroke so the line's edge is not clipped at the extremes.
  const top = STROKE / 2;
  const usable = height - STROKE;
  const stepX = width / (series.length - 1);

  return series
    .map((value, i) => {
      const x = i * stepX;
      const y = top + usable * (1 - (value - min) / range);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');
}

export default function Sparkline({ width = 120, height = 40 }) {
  const line = buildPath(SERIES, width, height);
  const area = `${line} L${width},${height} L0,${height} Z`;
  // Unique per instance: SVG ids are document-global, and the navigator keeps
  // several screens mounted. A shared id resolves to whichever gradient comes
  // first in the document — often one inside a hidden screen — so the fill
  // silently disappears.
  const gradientId = `sparklineFade-${useId()}`;

  return (
    <View>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Defs>
          <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color.icon.successBold} stopOpacity="0.18" />
            <Stop offset="1" stopColor={color.icon.successBold} stopOpacity="0" />
          </LinearGradient>
        </Defs>
        <Path d={area} fill={`url(#${gradientId})`} />
        <Path
          d={line}
          stroke={color.icon.successBold}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
    </View>
  );
}
