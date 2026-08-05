import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, StyleSheet, View } from 'react-native';

const START_PAUSE_MS = 1200;
const END_PAUSE_MS = 1200;
// Scrolling speed. Longer titles take proportionally longer, floored so a slight
// overflow still reads as a deliberate scroll rather than a twitch.
const PX_PER_SECOND = 45;
const MIN_SCROLL_MS = 900;

/**
 * A single line of header text that scrolls when it does not fit.
 *
 * Per the header title rule: static when it fits; when it overflows, a
 * horizontal marquee that pauses at each end and loops, and never an ellipsis.
 *
 * Measures the text at its natural width against the clip, so the decision is
 * real rather than a character-count guess. On react-native-web the animated
 * transform runs on the compositor.
 */
export default function MarqueeText({ children, style, align = 'left' }) {
  const [clipWidth, setClipWidth] = useState(0);
  const [textWidth, setTextWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  const overflow = textWidth > clipWidth + 0.5 ? textWidth - clipWidth : 0;

  useEffect(() => {
    translateX.stopAnimation();
    translateX.setValue(0);
    if (!overflow) return undefined;

    const scrollMs = Math.max((overflow / PX_PER_SECOND) * 1000, MIN_SCROLL_MS);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(START_PAUSE_MS),
        Animated.timing(translateX, {
          toValue: -overflow,
          duration: scrollMs,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.delay(END_PAUSE_MS),
        Animated.timing(translateX, {
          toValue: 0,
          duration: scrollMs,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [overflow, translateX]);

  return (
    <View
      style={[styles.clip, { alignItems: overflow ? 'flex-start' : alignItems(align) }]}
      onLayout={(e) => setClipWidth(e.nativeEvent.layout.width)}
    >
      <Animated.Text
        // Single line, but measured at natural width so overflow is real. On web
        // `numberOfLines` would clamp with an ellipsis (which the rule forbids)
        // and make the measured width equal the clip's, so nowrap carries it
        // there and numberOfLines only guards native.
        numberOfLines={Platform.OS === 'web' ? undefined : 1}
        onLayout={(e) => setTextWidth(e.nativeEvent.layout.width)}
        style={[style, styles.text, { transform: [{ translateX }] }]}
      >
        {children}
      </Animated.Text>
    </View>
  );
}

function alignItems(align) {
  if (align === 'center') return 'center';
  if (align === 'right') return 'flex-end';
  return 'flex-start';
}

const styles = StyleSheet.create({
  clip: {
    // Full width of the parent, clipping the text; height stays natural so the
    // marquee does not stretch vertically inside a column header.
    alignSelf: 'stretch',
    overflow: 'hidden',
  },
  text: {
    flexShrink: 0,
    // Web: keep it on one line at natural width so the clip (overflow hidden)
    // does the clipping and the measurement reflects the true text width.
    ...Platform.select({ web: { whiteSpace: 'nowrap' } }),
  },
});
