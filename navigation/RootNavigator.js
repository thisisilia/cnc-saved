import {
  NavigationContainer,
  getPathFromState as defaultGetPathFromState,
  getStateFromPath as defaultGetStateFromPath,
} from '@react-navigation/native';
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
import VideoDetailScreen from '../screens/VideoDetailScreen';
import PurchaseInformationScreen from '../screens/PurchaseInformationScreen';
import ReviewDetailsScreen from '../screens/ReviewDetailsScreen';
import SavedScreen from '../screens/SavedScreen';
import ViewMenuScreen from '../screens/ViewMenuScreen';
import VehicleDetailsScreen from '../screens/VehicleDetailsScreen';

const Stack = createNativeStackNavigator();

/**
 * URL routing for the web build: every screen gets its own path (e.g.
 * /my-garage, /vehicle/:id) so pages are linkable, bookmarkable and show in the
 * address bar. Extra params (section, title, single, …) ride along as query
 * strings automatically.
 */
// The add-vehicle / add-valuation flows are bottom sheets hosted on the Saved
// screen, so they aren't stack routes. We give their steps real paths
// (/add-vehicle/:step, /add-valuation/:step) by mapping them to the Saved
// screen with `addFlow`/`addStep` params, and delegate everything else to the
// default path↔state logic.
const FLOW_TO_PATH = { vehicle: 'add-vehicle', valuation: 'add-valuation' };
const PATH_TO_FLOW = { 'add-vehicle': 'vehicle', 'add-valuation': 'valuation' };

const linking = {
  prefixes:
    Platform.OS === 'web' && typeof window !== 'undefined' ? [window.location.origin] : ['cnc://'],
  getStateFromPath: (path, options) => {
    const segs = path.split('?')[0].replace(/^\/+|\/+$/g, '').split('/');
    const flow = PATH_TO_FLOW[segs[0]];
    if (flow) {
      return {
        routes: [{ name: 'Saved', params: { addFlow: flow, addStep: segs[1] || undefined } }],
      };
    }
    return defaultGetStateFromPath(path, options);
  },
  getPathFromState: (state, options) => {
    const route = state.routes?.[state.index ?? state.routes.length - 1];
    if (route?.name === 'Saved' && FLOW_TO_PATH[route.params?.addFlow]) {
      const base = `/${FLOW_TO_PATH[route.params.addFlow]}`;
      return route.params.addStep ? `${base}/${route.params.addStep}` : base;
    }
    return defaultGetPathFromState(state, options);
  },
  config: {
    screens: {
      ViewMenu: '',
      Saved: 'saved',
      MyGarage: 'my-garage',
      Performance: 'performance',
      PreviouslyOwned: 'previously-owned',
      VehicleDetails: 'vehicle/:id',
      EditVehicle: 'vehicle/:id/edit',
      EditDetails: 'vehicle/:id/edit-details',
      Listings: 'listings',
      Collection: 'collection/:id',
      Searches: 'searches',
      SearchCollection: 'search/:id',
      Valuations: 'valuations',
      ValuationDetail: 'valuation/:id',
      ValuationEstimate: 'valuation-estimate',
      AddVehicle: 'add-vehicle',
      PurchaseInformation: 'purchase-information',
      History: 'history',
      PhotosVideo: 'photos-video',
      Photographs: 'photographs',
      WalkaroundVideo: 'walkaround-video',
      VideoDetail: 'video/:id',
      ReviewDetails: 'review-details',
      CreateAdvert: 'create-advert',
      Description: 'description',
      Price: 'price',
      ReviewAdvert: 'review-advert',
      AdvertPackage: 'advert-package',
      AdvertSuccess: 'advert-success',
    },
  },
};

const documentTitle = {
  formatter: (options, route) => {
    const name = options?.title ?? route?.name;
    if (!name || name === 'Saved') return 'CNC — Saved';
    // "MyGarage" → "My Garage", "VehicleDetails" → "Vehicle Details".
    const pretty = name.replace(/([a-z])([A-Z])/g, '$1 $2');
    return `${pretty} · CNC`;
  },
};

/**
 * Screens draw their own headers, so the stack's native header stays off.
 * `slide_from_right` gives the iOS-style horizontal push — screens slide in from
 * the right and slide back out on pop. (react-native-web does not animate stack
 * transitions, so on the web build this is effectively instant; it slides on
 * native iOS/Android.)
 */
export default function RootNavigator() {
  return (
    <NavigationContainer linking={linking} documentTitle={documentTitle}>
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
        <Stack.Screen name="ViewMenu" component={ViewMenuScreen} />
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
        <Stack.Screen name="VideoDetail" component={VideoDetailScreen} />
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
