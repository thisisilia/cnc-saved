import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { color, font, spacing } from '../theme/tokens';
import TrendDelta from './TrendDelta';

/**
 * Vehicle card used by the My Garage and Previously Owned grids. Owned vehicles
 * show a value movement; sold ones show the sale price and date instead.
 */
export default function VehicleTile({ vehicle, sold = false, onPress, style }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.tile, style, pressed && !sold && styles.pressed]}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={vehicle.name}
    >
      <View style={styles.imageFrame}>
        <Image source={vehicle.image} style={styles.image} resizeMode="cover" />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{vehicle.name}</Text>
        <View style={styles.row}>
          <Text style={styles.price}>{sold ? vehicle.soldPrice : vehicle.price}</Text>
          {sold ? (
            <Text style={styles.muted}>Sold</Text>
          ) : (
            <TrendDelta value={vehicle.delta} />
          )}
        </View>
        {sold && <Text style={styles.muted}>Sold on {vehicle.soldOn}</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
  },
  pressed: {
    opacity: 0.7,
  },
  imageFrame: {
    height: 123,
    borderRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    paddingTop: spacing[1],
    paddingHorizontal: spacing[1],
    gap: spacing[1],
  },
  title: {
    ...font.bodyXsEmphasized,
    color: color.text.neutralBold,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  price: {
    ...font.bodyXsEmphasized,
    color: color.text.neutralBold,
  },
  muted: {
    ...font.bodyXsRegular,
    color: color.text.neutralRegular,
  },
});
