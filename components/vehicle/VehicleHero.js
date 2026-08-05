import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { color, font, radius, spacing } from '../../theme/tokens';

export const HERO_HEIGHT = 295;

/**
 * Vehicle photo carousel with the title/summary overlaid at the bottom.
 *
 * When the vehicle has no photos yet (just added), the carousel becomes an
 * add-photos placeholder and the title/summary drop below it in dark text.
 *
 * The back/edit controls are deliberately not here — they are pinned page
 * chrome on the screen, so they stay reachable once the hero scrolls away.
 */
export default function VehicleHero({ vehicle, width, onAddPhotos }) {
  const [index, setIndex] = useState(0);
  const photos = vehicle.photos ?? [];

  if (photos.length === 0) {
    // No photos yet: the placeholder fills the whole hero with the title/summary
    // over it. Tapping the add-photos mark starts the photo flow.
    return (
      <View style={[styles.emptyHero, { width, height: HERO_HEIGHT }]}>
        <View style={styles.placeholderCenter}>
          <Pressable
            style={({ pressed }) => [styles.addPhotoButton, pressed && styles.startPressed]}
            onPress={onAddPhotos}
            accessibilityRole="button"
            accessibilityLabel="Add vehicle photo"
          >
            <Feather name="image" size={16} color={color.icon.brandPrimaryRegular} />
            <Text style={styles.addPhotoLabel}>Add vehicle photo</Text>
          </Pressable>
        </View>
        <View style={styles.emptyDetails}>
          <Text style={styles.emptyTitle} numberOfLines={1}>
            {vehicle.title}
          </Text>
          <Text style={styles.emptySummary}>{vehicle.summary}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.hero, { width }]}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) =>
          setIndex(Math.round(e.nativeEvent.contentOffset.x / Math.max(width, 1)))
        }
      >
        {photos.map((photo, i) => (
          <Image key={i} source={photo} style={{ width, height: HERO_HEIGHT }} resizeMode="cover" />
        ))}
      </ScrollView>

      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
        style={styles.details}
        pointerEvents="none"
      >
        <Text style={styles.title} numberOfLines={1}>
          {vehicle.title}
        </Text>
        <Text style={styles.summary}>{vehicle.summary}</Text>
      </LinearGradient>

      {photos.length > 1 && (
        <View style={styles.dots} pointerEvents="none">
          {photos.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    height: HERO_HEIGHT,
    backgroundColor: color.text.neutralBold,
  },
  emptyHero: {
    // A single uniform dark placeholder — the prompt/button centre in it and the
    // title/summary sit at the bottom (no separate grey band).
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1c1c1e',
  },
  // Nudged up so it reads as centred in the space above the overlaid title.
  placeholderCenter: {
    marginBottom: 56,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
  },
  placeholderPrompt: {
    ...font.bodyEmphasized,
    color: color.text.inverseBold,
    textAlign: 'center',
  },
  addPhotoButton: {
    flexDirection: 'row',
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[2],
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: color.border.brandPrimaryRegular,
    backgroundColor: color.background.neutralWhite,
  },
  startPressed: {
    opacity: 0.8,
  },
  addPhotoLabel: {
    ...font.bodySmEmphasized,
    color: color.text.neutralBold,
  },
  emptyDetails: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    paddingBottom: spacing[4],
    gap: spacing[1],
  },
  emptyTitle: {
    ...font.title3Emphasized,
    letterSpacing: 0,
    lineHeight: 25,
    color: color.text.inverseBold,
  },
  emptySummary: {
    ...font.bodyXsRegular,
    color: 'rgba(255,255,255,0.7)',
  },
  details: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 79,
    justifyContent: 'center',
    padding: spacing[4],
    gap: spacing[1],
  },
  title: {
    ...font.title3Emphasized,
    letterSpacing: 0,
    lineHeight: 25,
    color: color.text.inverseBold,
  },
  summary: {
    ...font.bodyXsRegular,
    color: color.text.inverseBold,
  },
  dots: {
    position: 'absolute',
    bottom: 87,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: spacing[1],
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  dotActive: {
    backgroundColor: '#ffffff',
  },
});
