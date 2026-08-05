import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, { Defs, Ellipse, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { radius } from '../../theme/tokens';

// One-point-perspective garage interior, drawn edge-to-edge so it can be scaled
// up as the hero of the onboarding. Everything is drawn INSIDE the opening — no
// outer box, no bottom front frame — so the floor runs out toward the viewer and
// the entrance reads as a real opening.
const DESIGN_W = 360;
const DESIGN_H = 300;
// Front opening (near the viewer) spans the full width — top + sides only, open
// at the bottom.
const FL = 0;
const FR = 360;
const FT = 6;
const FB = 286;
// Back wall (set back and up toward the vanishing point) — smaller.
const BL = 124;
const BR = 236;
const BT = 88;
const BB = 186;

// Full-width sliding door across the front opening.
const FRONT_W = FR - FL; // 360
const FRONT_H = FB - FT; // 280

const CAR_W = 190;
const CAR_H = 146;
const CAR_LEFT = (DESIGN_W - CAR_W) / 2;
const PARK_TOP = 87; // parked (deep) vertical anchor; drive brings it forward

const DURATION = 5000;
// Generous inset kept inside the measured area so the garage never touches the edges.
const PAD = 10;

/** Rear three-quarter of a classic car — what you see as it drives away from
 *  you into the garage. */
function Car() {
  return (
    <Svg width={CAR_W} height={CAR_H} viewBox="0 0 96 74">
      <Defs>
        <LinearGradient id="carBody" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#454d57" />
          <Stop offset="1" stopColor="#282d34" />
        </LinearGradient>
        <LinearGradient id="carGlass" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#8b98a8" />
          <Stop offset="1" stopColor="#5b6673" />
        </LinearGradient>
      </Defs>
      {/* contact shadow */}
      <Ellipse cx="48" cy="69" rx="39" ry="5" fill="#000" opacity="0.28" />
      {/* rear wheels peeking at the sides */}
      <Rect x="12" y="50" width="17" height="19" rx="6" fill="#15181c" />
      <Rect x="67" y="50" width="17" height="19" rx="6" fill="#15181c" />
      {/* cabin / roof */}
      <Path d="M28 12 Q30 8 40 8 L56 8 Q66 8 68 12 L72 30 L24 30 Z" fill="#2d333b" />
      {/* rear window */}
      <Path d="M31 13 Q33 11 40 11 L56 11 L63 27 L33 27 Z" fill="url(#carGlass)" opacity="0.92" />
      {/* body */}
      <Path
        d="M12 40 Q12 30 22 29 L74 29 Q84 30 84 40 L84 57 Q84 62 79 62 L17 62 Q12 62 12 57 Z"
        fill="url(#carBody)"
      />
      {/* chrome trim */}
      <Rect x="12" y="38" width="72" height="2" rx="1" fill="#aeb6c0" opacity="0.5" />
      {/* tail lights */}
      <Rect x="18" y="43" width="13" height="8" rx="2.5" fill="#d64545" />
      <Rect x="65" y="43" width="13" height="8" rx="2.5" fill="#d64545" />
      {/* plate + bumper */}
      <Rect x="40" y="52" width="16" height="7" rx="1.5" fill="#e9edf1" />
      <Rect x="14" y="58" width="68" height="5" rx="2.5" fill="#b7c0cb" />
    </Svg>
  );
}

/**
 * Premium onboarding animation, sized as the hero of the sheet. The garage door
 * is already open; a classic car drives slowly in through the entrance and parks
 * in the depth, then the full-width door slides down to close and holds. Loops
 * with a short beat.
 */
export default function GarageAnimation() {
  const progress = useRef(new Animated.Value(0)).current;
  const [box, setBox] = useState({ w: 0, h: 0 });

  useEffect(() => {
    // JS driver (not native): react-native-web does not reliably loop the native
    // driver, which would leave the animation stuck on its final frame.
    const run = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration: DURATION,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.delay(500),
      ])
    );
    run.start();
    return () => run.stop();
  }, [progress]);

  const range = (input, output, extrapolate = 'clamp') =>
    progress.interpolate({ inputRange: input, outputRange: output, extrapolate });

  // The scene fades in at the start so each loop reveals the already-open garage
  // cleanly; it then stays solid (no fade-out) and holds on the closed door.
  const sceneOpacity = range([0, 0.06], [0, 1]);
  // Door begins fully open, holds while the car drives in, then slides down.
  const doorY = range([0, 0.58, 0.74], [-FRONT_H, -FRONT_H, 0]);
  // Car drives slowly in from the front and recedes toward the back wall: it
  // moves up into the frame (translateY) while shrinking (scale) toward the
  // vanishing point, then dims as it settles into the interior shadow.
  const carTranslateY = range([0.06, 0.56], [77, 0]);
  const carScale = range([0.06, 0.56], [1, 0.36]);
  const carBob = range([0.3, 0.42, 0.54], [0, -3, 0]);
  const carOpacity = range([0.4, 0.56], [1, 0.62]);

  // Fit the fixed design into the measured area, keeping a generous inset.
  const scale =
    box.w > 0 ? Math.min((box.w - PAD * 2) / DESIGN_W, (box.h - PAD * 2) / DESIGN_H) : 0;

  return (
    <View
      style={styles.stage}
      onLayout={(e) => setBox({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}
    >
      {scale > 0 && (
        <Animated.View style={[styles.garage, { opacity: sceneOpacity, transform: [{ scale }] }]}>
          {/* Perspective interior — ceiling, side walls, receding floor and the
              deep back wall. No outer box, no front-bottom frame. */}
          <Svg width={DESIGN_W} height={DESIGN_H} viewBox={`0 0 ${DESIGN_W} ${DESIGN_H}`}>
            <Defs>
              <LinearGradient id="leftWall" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor="#3e464f" />
                <Stop offset="1" stopColor="#2a303a" />
              </LinearGradient>
              <LinearGradient id="rightWall" x1="1" y1="0" x2="0" y2="0">
                <Stop offset="0" stopColor="#373e47" />
                <Stop offset="1" stopColor="#262c34" />
              </LinearGradient>
              <LinearGradient id="ceiling" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#272c33" />
                <Stop offset="1" stopColor="#1e222860" />
              </LinearGradient>
              <LinearGradient id="floor" x1="0" y1="1" x2="0" y2="0">
                {/* front (viewer) fades out so there is no hard bottom boundary */}
                <Stop offset="0" stopColor="#434b55" stopOpacity="0" />
                <Stop offset="0.28" stopColor="#3f4650" stopOpacity="1" />
                <Stop offset="1" stopColor="#2f353d" stopOpacity="1" />
              </LinearGradient>
            </Defs>

            {/* ceiling */}
            <Path d={`M${FL} ${FT} L${FR} ${FT} L${BR} ${BT} L${BL} ${BT} Z`} fill="url(#ceiling)" />
            {/* side walls */}
            <Path d={`M${FL} ${FT} L${BL} ${BT} L${BL} ${BB} L${FL} ${FB} Z`} fill="url(#leftWall)" />
            <Path d={`M${FR} ${FT} L${BR} ${BT} L${BR} ${BB} L${FR} ${FB} Z`} fill="url(#rightWall)" />
            {/* receding floor */}
            <Path d={`M${FL} ${FB} L${BL} ${BB} L${BR} ${BB} L${FR} ${FB} Z`} fill="url(#floor)" />
            {/* deep back wall */}
            <Path d={`M${BL} ${BT} L${BR} ${BT} L${BR} ${BB} L${BL} ${BB} Z`} fill="#16191d" />

            {/* faint wall/floor seams give the perspective definition */}
            <Path
              d={`M${FL} ${FB} L${BL} ${BB} M${FR} ${FB} L${BR} ${BB}`}
              stroke="#ffffff"
              strokeOpacity="0.05"
              strokeWidth="1"
            />
          </Svg>

          {/* The car, driving into the depth. */}
          <Animated.View
            style={[
              styles.carWrap,
              {
                opacity: carOpacity,
                transform: [
                  { translateY: Animated.add(carTranslateY, carBob) },
                  { scale: carScale },
                ],
              },
            ]}
            pointerEvents="none"
          >
            <Car />
          </Animated.View>

          {/* Full-width sliding door over the front opening. */}
          <View style={styles.doorClip} pointerEvents="none">
            <Animated.View style={[styles.door, { transform: [{ translateY: doorY }] }]}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <View key={i} style={styles.doorPanel} />
              ))}
              <View style={styles.doorHandle} />
            </Animated.View>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  garage: {
    width: DESIGN_W,
    height: DESIGN_H,
    overflow: 'hidden',
  },
  carWrap: {
    position: 'absolute',
    left: CAR_LEFT,
    top: PARK_TOP,
    width: CAR_W,
    height: CAR_H,
  },
  doorClip: {
    position: 'absolute',
    left: FL,
    top: FT,
    width: FRONT_W,
    height: FRONT_H,
    overflow: 'hidden',
    borderRadius: radius.sm,
  },
  door: {
    width: FRONT_W,
    height: FRONT_H,
    backgroundColor: '#dfe4e9',
    paddingVertical: 5,
    paddingHorizontal: 6,
    justifyContent: 'space-between',
  },
  doorPanel: {
    flex: 1,
    marginVertical: 3,
    borderRadius: 4,
    backgroundColor: '#eef1f4',
    borderWidth: 1,
    borderColor: '#cfd6dd',
  },
  doorHandle: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 24,
    width: 48,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#b8c0c8',
  },
});
