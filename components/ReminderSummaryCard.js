import { Feather } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { color, font, radius, spacing } from '../theme/tokens';

const INTERVAL_MS = 3200;

/**
 * Cycles through the most urgent reminders. Figma models this as an
 * "Animation" component with the lines stacked, so they rotate in place rather
 * than all showing at once. Holds on the first line if the OS asks for reduced
 * motion, since an auto-playing loop is the sort of thing that setting is for.
 */
function CyclingText({ lines }) {
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (!cancelled) setReduceMotion(enabled);
    });
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => {
      cancelled = true;
      sub?.remove();
    };
  }, []);

  useEffect(() => {
    if (reduceMotion || lines.length < 2) return undefined;
    const timer = setInterval(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 220,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (!finished) return;
        setIndex((i) => (i + 1) % lines.length);
        Animated.timing(opacity, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }).start();
      });
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [lines.length, opacity, reduceMotion]);

  return (
    <Animated.Text style={[styles.summary, { opacity }]} numberOfLines={1}>
      {lines[index]}
    </Animated.Text>
  );
}

/**
 * Highest-priority ownership reminder, with a link into the full list.
 *
 * `bare` drops the card chrome for use inside an existing card; `showIcon`
 * drops the bell, for cards where the sibling rows carry no icon.
 */
export default function ReminderSummaryCard({ lines, onSeeAll, bare = false, showIcon = true }) {
  return (
    <View style={[styles.row, !bare && styles.card]}>
      <View style={styles.leading}>
        {showIcon && <Feather name="bell" size={24} color={color.icon.brandPrimaryRegular} />}
        <View style={styles.textWrap}>
          <CyclingText lines={lines} />
        </View>
      </View>

      <Pressable
        style={styles.seeAll}
        onPress={onSeeAll}
        accessibilityRole="button"
        accessibilityLabel="See all reminders"
        hitSlop={8}
      >
        <Text style={styles.seeAllLabel}>See all</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[2],
  },
  card: {
    backgroundColor: color.background.neutralSubtle,
    borderRadius: radius.lg,
    padding: spacing[4],
  },
  leading: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  textWrap: {
    flex: 1,
  },
  summary: {
    ...font.bodySmEmphasized,
    color: color.text.neutralBold,
  },
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  seeAllLabel: {
    ...font.bodySmRegular,
    color: color.text.brandPrimaryRegular,
  },
});
