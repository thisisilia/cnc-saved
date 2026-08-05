import { useEffect, useRef } from 'react';
import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { borderWidth, color, radius, spacing } from '../../theme/tokens';

/**
 * UK number plate.
 *
 * The comp sets the text in "UKNumberPlate" (Charles Wright), which is not
 * bundled — no font file was provided — so this falls back to a condensed
 * monospace. The plate shape and colours are right; the letterforms are not.
 * Drop the .ttf in and point `plateFont` at it to fix.
 */
export const plateFont = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'Menlo, monospace',
});

/** Large editable plate on the registration step. */
export function RegPlateInput({ value, onChangeText, autoFocus }) {
  const ref = useRef(null);

  // Focus AFTER the sheet has finished sliding up — focusing mid-animation makes
  // the browser scroll-jump the sheet (web) or pop the keyboard mid-slide
  // (mobile), which reads as a bounce. `preventScroll` stops the web scroll-jump.
  useEffect(() => {
    if (!autoFocus) return undefined;
    const timer = setTimeout(() => {
      const node = ref.current;
      if (!node) return;
      try {
        node.focus({ preventScroll: true });
      } catch {
        node.focus?.();
      }
    }, 380);
    return () => clearTimeout(timer);
  }, [autoFocus]);

  return (
    <View style={styles.inputPlate}>
      <TextInput
        ref={ref}
        style={[styles.plateText, styles.inputText, !value && styles.placeholder]}
        value={value}
        onChangeText={(text) => onChangeText(text.toUpperCase())}
        placeholder="ENTER REG"
        placeholderTextColor="rgba(60,60,67,0.18)"
        autoCapitalize="characters"
        autoCorrect={false}
        maxLength={8}
        accessibilityLabel="Vehicle registration"
      />
    </View>
  );
}

/** Small read-only plate on the vehicle summary card. */
export default function RegPlate({ value }) {
  return (
    <View style={styles.badge}>
      <Text style={[styles.plateText, styles.badgeText]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  inputPlate: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    backgroundColor: color.background.neutralWhite,
    borderRadius: radius.xl,
    paddingHorizontal: spacing[8],
    paddingVertical: spacing[5],
  },
  plateText: {
    fontFamily: plateFont,
    fontWeight: '700',
  },
  inputText: {
    flex: 1,
    minWidth: 0,
    fontSize: 40,
    letterSpacing: 1,
    color: color.text.neutralBold,
    outlineStyle: 'none',
    // In the style, not the `textAlign` prop — that prop does not reach the DOM
    // on react-native-web, leaving the text left-aligned.
    textAlign: 'center',
  },
  placeholder: {
    color: 'rgba(60,60,67,0.18)',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: color.background.neutralWhite,
    borderWidth: borderWidth.xs,
    borderColor: color.border.white,
    borderRadius: radius.md,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1.5],
    // The comp lifts the plate off the page with a shadow; the white edge alone
    // would be invisible here.
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  badgeText: {
    fontSize: 18,
    letterSpacing: 1,
    color: color.text.neutralBold,
  },
});
