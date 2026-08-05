import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, font, radius, spacing } from '../../theme/tokens';
import Checkbox from '../Checkbox';

/**
 * A titled card of radio options, laid out inline rather than behind a picker.
 *
 * Used for the short, fixed choices — fuel, transmission, steering — where the
 * options are few enough to show at once and worth seeing without a tap.
 */
export default function RadioGroupCard({ title, options, value, onChange }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {options.map((option) => (
        <Pressable
          key={option}
          style={({ pressed }) => [styles.row, pressed && styles.pressed]}
          onPress={() => onChange(option)}
          accessibilityRole="radio"
          accessibilityState={{ checked: option === value }}
          accessibilityLabel={option}
        >
          <Checkbox
            shape="radio"
            checked={option === value}
            onChange={() => onChange(option)}
            accessibilityLabel={option}
          />
          <Text style={styles.label}>{option}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.background.neutralSubtle,
    borderRadius: radius.lg,
    padding: spacing[3],
    gap: spacing[2],
  },
  title: {
    ...font.bodySmEmphasized,
    color: color.text.neutralBold,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[1.5],
  },
  pressed: {
    opacity: 0.6,
  },
  label: {
    ...font.subheadlineRegular,
    color: color.text.neutralBold,
    flex: 1,
  },
});
