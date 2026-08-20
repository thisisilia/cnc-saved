import { StatusBar } from 'expo-status-bar';
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

// Below this viewport width we treat the screen as a phone and let the frame
// fill it edge-to-edge (any phone, portrait). Above it — a desktop browser — the
// frame is capped to a phone-width column and centred, so the app still reads as
// a phone rather than stretching across the page.
const DESKTOP_BREAKPOINT = 600;

export default function App() {
  const { width } = useWindowDimensions();
  // On phone-sized viewports fill the device width (responsive to every phone);
  // on desktop keep the fixed, centred phone frame. No-op on native (always fills).
  const frameMaxWidth =
    Platform.OS === 'web' && width > DESKTOP_BREAKPOINT ? layout.frameWidth : '100%';

  return (
    <SafeAreaProvider>
      <UserLenzBridge />
      <StatusBar style="dark" />
      {/* On web the app would otherwise stretch to the browser width, so on
          desktop it is pinned to the frame width and centred; on a phone it
          fills the viewport. A no-op on device. */}
      <View style={styles.root}>
        <View style={[styles.frame, { maxWidth: frameMaxWidth }]}>
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
    flex: 1,
    width: '100%',
    backgroundColor: color.background.neutralWhite,
    ...Platform.select({
      web: {
        // maxWidth is applied inline (responsive: capped on desktop, full-width on phones).
        overflow: 'hidden',
      },
    }),
  },
});
