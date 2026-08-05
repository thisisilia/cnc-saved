import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { color, font, spacing } from '../../theme/tokens';
import BottomSheet from '../BottomSheet';
import Checkbox from '../Checkbox';

/**
 * Options for a select field. Single choice, so the rows carry radios.
 *
 * No comp covers the open state of a select — only its closed row — so this
 * follows the sheet and radio patterns already established.
 */
export default function OptionSheet({ visible, title, options = [], value, onClose, onSelect }) {
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {options.map((option) => {
            const selected = option === value;
            return (
              <Pressable
                key={option}
                style={({ pressed }) => [styles.row, pressed && styles.pressed]}
                onPress={() => onSelect(option)}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                accessibilityLabel={option}
              >
                <Text style={styles.label}>{option}</Text>
                <Checkbox
                  shape="radio"
                  checked={selected}
                  onChange={() => onSelect(option)}
                  accessibilityLabel={option}
                />
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  body: {
    alignSelf: 'stretch',
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
    gap: spacing[2],
    maxHeight: 420,
  },
  title: {
    ...font.bodyEmphasized,
    color: color.text.neutralBold,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[3],
    paddingVertical: spacing[3],
  },
  pressed: {
    opacity: 0.6,
  },
  label: {
    ...font.calloutRegular,
    color: color.text.neutralBold,
    flex: 1,
  },
});
