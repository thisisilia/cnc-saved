/**
 * The iOS status bar over the hero — Figma 721:2190. Presentational: the web
 * mock has no real status bar, and on device the system draws its own, so this
 * stands in so the comp reads as it does in Figma.
 *
 * The levels artwork is the designer's export inlined, since react-native-svg
 * cannot load an .svg file as a source. The battery outline is given an
 * explicit `fill="none"`: SVG defaults an unfilled rect to black, which showed
 * through the 30% stroke as a dark slab rather than an outline.
 */

import { StyleSheet, Text, View } from 'react-native';
import Svg, { G, Path, Rect } from 'react-native-svg';
import { font, spacing } from '../theme/tokens';

/** The comp's row: 47 tall, the time left, the levels right. */
export const STATUS_BAR_H = 47;

export default function StatusBarMock({ time = '9:41', tint = '#ffffff' }) {
  return (
    <View style={styles.root} pointerEvents="none">
      <Text style={[styles.time, { color: tint }]}>{time}</Text>
      <Svg width={106} height={54} viewBox="0 0 106 54" style={styles.levels}>
        <G> <G> <Rect opacity={0.3} fill="none" x="64.5" y="23.5" width="24" height="12" rx="3.8" stroke={tint}/> <Path opacity={0.4} d="M90 27.7811V31.8566C90.8047 31.5114 91.328 30.7085 91.328 29.8189C91.328 28.9293 90.8047 28.1263 90 27.7811" fill={tint}/> <Rect x="66" y="25" width="21" height="9" rx="2.5" fill={tint}/> </G> <Path fillRule="evenodd" clipRule="evenodd" d="M48.2705 26.1069C50.7576 26.107 53.1496 27.0291 54.9521 28.6826C55.0879 28.8102 55.3048 28.8086 55.4385 28.679L56.736 27.4155C56.8037 27.3497 56.8414 27.2607 56.8409 27.168C56.8403 27.0753 56.8015 26.9867 56.733 26.9217C52.002 22.5469 44.5383 22.5469 39.8073 26.9217C39.7387 26.9866 39.6999 27.0752 39.6992 27.1679C39.6986 27.2606 39.7363 27.3497 39.8039 27.4155L41.1018 28.679C41.2354 28.8088 41.4525 28.8104 41.5881 28.6826C43.3909 27.029 45.7832 26.1069 48.2705 26.1069ZM48.2672 30.3272C49.6245 30.3271 50.9334 30.8388 51.9395 31.763C52.0756 31.8941 52.2899 31.8913 52.4226 31.7566L53.7099 30.4373C53.7777 30.368 53.8153 30.2742 53.8143 30.1766C53.8133 30.0791 53.7738 29.986 53.7047 29.9182C50.6408 27.0273 45.8961 27.0273 42.8323 29.9182C42.7631 29.986 42.7236 30.0791 42.7227 30.1767C42.7218 30.2743 42.7595 30.3681 42.8274 30.4373L44.1143 31.7566C44.247 31.8913 44.4614 31.8941 44.5974 31.763C45.6029 30.8394 46.9107 30.3278 48.2672 30.3272ZM50.7916 33.1207C50.7935 33.2261 50.7565 33.3277 50.6892 33.4015L48.5125 35.8562C48.4487 35.9283 48.3617 35.9689 48.2709 35.9689C48.1802 35.9689 48.0932 35.9283 48.0294 35.8562L45.8523 33.4015C45.7851 33.3276 45.7481 33.226 45.7501 33.1206C45.7521 33.0153 45.7929 32.9155 45.8629 32.8449C47.253 31.531 49.2889 31.531 50.679 32.8449C50.7489 32.9156 50.7897 33.0154 50.7916 33.1207Z" fill={tint}/> <Path fillRule="evenodd" clipRule="evenodd" d="M32.2 24.6814C32.2 24.0483 31.7224 23.5352 31.1333 23.5352H30.0667C29.4776 23.5352 29 24.0483 29 24.6814V34.6153C29 35.2484 29.4776 35.7616 30.0667 35.7616H31.1333C31.7224 35.7616 32.2 35.2484 32.2 34.6153V24.6814ZM24.7659 25.9804H25.8326C26.4217 25.9804 26.8992 26.5059 26.8992 27.1542V34.5878C26.8992 35.2361 26.4217 35.7616 25.8326 35.7616H24.7659C24.1768 35.7616 23.6992 35.2361 23.6992 34.5878V27.1542C23.6992 26.5059 24.1768 25.9804 24.7659 25.9804ZM20.4341 28.6295H19.3674C18.7783 28.6295 18.3008 29.1617 18.3008 29.8182V34.5729C18.3008 35.2294 18.7783 35.7616 19.3674 35.7616H20.4341C21.0232 35.7616 21.5008 35.2294 21.5008 34.5729V29.8182C21.5008 29.1617 21.0232 28.6295 20.4341 28.6295ZM15.1333 31.0748H14.0667C13.4776 31.0748 13 31.5994 13 32.2465V34.5899C13 35.237 13.4776 35.7616 14.0667 35.7616H15.1333C15.7224 35.7616 16.2 35.237 16.2 34.5899V32.2465C16.2 31.5994 15.7224 31.0748 15.1333 31.0748Z" fill={tint}/> </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    height: STATUS_BAR_H,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
  },
  time: {
    ...font.bodyMdEmphasized,
    width: 81,
    textAlign: 'center',
  },
  levels: {
    marginTop: -4,
  },
});
