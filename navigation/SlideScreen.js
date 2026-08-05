import { useNavigation } from '@react-navigation/native';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Platform } from 'react-native';
import { color, layout } from '../theme/tokens';

const DURATION = 300;

/**
 * Web-only screen slide. react-native-web does not animate the navigator's card
 * transition, so instead each screen animates itself: it slides in from the
 * right when pushed, and on back it slides out to the right (revealing the
 * previous screen, kept mounted via `detachPreviousScreen: false`) before the
 * pop completes. Navigation itself is untouched — this only wraps the content.
 */
function WebSlide({ children }) {
  const navigation = useNavigation();
  const width = layout.frameWidth;
  // Only pushed screens slide in; the root sits still on first load.
  const pushed = useRef(navigation.canGoBack()).current;
  const tx = useRef(new Animated.Value(pushed ? width : 0)).current;
  const leaving = useRef(false);

  useEffect(() => {
    if (pushed) {
      Animated.timing(tx, {
        toValue: 0,
        duration: DURATION,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const unsub = navigation.addListener('beforeRemove', (e) => {
      // The re-dispatched action (below) is allowed straight through.
      if (leaving.current) return;
      leaving.current = true;
      e.preventDefault();
      Animated.timing(tx, {
        toValue: width,
        duration: DURATION,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(() => navigation.dispatch(e.data.action));
    });
    return unsub;
  }, [navigation, width, tx]);

  return (
    <Animated.View style={styles.card(tx)}>{children}</Animated.View>
  );
}

const styles = {
  // Opaque so the screen underneath doesn't show through as this one slides.
  card: (tx) => ({
    flex: 1,
    backgroundColor: color.background.neutralWhite,
    transform: [{ translateX: tx }],
  }),
};

export default function SlideScreen({ children }) {
  // On native, the native-stack transition already slides; leave it to it.
  if (Platform.OS !== 'web') return children;
  return <WebSlide>{children}</WebSlide>;
}
