import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import AddVehicleFlow from '../components/addVehicle/AddVehicleFlow';
import NavHeader from '../components/NavHeader';
import NotificationSheet from '../components/NotificationSheet';
import PortfolioCard from '../components/PortfolioCard';
import ShareSheet from '../components/vehicle/ShareSheet';
import ReminderSummaryCard from '../components/ReminderSummaryCard';
import VehicleGrid from '../components/VehicleGrid';
import { portfolio, reminders, summaryReminders } from '../data/garage';
import { useAddVehicleDraft } from '../state/addVehicleDraft';
import { buildVehicleCard } from '../data/addedVehicle';
import { useGarage } from '../state/garage';
import { color, spacing } from '../theme/tokens';

export default function MyGarageScreen({ navigation, route }) {
  const [sheet, setSheet] = useState(null);
  const { startDraft, reset } = useAddVehicleDraft();
  const { vehicles: allVehicles, addVehicle } = useGarage();
  // The single-state Saved card opens this page scoped to one vehicle — so the
  // reminders and notifications below relate only to that car, not the garage.
  const single = route.params?.single;
  const vehicles = single ? allVehicles.slice(0, 1) : allVehicles;
  const singleId = vehicles[0]?.id;
  const shownReminders = single ? reminders.filter((r) => r.vehicleId === singleId) : reminders;
  const summaryLines = single ? shownReminders.map((r) => r.summary) : summaryReminders;
  // The count follows the garage, so adding or removing a vehicle is reflected
  // rather than reporting the seed list's length forever.
  const livePortfolio = { ...portfolio, count: `${vehicles.length} lists` };
  const close = () => setSheet(null);

  return (
    <View style={styles.screen}>
      <NavHeader
        title="My Garage"
        onBack={() => navigation.goBack()}
        actions={[
          {
            key: 'share',
            icon: 'share-2',
            label: 'Share garage',
            onPress: () => setSheet('share'),
          },
          {
            key: 'history',
            glyph: 'clock-rotate-left',
            label: 'Previously owned cars',
            onPress: () => navigation.navigate('PreviouslyOwned', single ? { single: true } : undefined),
          },
          {
            key: 'add',
            icon: 'plus',
            label: 'Add vehicle',
            tone: 'brand',
            // Straight into the flow: on this page the destination is already
            // My Garage, so the three-way chooser has nothing to choose.
            onPress: () => setSheet('add'),
          },
        ]}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <PortfolioCard
          portfolio={livePortfolio}
          onPress={() => navigation.navigate('Performance', { portfolio: livePortfolio })}
        />
        {summaryLines.length > 0 && (
          <ReminderSummaryCard lines={summaryLines} onSeeAll={() => setSheet('notifications')} />
        )}
        <VehicleGrid
          vehicles={vehicles}
          onSelect={(vehicle) => navigation.navigate('VehicleDetails', { id: vehicle.id })}
        />
      </ScrollView>

      <AddVehicleFlow
        visible={sheet === 'add'}
        onClose={(partial) => {
          close();
          // Dropped off partway: keep the progress so it can be resumed from Saved.
          if (partial) startDraft(partial);
        }}
        onComplete={(draft) => {
          close();
          reset();
          // Open the car's detail page; the welcome prompt shows over it there.
          const card = buildVehicleCard(draft);
          addVehicle(card);
          navigation.navigate('VehicleDetails', { id: card.id, welcome: true });
        }}
      />

      <ShareSheet
        visible={sheet === 'share'}
        onClose={close}
        images={vehicles.map((v) => v.image)}
        name="My garage"
      />
      <NotificationSheet visible={sheet === 'notifications'} onClose={close} reminders={shownReminders} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.background.neutralWhite,
  },
  content: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[8],
    gap: spacing[4],
  },
});
