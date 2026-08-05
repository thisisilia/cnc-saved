import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, font, spacing } from '../../theme/tokens';
import BottomSheet from '../BottomSheet';

/**
 * Overflow menu behind the "..." on a collection.
 *
 * No comp was provided for this menu — only for the Rename sheet it opens — so
 * the list itself is inferred from the collection actions described for the
 * page. The system "All saved listings" collection is derived, so it offers
 * neither rename nor delete.
 */
export default function CollectionActionsSheet({ visible, collection, onClose, onRename, onDelete }) {
  const editable = collection && !collection.system;

  const actions = [
    editable && { key: 'rename', icon: 'edit-2', label: 'Rename collection', onPress: onRename },
    editable && { key: 'delete', icon: 'trash-2', label: 'Delete collection', onPress: onDelete, destructive: true },
  ].filter(Boolean);

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.body}>
        {actions.length === 0 ? (
          <Text style={styles.empty}>This collection is managed automatically.</Text>
        ) : (
          actions.map((action) => (
            <Pressable
              key={action.key}
              style={({ pressed }) => [styles.action, pressed && styles.pressed]}
              onPress={action.onPress}
              accessibilityRole="button"
              accessibilityLabel={action.label}
            >
              <Feather
                name={action.icon}
                size={20}
                color={action.destructive ? '#e5484d' : color.icon.neutralBold}
              />
              <Text style={[styles.label, action.destructive && styles.destructive]}>
                {action.label}
              </Text>
            </Pressable>
          ))
        )}
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
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[3],
  },
  pressed: {
    opacity: 0.6,
  },
  label: {
    ...font.calloutRegular,
    color: color.text.neutralBold,
  },
  destructive: {
    color: '#e5484d',
  },
  empty: {
    ...font.bodySmRegular,
    color: color.text.neutralRegular,
    paddingVertical: spacing[3],
  },
});
