import { Image, StyleSheet, View } from 'react-native';
import { color, radius, spacing } from '../theme/tokens';
import DecorativeIcon from './saved/DecorativeIcon';
import EmptyPrompt from './saved/EmptyPrompt';
import SectionHeading from './SectionHeading';

/**
 * Half-width Saved card (Listings / Searches).
 *
 * empty    — icon + title + prompt
 * single   — heading + one thumbnail
 * multiple — heading + a 2×2 mosaic of thumbnails
 */
export default function GridCard({
  title,
  subtitle,
  images,
  onPress,
  emptyIcon,
  emptyText,
  variant = 'multiple',
}) {
  if (variant === 'empty') {
    return (
      <View style={styles.card}>
        <EmptyPrompt icon={<DecorativeIcon name={emptyIcon} />} title={title} subtitle={emptyText} />
      </View>
    );
  }

  if (variant === 'single') {
    return (
      <View style={styles.card}>
        <SectionHeading title={title} subtitle="1 saved" onPress={onPress} />
        <Image source={images[0]} style={styles.singleImage} resizeMode="cover" />
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <SectionHeading title={title} subtitle={subtitle} onPress={onPress} />
      <View style={styles.grid}>
        <View style={styles.gridRow}>
          <Image source={images[0]} style={styles.thumb} resizeMode="cover" />
          <Image source={images[1]} style={styles.thumb} resizeMode="cover" />
        </View>
        <View style={styles.gridRow}>
          <Image source={images[2]} style={styles.thumb} resizeMode="cover" />
          <Image source={images[3]} style={styles.thumb} resizeMode="cover" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: color.background.neutralSubtle,
    borderRadius: radius.lg,
    padding: spacing[4],
    gap: spacing[4],
  },
  grid: {
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  gridRow: {
    flexDirection: 'row',
  },
  thumb: {
    flex: 1,
    height: 45,
    backgroundColor: '#d9d9d9',
  },
  singleImage: {
    width: '100%',
    // Matches the seamless 2×2 mosaic height (two 45px rows) so the single and
    // multiple cards are exactly the same height.
    height: 90,
    borderRadius: radius.md,
    backgroundColor: '#d9d9d9',
  },
});
