import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { color, font, layout, radius, size, spacing } from '../theme/tokens';
import AppIcon from './icons/AppIcon';
import MarqueeText from './MarqueeText';

/** Bare chevron — no chip or border, consistent across every page. */
function BackButton({ onPress }) {
  return (
    <Pressable
      style={styles.back}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Back"
      hitSlop={8}
    >
      <Feather name="chevron-left" size={size[6]} color={color.text.neutralBold} />
    </Pressable>
  );
}

/**
 * Fixed page header: back button, title, optional subtitle, and trailing
 * actions.
 *
 * Each action is { key, label, tone, onPress } plus its content: `text` for a
 * label pill, `glyph` for an icon exported from the Figma library, or
 * `icon`/`set` for a bundled font icon where no export exists yet.
 */
export default function NavHeader({ title, subtitle, onBack, actions = [] }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: Math.max(insets.top, layout.headerTop) }]}>
      <View style={styles.leading}>
        <BackButton onPress={onBack} />
        <View style={styles.titleBlock}>
          <MarqueeText style={styles.title}>{title}</MarqueeText>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>

      {actions.length > 0 && (
        <View style={styles.actions}>
          {actions.map((action) => {
            const brand = action.tone === 'brand';
            const danger = action.tone === 'danger';
            const tint = brand
              ? color.background.neutralWhite
              : danger
                ? color.icon.dangerBold
                : color.text.neutralBold;
            const Icon = action.set ?? Feather;
            return (
              <Pressable
                key={action.key}
                style={[
                  styles.action,
                  action.text && styles.actionText,
                  brand ? styles.actionBrand : styles.actionNeutral,
                ]}
                onPress={action.onPress}
                accessibilityRole="button"
                accessibilityLabel={action.label}
              >
                {action.text ? (
                  <Text style={[styles.actionLabel, { color: tint }]}>{action.text}</Text>
                ) : action.glyph ? (
                  <AppIcon name={action.glyph} size={size[6]} color={tint} />
                ) : (
                  <Icon name={action.icon} size={size[6]} color={tint} />
                )}
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: color.background.neutralWhite,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2.5],
    paddingHorizontal: spacing[4],
    paddingBottom: layout.headerBottom,
  },
  leading: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2.5],
  },
  back: {
    width: size[10],
    height: size[10],
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -spacing[2],
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    ...font.title3Emphasized,
    color: color.text.neutralBold,
  },
  subtitle: {
    ...font.bodySmRegular,
    color: color.text.neutralRegular,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  // Fixed square rather than padding + a min: the icon's line box is taller
  // than it is wide, which made these 40x42.
  action: {
    width: size[10],
    height: size[10],
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
  },
  actionNeutral: {
    backgroundColor: color.background.neutralRegular,
  },
  actionText: {
    width: 'auto',
    paddingHorizontal: spacing[4],
    borderRadius: radius.full,
  },
  actionLabel: {
    ...font.calloutEmphasized,
  },
  actionBrand: {
    backgroundColor: color.background.brandPrimaryRegular,
  },
});
