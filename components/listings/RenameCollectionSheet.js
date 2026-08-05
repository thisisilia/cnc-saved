import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { borderWidth, color, font, radius, spacing } from '../../theme/tokens';
import BottomSheet from '../BottomSheet';
import Button from '../vehicle/Button';

/**
 * Rename a collection. The field carries a floating label, per the comp.
 *
 * The field takes focus as the sheet opens so the keyboard is already up — the
 * sheet exists only to type in. BottomSheet lifts itself clear of it.
 */
export default function RenameCollectionSheet({ visible, collection, onClose, onRename }) {
  const [name, setName] = useState('');

  // Seed from the collection each time it opens, so an abandoned edit doesn't
  // persist into the next one.
  useEffect(() => {
    if (visible) setName(collection?.name ?? '');
  }, [visible, collection]);

  const trimmed = name.trim();

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.body}>
        <Text style={styles.title}>Rename collection</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Collection name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            autoFocus
            // Typing replaces the old name rather than appending to it.
            selectTextOnFocus
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={() => trimmed && onRename(trimmed)}
            accessibilityLabel="Collection name"
          />
        </View>

        {/* An empty name would silently wipe the collection's label. */}
        <Button
          label="Rename"
          onPress={trimmed ? () => onRename(trimmed) : undefined}
          style={!trimmed && styles.disabled}
        />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  body: {
    alignSelf: 'stretch',
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
    gap: spacing[4],
  },
  title: {
    ...font.bodyEmphasized,
    color: color.text.neutralBold,
  },
  field: {
    borderWidth: borderWidth.xs,
    borderColor: color.border.neutralBold,
    borderRadius: radius.md,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    gap: spacing[1],
  },
  label: {
    ...font.caption2Regular,
    color: color.text.neutralRegular,
  },
  input: {
    ...font.calloutRegular,
    color: color.text.neutralBold,
    padding: 0,
    outlineStyle: 'none',
  },
  disabled: {
    opacity: 0.5,
  },
});
