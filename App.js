import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './navigation/RootNavigator';
import { UserLenzBridge } from './components/UserLenzBridge';
import './theme/loadBrandFont';
import { AddVehicleDraftProvider } from './state/addVehicleDraft';
import { AdvertDraftProvider } from './state/advertDraft';
import { GarageProvider } from './state/garage';
import { SavedListsProvider } from './state/savedLists';
import { VehicleEditsProvider } from './state/vehicleEdits';
import { color, layout } from './theme/tokens';

// The whole app is drawn from a Figma artboard of this width. Everything inside
// (layout, text, icons, sheets) is sized in fixed px against it, so scaling the
// frame as a whole is what makes text and icons responsive — see below.
const DESIGN_WIDTH = 393;

// Below this viewport width we treat the screen as a phone; above it, a desktop
// browser, where the frame is capped to a phone-width column and centred.
const DESKTOP_BREAKPOINT = 600;

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

// One CSS rule drives the responsive scale on web. Every screen and sheet lives
// inside #app-frame (sheets are in-frame overlays, never body portals), so
// `zoom` cascades to all of it — text and icons included — with no per-component
// work. Height is divided back out so the zoomed frame still fills the viewport.
const FRAME_SCALE_CSS =
  '#app-frame{zoom:var(--app-zoom,1);height:calc(100dvh / var(--app-zoom,1))!important;}';

export default function App() {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isDesktop = isWeb && width > DESKTOP_BREAKPOINT;

  // Rendered frame width: the device width on a phone (fills it), or the fixed
  // phone column on desktop. The frame itself is DESIGN_WIDTH px and `zoom`
  // scales it to this target, so text/icons/spacing all scale together.
  const targetWidth = isDesktop ? layout.frameWidth : width;
  const zoom = isWeb ? clamp(targetWidth / DESIGN_WIDTH, 0.8, 1.3) : 1;

  useEffect(() => {
    if (!isWeb || typeof document === 'undefined') return;
    let style = document.getElementById('app-frame-scale');
    if (!style) {
      style = document.createElement('style');
      style.id = 'app-frame-scale';
      style.textContent = FRAME_SCALE_CSS;
      document.head.appendChild(style);
    }
    document.documentElement.style.setProperty('--app-zoom', String(zoom));
  }, [isWeb, zoom]);

  return (
    <SafeAreaProvider>
      <UserLenzBridge />
      <StatusBar style="dark" />
      {/* On web the app is a fixed-width phone frame scaled with `zoom` (see
          FRAME_SCALE_CSS): it fills the viewport on a phone and is a centred
          column on desktop. A no-op on device. */}
      <View style={styles.root}>
        <View nativeID="app-frame" style={styles.frame}>
          <GarageProvider>
            <SavedListsProvider>
             <VehicleEditsProvider>
              <AddVehicleDraftProvider>
                <AdvertDraftProvider>
                  <RootNavigator />
                </AdvertDraftProvider>
              </AddVehicleDraftProvider>
             </VehicleEditsProvider>
            </SavedListsProvider>
          </GarageProvider>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    ...Platform.select({
      web: {
        alignItems: 'center',
        backgroundColor: color.background.pageBackdrop,
      },
    }),
  },
  frame: {
    backgroundColor: color.background.neutralWhite,
    ...Platform.select({
      web: {
        // Fixed design width; `zoom` (FRAME_SCALE_CSS) scales it to the viewport.
        // Height comes from the CSS rule so the zoomed frame fills the screen.
        width: DESIGN_WIDTH,
        overflow: 'hidden',
      },
      default: {
        flex: 1,
        width: '100%',
      },
    }),
  },
});
