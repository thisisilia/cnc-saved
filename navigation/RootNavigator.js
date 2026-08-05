import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';
import SlideScreen from './SlideScreen';
import AddVehicleScreen from '../screens/AddVehicleScreen';
import AdvertPackageScreen from '../screens/AdvertPackageScreen';
import AdvertSuccessScreen from '../screens/AdvertSuccessScreen';
import CollectionScreen from '../screens/CollectionScreen';
import CreateAdvertScreen from '../screens/CreateAdvertScreen';
import DescriptionScreen from '../screens/DescriptionScreen';
import PriceScreen from '../screens/PriceScreen';
import ReviewAdvertScreen from '../screens/ReviewAdvertScreen';
import EditDetailsScreen from '../screens/EditDetailsScreen';
import EditVehicleScreen from '../screens/EditVehicleScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ListingsScreen from '../screens/ListingsScreen';
import MyGarageScreen from '../screens/MyGarageScreen';
import PerformanceScreen from '../screens/PerformanceScreen';
import PhotographsScreen from '../screens/PhotographsScreen';
import PhotosVideoScreen from '../screens/PhotosVideoScreen';
import SearchCollectionScreen from '../screens/SearchCollectionScreen';
import SearchesScreen from '../screens/SearchesScreen';
import ValuationDetailScreen from '../screens/ValuationDetailScreen';
import ValuationEstimateScreen from '../screens/ValuationEstimateScreen';
import ValuationsScreen from '../screens/ValuationsScreen';
import PreviouslyOwnedScreen from '../screens/PreviouslyOwnedScreen';
import WalkaroundVideoScreen from '../screens/WalkaroundVideoScreen';
import PurchaseInformationScreen from '../screens/PurchaseInformationScreen';
import ReviewDetailsScreen from '../screens/ReviewDetailsScreen';
import SavedScreen from '../screens/SavedScreen';
import VehicleDetailsScreen from '../screens/VehicleDetailsScreen';

const Stack = createNativeStackNavigator();

/**
 * Screens draw their own headers, so the stack's native header stays off.
 * `slide_from_right` gives the iOS-style horizontal push — screens slide in from
 * the right and slide back out on pop. (react-native-web does not animate stack
 * transitions, so on the web build this is effectively instant; it slides on
 * native iOS/Android.)
 */
export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenLayout={({ children }) => <SlideScreen>{children}</SlideScreen>}
        screenOptions={{
          headerShown: false,
          // Native slides itself; on web the SlideScreen wrapper drives the slide,
          // so the native-stack transition is disabled there.
          animation: Platform.select({ web: 'none', default: 'slide_from_right' }),
          // Keep the previous screen mounted so the back slide reveals it.
          detachPreviousScreen: false,
        }}
      >
        <Stack.Screen name="Saved" component={SavedScreen} />
        <Stack.Screen name="MyGarage" component={MyGarageScreen} />
        <Stack.Screen name="Performance" component={PerformanceScreen} />
        <Stack.Screen name="PreviouslyOwned" component={PreviouslyOwnedScreen} />
        <Stack.Screen name="VehicleDetails" component={VehicleDetailsScreen} />
        <Stack.Screen name="EditVehicle" component={EditVehicleScreen} />
        <Stack.Screen name="EditDetails" component={EditDetailsScreen} />
        <Stack.Screen name="Listings" component={ListingsScreen} />
        <Stack.Screen name="Collection" component={CollectionScreen} />
        <Stack.Screen name="Searches" component={SearchesScreen} />
        <Stack.Screen name="SearchCollection" component={SearchCollectionScreen} />
        <Stack.Screen name="Valuations" component={ValuationsScreen} />
        <Stack.Screen name="ValuationDetail" component={ValuationDetailScreen} />
        <Stack.Screen name="ValuationEstimate" component={ValuationEstimateScreen} />
        <Stack.Screen name="AddVehicle" component={AddVehicleScreen} />
        <Stack.Screen name="PurchaseInformation" component={PurchaseInformationScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="PhotosVideo" component={PhotosVideoScreen} />
        <Stack.Screen name="Photographs" component={PhotographsScreen} />
        <Stack.Screen name="WalkaroundVideo" component={WalkaroundVideoScreen} />
        <Stack.Screen name="ReviewDetails" component={ReviewDetailsScreen} />
        <Stack.Screen name="CreateAdvert" component={CreateAdvertScreen} />
        <Stack.Screen name="Description" component={DescriptionScreen} />
        <Stack.Screen name="Price" component={PriceScreen} />
        <Stack.Screen name="ReviewAdvert" component={ReviewAdvertScreen} />
        <Stack.Screen name="AdvertPackage" component={AdvertPackageScreen} />
        <Stack.Screen name="AdvertSuccess" component={AdvertSuccessScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
