/**
 * Design tokens mirrored from the Figma library "Car - Classic - Design".
 * Names follow the Figma variable paths so designs and code stay traceable.
 */

import { Platform } from 'react-native';

export const color = {
  text: {
    neutralBold: '#1e1f1e',
    neutralRegular: '#5d605d',
    successBold: '#4a9e49',
    brandPrimaryRegular: '#14955d',
    brandPrimaryBold: '#012413',
    neutralBoldDisabled: '#b5bbb5',
    dangerBold: '#b91c1c',
    inverseBold: '#f7f9f7',
  },
  icon: {
    // hsla(0, 72%, 51%, 1) — destructive actions.
    dangerBold: '#dc2828',
    // semantic/color/icon/neutral/bold/default — hsla(120, 2%, 12%, 1)
    neutralBold: '#1e1f1e',
    neutralRegular: '#5d605d',
    successBold: '#398138',
    inverseBold: '#f7f9f7',
    brandPrimaryRegular: '#14955d',
  },
  background: {
    neutralWhite: '#ffffff',
    neutralSubtle: '#f7f9f7',
    neutralRegular: '#eff1ef',
    brandPrimaryBold: '#05472a',
    brandPrimaryRegular: '#14955d',
    brandPrimarySubtle: '#ecfff4',
    neutralBold: '#b5bbb5',
    successBold: '#398138',
    neutralBoldFocus: '#3c3e3c',
    // Not from Figma: fills the gutter beside the phone frame on web only.
    pageBackdrop: '#e8ebe8',
  },
  border: {
    // hsla(0, 0%, 100%, 1) — the white surface of the plate and logo chips.
    // On a white page the separation comes from their shadow, not this edge.
    white: '#ffffff',
    neutralSubtle: '#eff1ef',
    neutralRegular: '#cbd1cb',
    neutralBold: '#5d605d',
    neutralBoldDisabled: '#dee3de',
    brandPrimaryRegular: '#14955d',
  },
  overlay: {
    inverseBold: 'rgba(255, 255, 255, 0.7)',
    neutralBold: 'rgba(51, 51, 51, 0.4)',
    // Not from Figma: the comp shows the sheet in isolation, with no scrim.
    scrim: 'rgba(0, 0, 0, 0.4)',
  },
};

/**
 * Frame width of the Figma artboard (iPhone 14/15 Pro). Used only to letterbox
 * the web build so it reads as a phone rather than stretching to the browser.
 */
export const layout = {
  frameWidth: 350,
  /**
   * Page header bottom padding, per the Figma headers. The header *top* padding
   * is STATUS_BAR_H (components/StatusBarMock) so headers clear the status bar —
   * imported directly by each header rather than duplicated here.
   */
  headerBottom: 24,
};

export const spacing = {
  none: 0,
  xxs: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
};

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 100,
};

export const borderWidth = {
  xs: 1,
  md: 2,
};

export const size = {
  6: 24,
  8: 32,
  10: 40,
};

/**
 * The design mixes SF Pro Display for iOS chrome (screen title, tab bar) with
 * Roboto Flex for body copy inside cards. Everything here omits fontFamily and
 * inherits the system font — SF Pro on iOS.
 *
 * Roboto Flex is deliberately not wired up: it ships variable-only, and iOS
 * ignores fontWeight once an explicit fontFamily is set, so every "emphasized"
 * style below would silently flatten to 400. Restoring it means committing true
 * static 400 and 600 cuts and setting fontFamily per weight, not per family.
 */
/**
 * SF Pro Display is the iOS system font, so ordinary Text inherits it without
 * naming it. SVG text does NOT inherit — react-native-svg falls back to the
 * SVG default (a serif) — so anything drawn in a chart must set this explicitly.
 */
export const fontFamily = {
  display: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: '-apple-system, system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  }),
  // Brand type. Proxima Nova is a licensed font; on web it is registered via
  // theme/loadBrandFont.web.js (@font-face). Until the font files are served it
  // falls back to the system stack automatically.
  brand: Platform.select({
    ios: 'Proxima Nova',
    android: 'Proxima Nova',
    default:
      '"ProximaNovaRegular", "Proxima Nova", -apple-system, system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  }),
  // Bold cut, registered as its own @font-face family (font-weight: normal), so
  // set fontWeight: 'normal' where it's used to avoid the browser faux-bolding it.
  brandBold: Platform.select({
    ios: 'Proxima Nova',
    android: 'Proxima Nova',
    default:
      '"ProximaNovaBold", "Proxima Nova", -apple-system, system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  }),
  // Semibold cut — same note: use fontWeight: 'normal' where applied.
  brandSemibold: Platform.select({
    ios: 'Proxima Nova',
    android: 'Proxima Nova',
    default:
      '"ProximaNovaSemibold", "Proxima Nova", -apple-system, system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  }),
  // Roboto Flex — onboarding titles. Loaded from Google Fonts on web
  // (theme/loadBrandFont.web.js); falls back to the system stack elsewhere.
  robotoFlex: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: '"Roboto Flex", -apple-system, system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  }),
};

export const font = {
  title1Emphasized: { fontSize: 28, lineHeight: 34, fontWeight: '600' },
  title2Emphasized: { fontSize: 22, lineHeight: 28, fontWeight: '600' },
  title3Emphasized: { fontSize: 20, lineHeight: 32, fontWeight: '600', letterSpacing: -0.6 },
  bodyRegular: { fontSize: 17, lineHeight: 24, fontWeight: '400', letterSpacing: 0.4 },
  bodyEmphasized: { fontSize: 17, lineHeight: 24, fontWeight: '600' },
  caption1Regular: { fontSize: 12, lineHeight: 16, fontWeight: '400' },
  caption1Emphasized: { fontSize: 12, lineHeight: 16, fontWeight: '600' },
  headlineEmphasized: { fontSize: 18, lineHeight: 24, fontWeight: '600' },
  calloutRegular: { fontSize: 16, lineHeight: 21, fontWeight: '400' },
  calloutEmphasized: { fontSize: 16, lineHeight: 21, fontWeight: '600' },
  subheadlineRegular: { fontSize: 15, lineHeight: 20, fontWeight: '400' },
  subheadlineEmphasized: { fontSize: 15, lineHeight: 20, fontWeight: '600' },
  caption2Regular: { fontSize: 11, lineHeight: 13, fontWeight: '400' },
  caption2Emphasized: { fontSize: 11, lineHeight: 13, fontWeight: '600' },
  labelSm: { fontSize: 10, lineHeight: 16, fontWeight: '600', letterSpacing: 0.6 },
  bodyLgEmphasized: { fontSize: 18, lineHeight: 27, fontWeight: '600' },
  bodyMdEmphasized: { fontSize: 16, lineHeight: 24, fontWeight: '600' },
  bodySmRegular: { fontSize: 14, lineHeight: 21, fontWeight: '400' },
  bodySmEmphasized: { fontSize: 14, lineHeight: 21, fontWeight: '600' },
  bodyXsRegular: { fontSize: 12, lineHeight: 18, fontWeight: '400' },
  bodyXsEmphasized: { fontSize: 12, lineHeight: 18, fontWeight: '600' },
};
