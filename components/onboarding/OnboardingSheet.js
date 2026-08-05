import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { color, font, fontFamily, radius, spacing } from '../../theme/tokens';
import BottomSheet from '../BottomSheet';

/** The three onboarding screens (Figma 1305-22441 / 22492 / 22556). */
const SCREENS = [
  {
    title: 'Your garage is here!',
    subtitle:
      'Add your vehicle to your garage and receive up-to-date valuation insights whenever you need them.',
    image: require('../../assets/onboarding/onboarding-1.png'),
  },
  {
    title: "Know your vehicle's value",
    subtitle:
      "Keep track of your latest valuation and see how your vehicle's market value changes over time.",
    image: require('../../assets/onboarding/onboarding-2.png'),
  },
  {
    title: 'Never miss an important update',
    subtitle:
      'Receive timely reminders for insurance, MOT, tax, mileage, and valuation updates—all in one place.',
    image: require('../../assets/onboarding/onboarding-3.png'),
  },
];

const HOLD_MS = 2600; // each screen is visible ~2.6s before advancing
const SLIDE_MS = 460;

/**
 * First-run onboarding — an auto-advancing carousel. Each screen holds for a
 * beat, then the text + illustration slide left as the next enters from the
 * right (an appended copy of the first screen makes the loop seamless). The
 * page indicator updates in step; the sheet itself stays put.
 */
export default function OnboardingSheet({ visible, onClose }) {
  const [width, setWidth] = useState(0);
  const widthRef = useRef(0);
  const [active, setActive] = useState(0);
  const tx = useRef(new Animated.Value(0)).current;
  const posRef = useRef(0);
  const timerRef = useRef(null);

  const slideTo = (pos, onDone) => {
    Animated.timing(tx, {
      toValue: -pos * widthRef.current,
      duration: SLIDE_MS,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => finished && onDone && onDone());
  };

  const goNext = () => {
    if (!widthRef.current) return;
    const next = posRef.current + 1;
    setActive(next % SCREENS.length);
    slideTo(next, () => {
      // Landed on the appended copy of screen 1 — snap back invisibly.
      if (next >= SCREENS.length) {
        tx.setValue(0);
        posRef.current = 0;
      } else {
        posRef.current = next;
      }
    });
  };

  const goPrev = () => {
    if (!widthRef.current || posRef.current <= 0) return;
    const prev = posRef.current - 1;
    setActive(prev % SCREENS.length);
    posRef.current = prev;
    slideTo(prev);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(goNext, HOLD_MS);
  };

  // The pan responder fires the latest handlers via this ref.
  const handlers = useRef({});
  handlers.current = { goNext, goPrev, startTimer };

  const pan = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) =>
          Math.abs(g.dx) > 12 && Math.abs(g.dx) > Math.abs(g.dy) * 1.4,
        onPanResponderRelease: (_, g) => {
          if (g.dx <= -40) handlers.current.goNext();
          else if (g.dx >= 40) handlers.current.goPrev();
          // Restart the auto-advance clock after a manual swipe.
          handlers.current.startTimer();
        },
      }),
    []
  );

  // Two-finger trackpad swipe (web): a horizontal wheel gesture navigates too.
  const swipeArea = useRef(null);
  const wheelAt = useRef(0);
  useEffect(() => {
    if (Platform.OS !== 'web' || !visible) return undefined;
    const node = swipeArea.current;
    if (!node || !node.addEventListener) return undefined;
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) < 24 || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      const now = Date.now();
      if (now - wheelAt.current < 500) return; // one navigation per swipe
      wheelAt.current = now;
      if (e.deltaX > 0) handlers.current.goNext();
      else handlers.current.goPrev();
      handlers.current.startTimer();
    };
    node.addEventListener('wheel', onWheel, { passive: false });
    return () => node.removeEventListener('wheel', onWheel);
    // `width` gates this so it re-runs once the illustration has mounted and the
    // ref resolves (the sheet defers rendering its children).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, width]);

  // Auto-advance while open.
  useEffect(() => {
    if (!visible || !width) {
      stopTimer();
      return undefined;
    }
    startTimer();
    return stopTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, width]);

  // Reset to the first screen whenever the sheet is (re)opened.
  useEffect(() => {
    if (!visible) {
      posRef.current = 0;
      tx.setValue(0);
      setActive(0);
    }
  }, [visible, tx]);

  // Append a copy of the first screen so the wrap-around slides forward.
  const pages = [...SCREENS, SCREENS[0]];

  return (
    <BottomSheet visible={visible} onClose={onClose} topInset={24} fill>
      <View style={styles.body}>
        <View style={styles.header}>
          <View
            style={styles.textPager}
            onLayout={(e) => {
              const w = e.nativeEvent.layout.width;
              widthRef.current = w;
              setWidth(w);
            }}
          >
            <Animated.View style={[styles.row, { transform: [{ translateX: tx }] }]}>
              {pages.map((screen, i) => (
                <View key={i} style={[styles.textPage, { width }]}>
                  <Text style={styles.title}>{screen.title}</Text>
                  <Text style={styles.subtitle}>{screen.subtitle}</Text>
                </View>
              ))}
            </Animated.View>
          </View>

          <View style={styles.dots}>
            {SCREENS.map((_, i) => (
              <View key={i} style={[styles.dot, i === active && styles.dotActive]} />
            ))}
          </View>
        </View>

        <View ref={swipeArea} style={styles.illustration} {...pan.panHandlers}>
          <Animated.View style={[styles.rowFill, { transform: [{ translateX: tx }] }]}>
            {pages.map((screen, i) => (
              <View key={i} style={[styles.illustrationPage, { width }]}>
                <Image source={screen.image} style={styles.image} resizeMode="contain" />
              </View>
            ))}
          </Animated.View>
        </View>

        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Get started"
        >
          <Text style={styles.buttonLabel}>Get started</Text>
        </Pressable>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignSelf: 'stretch',
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
    gap: spacing[4],
  },
  header: {
    gap: spacing[2],
  },
  textPager: {
    alignSelf: 'stretch',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
  },
  textPage: {
    gap: spacing[1],
    paddingHorizontal: spacing[1],
  },
  title: {
    fontFamily: fontFamily.robotoFlex,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
    color: color.text.neutralBold,
    textAlign: 'center',
  },
  subtitle: {
    ...font.bodySmRegular,
    color: color.text.neutralRegular,
    textAlign: 'center',
  },
  dots: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    gap: spacing[1],
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: color.border.neutralRegular,
  },
  dotActive: {
    width: 16,
    backgroundColor: color.background.brandPrimaryRegular,
  },
  illustration: {
    flex: 1,
    alignSelf: 'stretch',
    overflow: 'hidden',
  },
  rowFill: {
    flexDirection: 'row',
    height: '100%',
  },
  illustrationPage: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  button: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.xl,
    backgroundColor: color.background.brandPrimaryRegular,
  },
  pressed: {
    opacity: 0.85,
  },
  buttonLabel: {
    ...font.bodyEmphasized,
    color: color.text.inverseBold,
  },
});
