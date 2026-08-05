import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { color, font, radius, spacing } from '../theme/tokens';
import BottomSheet from './BottomSheet';
import Button from './vehicle/Button';

const ITEM_H = 40;
const VISIBLE = 5; // odd, so one row sits dead-centre
const PAD = ITEM_H * ((VISIBLE - 1) / 2);

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const YEARS = Array.from({ length: 2030 - 1960 + 1 }, (_, i) => String(1960 + i));

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/**
 * One scrollable drum. Owns the centred index for its own highlighting and
 * commits to the parent only once the scroll settles, so the wheel stays smooth
 * on web (where momentum end events are unreliable — a debounced settle is used
 * instead).
 */
function Wheel({ items, initialIndex, onChange, align = 'center' }) {
  const ref = useRef(null);
  const settle = useRef(null);
  const [active, setActive] = useState(initialIndex);

  useEffect(() => {
    const t = setTimeout(() => ref.current?.scrollTo({ y: initialIndex * ITEM_H, animated: false }), 0);
    return () => clearTimeout(t);
    // Only on mount — later external changes aren't expected while open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onScroll = (e) => {
    const y = e.nativeEvent.contentOffset.y;
    const i = clamp(Math.round(y / ITEM_H), 0, items.length - 1);
    if (i !== active) setActive(i);
    if (settle.current) clearTimeout(settle.current);
    settle.current = setTimeout(() => {
      ref.current?.scrollTo({ y: i * ITEM_H, animated: true });
      onChange(i);
    }, 140);
  };

  return (
    <ScrollView
      ref={ref}
      style={styles.wheel}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      onScroll={onScroll}
      snapToInterval={ITEM_H}
      decelerationRate="fast"
      contentContainerStyle={styles.wheelContent}
    >
      {items.map((label, i) => {
        const dist = Math.abs(i - active);
        return (
          <View key={label} style={styles.itemRow}>
            <Text
              numberOfLines={1}
              style={[
                styles.itemText,
                { textAlign: align },
                dist === 0 ? styles.itemActive : dist === 1 ? styles.itemNear : styles.itemFar,
              ]}
            >
              {label}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

/** Days available for the selected month/year (handles 30/31 and February). */
function daysInMonth(monthIndex, year) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

/**
 * iOS-style wheel date picker in a bottom sheet.
 *
 * mode="date" shows month / day / year drums and returns "D Month YYYY".
 * mode="year" shows a single year drum and returns "YYYY".
 */
export default function DatePickerSheet({ visible, mode = 'date', value, onClose, onConfirm }) {
  // Parse whatever the field currently holds; fall back to a sensible default.
  const parsed = parseValue(value);
  const [month, setMonth] = useState(parsed.month);
  const [day, setDay] = useState(parsed.day);
  const [year, setYear] = useState(parsed.year);

  // Re-seed each time the sheet opens so it reflects the field's current value.
  useEffect(() => {
    if (visible) {
      const p = parseValue(value);
      setMonth(p.month);
      setDay(p.day);
      setYear(p.year);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const yearNum = Number(YEARS[year]);
  const maxDay = daysInMonth(month, yearNum);
  const days = Array.from({ length: maxDay }, (_, i) => String(i + 1));
  const safeDay = Math.min(day, maxDay - 1);

  const confirm = () => {
    if (mode === 'year') {
      onConfirm(YEARS[year]);
    } else {
      onConfirm(`${safeDay + 1} ${MONTHS[month]} ${YEARS[year]}`);
    }
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.body}>
        <View style={styles.picker}>
          <View style={styles.selectionBand} pointerEvents="none" />
          {mode === 'year' ? (
            <Wheel key="year-only" items={YEARS} initialIndex={year} onChange={setYear} />
          ) : (
            <>
              <Wheel key={`m-${visible}`} items={MONTHS} initialIndex={month} onChange={setMonth} align="left" />
              <Wheel key={`d-${visible}-${month}-${year}`} items={days} initialIndex={safeDay} onChange={setDay} />
              <Wheel key={`y-${visible}`} items={YEARS} initialIndex={year} onChange={setYear} align="right" />
            </>
          )}
        </View>
        <Button label="Done" onPress={confirm} />
      </View>
    </BottomSheet>
  );
}

/** Loosely read a month name, day and 4-digit year out of the field's text. */
function parseValue(value) {
  const str = String(value ?? '');
  const now = new Date();
  const yearMatch = str.match(/\b(19|20)\d{2}\b/);
  const yearVal = yearMatch ? Number(yearMatch[0]) : 2026;
  const monthIdx = MONTHS.findIndex((m) => new RegExp(m.slice(0, 3), 'i').test(str));
  const dayMatch = str.match(/\b([0-3]?\d)\b(?!.*\b[0-3]?\d\b)/); // a 1–2 digit day, not the year
  const dayVal = dayMatch ? clamp(Number(dayMatch[1]), 1, 31) : 15;
  return {
    month: monthIdx >= 0 ? monthIdx : now.getMonth(),
    day: clamp(dayVal, 1, 31) - 1,
    year: clamp(YEARS.indexOf(String(yearVal)) >= 0 ? YEARS.indexOf(String(yearVal)) : YEARS.indexOf('2026'), 0, YEARS.length - 1),
  };
}

const styles = StyleSheet.create({
  body: {
    alignSelf: 'stretch',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[2],
    gap: spacing[4],
  },
  picker: {
    flexDirection: 'row',
    height: ITEM_H * VISIBLE,
    borderRadius: radius.lg,
    backgroundColor: color.background.neutralWhite,
    overflow: 'hidden',
  },
  selectionBand: {
    position: 'absolute',
    left: spacing[3],
    right: spacing[3],
    top: PAD,
    height: ITEM_H,
    borderRadius: radius.md,
    backgroundColor: color.background.neutralSubtle,
  },
  wheel: {
    flex: 1,
  },
  wheelContent: {
    paddingVertical: PAD,
  },
  itemRow: {
    height: ITEM_H,
    justifyContent: 'center',
    paddingHorizontal: spacing[3],
  },
  itemText: {
    ...font.calloutRegular,
    fontSize: 20,
  },
  itemActive: {
    color: color.text.neutralBold,
    fontWeight: '600',
  },
  itemNear: {
    color: color.text.neutralRegular,
  },
  itemFar: {
    color: color.text.neutralRegular,
    opacity: 0.4,
  },
});
