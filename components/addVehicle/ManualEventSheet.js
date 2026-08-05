import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { makePhotos } from '../../data/photos';
import { color, font, radius, spacing } from '../../theme/tokens';
import BottomSheet from '../BottomSheet';
import Button from '../vehicle/Button';
import { TextField } from './Field';

const EMPTY = { date: '', category: '', description: '', image: null };

/**
 * Add a history event by hand.
 *
 * The timeline is normally built by analysing uploaded documents, but not every
 * event has paperwork — a service done by a friend, a part fitted at home. This
 * captures one directly, with an optional supporting photo.
 */
export default function ManualEventSheet({ visible, onClose, onAdd }) {
  const [entry, setEntry] = useState(EMPTY);

  // Each opening starts a fresh event rather than resuming an abandoned one.
  useEffect(() => {
    if (visible) setEntry(EMPTY);
  }, [visible]);

  const set = (patch) => setEntry((prev) => ({ ...prev, ...patch }));
  const canAdd = entry.date.trim().length > 0 && entry.description.trim().length > 0;

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.body}>
        <Text style={styles.title}>Add an event</Text>

        <TextField label="Date" value={entry.date} onChangeText={(date) => set({ date })} />
        <TextField
          label="Event type"
          value={entry.category}
          onChangeText={(category) => set({ category })}
        />
        <TextField
          label="Description"
          value={entry.description}
          onChangeText={(description) => set({ description })}
        />

        {entry.image ? (
          <View style={styles.photoRow}>
            <Image source={entry.image} style={styles.photo} resizeMode="cover" />
            <Pressable
              onPress={() => set({ image: null })}
              accessibilityRole="button"
              accessibilityLabel="Remove event photo"
              hitSlop={8}
            >
              <Feather name="trash-2" size={16} color={color.icon.dangerBold} />
            </Pressable>
          </View>
        ) : (
          <View style={styles.sourceRow}>
            <Button
              label="Upload photo"
              variant="secondary"
              leading={<Feather name="image" size={18} color={color.text.neutralBold} />}
              onPress={() => set({ image: makePhotos(1)[0].image })}
              style={styles.sourceButton}
            />
            <Button
              label="Camera"
              variant="secondary"
              leading={<Feather name="camera" size={18} color={color.text.neutralBold} />}
              onPress={() => set({ image: makePhotos(1)[0].image })}
              style={styles.sourceButton}
            />
          </View>
        )}

        <Button
          label="Add event"
          onPress={canAdd ? () => onAdd({ ...entry, image: entry.image ?? undefined }) : undefined}
          style={!canAdd && styles.disabled}
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
    gap: spacing[3],
  },
  title: {
    ...font.bodyEmphasized,
    color: color.text.neutralBold,
  },
  sourceRow: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  sourceButton: {
    flex: 1,
  },
  photoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  photo: {
    width: 96,
    height: 72,
    borderRadius: radius.md,
  },
  disabled: {
    opacity: 0.5,
  },
});
