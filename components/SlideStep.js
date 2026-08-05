import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

/**
 * Slides its children in whenever `stepKey` changes, like a navigation
 * push/pop inside a fixed bottom sheet: forward (direction 1) enters from the
 * right, back (direction -1) enters from the left. The sheet stays put — only
 * the content moves. The first render doesn't animate (the sheet itself is
 * already sliding up).
 */
export default function SlideStep({ stepKey, direction = 1, children }) {
  const tx = useRef(new Animated.Value(0)).current;
  const width = useRef(360);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return undefined;
    }
    tx.setValue(direction * width.current);
    const anim = Animated.timing(tx, {
      toValue: 0,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
    // Intentionally keyed only on stepKey — direction is read at fire time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepKey]);

  return (
    <View style={styles.clip}>
      <Animated.View
        onLayout={(e) => {
          const w = e.nativeEvent.layout.width;
          if (w) width.current = w;
        }}
        style={[styles.fill, { transform: [{ translateX: tx }] }]}
      >
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  clip: {
    flex: 1,
    alignSelf: 'stretch',
    overflow: 'hidden',
    // Let nested scroll views bound their height to the sheet (so they scroll).
    minHeight: 0,
  },
  fill: {
    flex: 1,
    alignSelf: 'stretch',
    minHeight: 0,
  },
});
