import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheet from './BottomSheet';
import Button from './vehicle/Button';
import { color, font, radius, spacing } from '../theme/tokens';

/**
 * "Edit cover image" sheet (Figma 1482-12907): the photos in a 2-column grid
 * with a selection ring on the chosen cover. The pick is pending — it only
 * takes effect once "Save changes" is tapped.
 */
export default function CoverImageSheet({ visible, items = [], coverId, onSave, onClose }) {
  const insets = useSafeAreaInsets();
  const [pending, setPending] = useState(coverId);
  // Reset the pending pick to the current cover each time the sheet opens.
  useEffect(() => {
    if (visible) setPending(coverId);
  }, [visible, coverId]);

  return (
    <BottomSheet visible={visible} onClose={onClose} topInset={40} fill>
      <View style={styles.sheet}>
        <View style={styles.header}>
          <Text style={styles.title}>Edit cover image</Text>
          <Pressable onPress={onClose} hitSlop={8} accessibilityRole="button" accessibilityLabel="Cancel">
            <Text style={styles.cancel}>Cancel</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
          {items.map((item) => {
            const selected = item.id === pending;
            return (
              <Pressable
                key={item.id}
                style={[styles.cell, selected && styles.cellSelected]}
                onPress={() => setPending(item.id)}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={selected ? 'Selected cover image' : 'Set as cover image'}
              >
                <Image source={item.image} style={styles.image} resizeMode="cover" />
                <View style={[styles.check, selected && styles.checkOn]}>
                  {selected ? <Feather name="check" size={14} color={color.text.inverseBold} /> : null}
                </View>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: insets.bottom || spacing[4] }]}>
          <Button label="Save changes" onPress={() => onSave(pending)} />
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    alignSelf: 'stretch',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[2],
    paddingBottom: spacing[3],
  },
  title: {
    ...font.bodyEmphasized,
    color: color.text.neutralBold,
  },
  cancel: {
    ...font.bodyRegular,
    color: color.text.neutralRegular,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing[3],
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
  },
  cell: {
    width: '48%',
    aspectRatio: 172.5 / 120,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: color.background.neutralRegular,
  },
  cellSelected: {
    borderWidth: 2,
    borderColor: color.background.brandPrimaryRegular,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  check: {
    position: 'absolute',
    top: spacing[2],
    right: spacing[2],
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  checkOn: {
    backgroundColor: color.background.brandPrimaryRegular,
    borderColor: color.background.brandPrimaryRegular,
  },
  footer: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
  },
});
