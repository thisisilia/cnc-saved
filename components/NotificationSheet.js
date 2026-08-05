import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { color, font, radius, size, spacing } from '../theme/tokens';
import BottomSheet from './BottomSheet';
import AppIcon from './icons/AppIcon';

function Reminder({ reminder, onAction }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardBody}>
        {/* Plain glyph, no chip — the comp uses a bare 32px icon here. */}
        <AppIcon name={reminder.icon} size={size[8]} color={color.icon.brandPrimaryRegular} />
        <View style={styles.text}>
          <Text style={styles.title}>{reminder.title}</Text>
          <Text style={styles.description}>{reminder.description}</Text>
        </View>
      </View>

      {reminder.action && (
        <Pressable
          style={({ pressed }) => [styles.actionButton, pressed && styles.actionPressed]}
          onPress={() => onAction(reminder)}
          accessibilityRole="button"
          accessibilityLabel={`${reminder.action} for ${reminder.vehicle}`}
        >
          <Text style={styles.actionLabel}>{reminder.action}</Text>
        </Pressable>
      )}
    </View>
  );
}

/**
 * Notification Center. Reminders arrive pre-sorted by urgency — those with a
 * primary action come before informational ones.
 */
export default function NotificationSheet({ visible, onClose, reminders, onAction = () => {} }) {
  return (
    <BottomSheet visible={visible} onClose={onClose} maxHeightRatio={0.92}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {reminders.map((reminder) => (
          <Reminder key={reminder.id} reminder={reminder} onAction={onAction} />
        ))}
      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  scroll: {
    alignSelf: 'stretch',
  },
  list: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    gap: spacing[4],
  },
  card: {
    backgroundColor: color.background.neutralSubtle,
    borderRadius: radius.lg,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    gap: spacing[4],
  },
  cardBody: {
    flexDirection: 'row',
    gap: spacing[4],
  },
  text: {
    flex: 1,
    gap: spacing.xxs,
  },
  title: {
    ...font.bodySmEmphasized,
    color: color.text.neutralBold,
  },
  description: {
    ...font.bodyXsRegular,
    color: color.text.neutralRegular,
  },
  actionButton: {
    height: 33,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: color.background.brandPrimaryRegular,
  },
  actionPressed: {
    opacity: 0.85,
  },
  actionLabel: {
    ...font.bodySmEmphasized,
    color: color.text.inverseBold,
  },
});
