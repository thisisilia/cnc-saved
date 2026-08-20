import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './navigation/RootNavigator';
import './theme/loadBrandFont';
import { AddVehicleDraftProvider } from './state/addVehicleDraft';
import { AdvertDraftProvider } from './state/advertDraft';
import { GarageProvider } from './state/garage';
import { SavedListsProvider } from './state/savedLists';
import { VehicleEditsProvider } from './state/vehicleEdits';
import { color, layout } from './theme/tokens';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {/* On web the app would otherwise stretch to the browser width, so it is
          pinned to the comp's frame width and centred. A no-op on device. */}
      <View style={styles.root}>
        <View style={styles.frame}>
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
        maxWidth: layout.frameWidth,
        overflow: 'hidden',
      },
    }),
  },
});
