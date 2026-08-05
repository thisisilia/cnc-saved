import { Image, StyleSheet, View } from 'react-native';
import { vehicleLogo } from '../logos/vehicleLogos';
import { borderWidth, color, radius, spacing } from '../../theme/tokens';
import AppIcon from '../icons/AppIcon';

/**
 * Manufacturer badge, resolved from the make name.
 *
 * The Figma logo set exports bitmaps inside an SVG <pattern>, so these are
 * Images rather than tintable glyphs. Makes outside the set fall back to a
 * generic mark instead of a broken image.
 */
/**
 * Makes whose logo is a vector wordmark rather than a bitmap badge. They are
 * far wider than tall, so they scale to the slot's width — sizing by height
 * would push them well outside it.
 */
const VECTOR_LOGOS = {
  McLaren: { glyph: 'mclaren_automotive_logo', aspect: 176.57 / 27.58 },
};

export default function MakeLogo({ make, logo, category, size = 24, chip = false }) {
  const source = logo ?? (make ? vehicleLogo(make, category) : null);
  const vector = !source && make ? VECTOR_LOGOS[make] : null;

  if (vector) {
    const mark = (
      <View style={[styles.vector, { width: size, height: size }]}>
        <AppIcon name={vector.glyph} size={size / vector.aspect} color={color.icon.neutralBold} />
      </View>
    );
    if (!chip) return mark;
    return <View style={[styles.chip, { borderRadius: (size + spacing[2] * 2) / 2 }]}>{mark}</View>;
  }

  if (!source) {
    return (
      <View style={[styles.fallback, { width: size, height: size }]}>
        <AppIcon name="classic-cars" size={size * 0.7} color={color.icon.neutralRegular} />
      </View>
    );
  }

  const image = <Image source={source} style={{ width: size, height: size }} resizeMode="contain" />;

  // `chip` seats the badge on the comp's white disc — needed wherever the logo
  // sits against artwork or a tinted surface rather than the page itself.
  if (!chip) return image;

  return <View style={[styles.chip, { borderRadius: (size + spacing[2] * 2) / 2 }]}>{image}</View>;
}

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[2],
    backgroundColor: color.background.neutralWhite,
    borderWidth: borderWidth.xs,
    borderColor: color.border.white,
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  vector: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
    backgroundColor: color.background.neutralRegular,
  },
});
