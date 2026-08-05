import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, font, spacing } from '../theme/tokens';

/** Card title with a disclosure chevron, plus the "3 lists" subtext beneath. */
export default function SectionHeading({ title, subtitle, onPress }) {
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.titleRow}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${title}, ${subtitle}`}
      >
        <Text style={styles.title}>{title}</Text>
        <Feather name="chevron-right" size={16} color={color.text.neutralBold} />
      </Pressable>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xxs,
    alignSelf: 'stretch',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    alignSelf: 'flex-start',
  },
  title: {
    ...font.bodyEmphasized,
    color: color.text.neutralBold,
  },
  subtitle: {
    ...font.bodySmRegular,
    color: color.text.neutralRegular,
  },
});
