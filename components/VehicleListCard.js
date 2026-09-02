import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { color, font, radius, spacing } from '../theme/tokens';
import GainBadge from './GainBadge';

/**
 * Full-width vehicle card for the My Garage list (Figma 1322-24970): a swipeable
 * image carousel (dots show there's more than one photo), the name, then
 * price · gain badge · profit · purchase date.
 */
export default function VehicleListCard({ vehicle, onPress }) {
  const allImages = vehicle.images?.length ? vehicle.images : [vehicle.image];
  // Show at most 5 photos so each has its own dot (indicator is 1:1 with slides).
  const images = allImages.slice(0, 5);
  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(0);

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={vehicle.name}
    >
      <View style={styles.imageFrame} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
        {width > 0 ? (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={StyleSheet.absoluteFill}
            scrollEventThrottle={16}
            onScroll={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
            onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
          >
            {images.map((img, i) => (
              <Image key={i} source={img} style={{ width, height: '100%' }} resizeMode="cover" />
            ))}
          </ScrollView>
        ) : null}

        {vehicle.notice ? (
          <View style={styles.notice} pointerEvents="none">
            <Feather name="bell" size={13} color={color.text.inverseBold} />
            <Text style={styles.noticeLabel}>{vehicle.notice}</Text>
          </View>
        ) : null}

        {images.length > 1 ? (
          <View style={styles.dots} pointerEvents="none">
            {images.map((_, i) => (
              <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
            ))}
          </View>
        ) : null}
      </View>

      <Text style={styles.title}>{vehicle.name}</Text>
      <View style={styles.row}>
        <Text style={styles.price}>{vehicle.price}</Text>
        <GainBadge value={vehicle.delta} profit={vehicle.profit} />
        {vehicle.purchased ? <Text style={styles.purchased}>{vehicle.purchased}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing[2],
  },
  pressed: {
    opacity: 0.85,
  },
  imageFrame: {
    width: '100%',
    aspectRatio: 361 / 220,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: color.background.neutralRegular,
  },
  notice: {
    position: 'absolute',
    top: spacing[3],
    left: spacing[3],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1.5],
    paddingHorizontal: spacing[2.5],
    paddingVertical: spacing[1.5],
    borderRadius: radius.xl,
    backgroundColor: 'rgba(51, 51, 51, 0.40)',
    backdropFilter: 'blur(1px)',
  },
  noticeLabel: {
    ...font.bodyXsEmphasized,
    color: color.text.inverseBold,
  },
  dots: {
    position: 'absolute',
    bottom: spacing[3],
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
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
  title: {
    ...font.headlineEmphasized,
    color: color.text.neutralBold,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing[1],
  },
  price: {
    ...font.headlineEmphasized,
    color: color.text.neutralBold,
  },
  purchased: {
    fontFamily: '"SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
    color: color.text.neutralRegular,
  },
});
