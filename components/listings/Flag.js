import { StyleSheet, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

/**
 * A small country flag, as shown on listing cards to mark where a car is.
 *
 * Drawn rather than bitmapped — only the handful of countries the comps use are
 * needed. Defaults to Sweden, which is what the placeholder listings show.
 */
const FLAGS = {
  se: { bg: '#006AA7', cross: '#FECC00' },
};

export default function Flag({ code = 'se', width = 14 }) {
  const flag = FLAGS[code] ?? FLAGS.se;

  return (
    <View style={[styles.wrap, { width, height: width, borderRadius: width / 2 }]}>
      <Svg width={width} height={width} viewBox="0 0 16 16">
        <Rect x="0" y="0" width="16" height="16" fill={flag.bg} />
        {/* Sweden's off-centre cross, filling a circular badge. */}
        <Rect x="5" y="0" width="2.5" height="16" fill={flag.cross} />
        <Rect x="0" y="6.75" width="16" height="2.5" fill={flag.cross} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
  },
});
