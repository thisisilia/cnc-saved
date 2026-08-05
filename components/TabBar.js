import { Feather, Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, font, radius, spacing } from '../theme/tokens';

// Mirrors the SF Symbols in the comp. Feather matches their stroke weight, but
// has no person-in-circle glyph, so Account borrows from Ionicons.
const TABS = [
  { key: 'search', label: 'Search', icon: 'search', set: Feather },
  { key: 'saved', label: 'Saved', icon: 'heart', set: Feather },
  { key: 'sell', label: 'Sell', icon: 'plus-square', set: Feather },
  { key: 'inbox', label: 'Inbox', icon: 'message-circle', set: Feather },
  { key: 'account', label: 'Account', icon: 'person-circle-outline', set: Ionicons },
];

function Tab({ tab, active, onPress }) {
  const tint = active ? color.text.brandPrimaryRegular : color.text.neutralBold;
  const Icon = tab.set;
  return (
    <Pressable
      style={[styles.tab, active && styles.tabActive]}
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      accessibilityLabel={tab.label}
    >
      <Icon name={tab.icon} size={24} color={tint} />
      <Text style={[styles.label, { color: tint }, active && styles.labelActive]}>
        {tab.label}
      </Text>
    </Pressable>
  );
}

/** Floating iOS 26-style pill nav. */
export default function TabBar({ active = 'saved', onChange = () => {} }) {
  return (
    <View style={styles.container}>
      <View style={styles.pill}>
        {TABS.map((tab) => (
          <Tab
            key={tab.key}
            tab={tab}
            active={tab.key === active}
            onPress={() => onChange(tab.key)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing[3],
    paddingBottom: spacing[3],
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    paddingVertical: spacing[1],
    paddingLeft: spacing[1],
    paddingRight: spacing[2],
    borderRadius: radius.full,
    backgroundColor: color.overlay.inverseBold,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  tab: {
    height: 53,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
  tabActive: {
    backgroundColor: color.background.neutralSubtle,
    borderRadius: radius.full,
  },
  label: {
    ...font.caption1Regular,
    textAlign: 'center',
  },
  labelActive: {
    ...font.caption1Emphasized,
  },
});
