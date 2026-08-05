import Svg, { Path } from 'react-native-svg';
import { color as tokens } from '../../theme/tokens';
import { GLYPHS } from './glyphs';

/**
 * Renders a FontAwesome Pro Regular glyph exported from the Figma library.
 *
 * The bundled @expo/vector-icons FontAwesome sets only ship the Solid style for
 * these names, which reads far heavier than the comps — so the artwork comes
 * from Icons/**\/*.svg instead. See scripts/build-icons.js.
 *
 * `size` sets the height; width follows the glyph's own aspect ratio, so square
 * icons stay square and wide artwork (the insurance lockup) is not squashed.
 */
export default function AppIcon({ name, size = 24, color = tokens.icon.brandPrimaryRegular, style }) {
  const glyph = GLYPHS[name];

  if (!glyph) {
    if (__DEV__) console.warn(`AppIcon: no glyph named "${name}"`);
    return null;
  }

  const [, , vbWidth, vbHeight] = glyph.viewBox.split(/\s+/).map(Number);
  const width = vbHeight ? size * (vbWidth / vbHeight) : size;

  return (
    <Svg width={width} height={size} viewBox={glyph.viewBox} style={style}>
      {glyph.paths.map((entry, i) => (
        // `rule` is only present for evenodd line-art; the default is nonzero.
        <Path
          key={i}
          d={entry.d}
          fill={color}
          fillRule={entry.rule}
          clipRule={entry.rule}
        />
      ))}
    </Svg>
  );
}
