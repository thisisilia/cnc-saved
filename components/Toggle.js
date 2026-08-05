import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';

const TRACK_WIDTH = 64;
const TRACK_HEIGHT = 28;
const KNOB_WIDTH = 39;
const KNOB_HEIGHT = 24;
const INSET = 2;
const TRAVEL = TRACK_WIDTH - KNOB_WIDTH - INSET * 2;

const TRACK_ON = '#34c759';
const TRACK_OFF = 'rgba(60,60,67,0.3)';

/**
 * iOS-style switch, per the "Toggle - Switch" component in Figma.
 *
 * Replaces React Native's Switch, which renders as a bare checkbox-ish control
 * on web and can't be sized to the comp's 64x28 track.
 *
 * `showAxLabel` draws the on/off marks — the bar and ring iOS shows when
 * "On/Off Labels" is enabled in accessibility settings. On by default, matching
 * the Figma default.
 */
export default function Toggle({ value, onValueChange, showAxLabel = true, accessibilityLabel }) {
  const progress = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: value ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.quad),
      // Colour interpolation is not supported by the native driver.
      useNativeDriver: false,
    }).start();
  }, [value, progress]);

  const translateX = progress.interpolate({ inputRange: [0, 1], outputRange: [0, TRAVEL] });
  const backgroundColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [TRACK_OFF, TRACK_ON],
  });

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      role="switch"
      // Both spellings: accessibilityState is the native API, aria-checked is
      // what react-native-web actually emits to the DOM.
      accessibilityState={{ checked: value }}
      aria-checked={value}
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
    >
      <Animated.View style={[styles.track, { backgroundColor }]}>
        {showAxLabel && (
          <>
            {/* "On" bar sits left of the knob; "off" ring sits right of it. */}
            <Animated.View style={[styles.axBar, { opacity: progress }]} />
            <Animated.View
              style={[
                styles.axRing,
                { opacity: progress.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) },
              ]}
            />
          </>
        )}
        <Animated.View style={[styles.knob, { transform: [{ translateX }] }]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: 100,
    padding: INSET,
    justifyContent: 'center',
  },
  knob: {
    width: KNOB_WIDTH,
    height: KNOB_HEIGHT,
    borderRadius: 100,
    backgroundColor: '#ffffff',
  },
  axBar: {
    position: 'absolute',
    left: 10,
    width: 1,
    height: 10,
    backgroundColor: '#ffffff',
  },
  axRing: {
    position: 'absolute',
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ffffff',
  },
});
