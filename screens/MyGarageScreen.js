import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import AddVehicleFlow from '../components/addVehicle/AddVehicleFlow';
import AppIcon from '../components/icons/AppIcon';
import NavHeader from '../components/NavHeader';
import NotificationSheet from '../components/NotificationSheet';
import PortfolioCard from '../components/PortfolioCard';
import PreviouslyOwnedSheet from '../components/PreviouslyOwnedSheet';
import ShareSheet from '../components/vehicle/ShareSheet';
import SortButton from '../components/SortButton';
import SortSheet from '../components/SortSheet';
import VehicleListCard from '../components/VehicleListCard';
import { garageTotals, sortVehicles } from '../data/garage';
import { portfolio, reminders, summaryReminders } from '../data/garage';
import { color, font, radius, spacing } from '../theme/tokens';
import { useAddVehicleDraft } from '../state/addVehicleDraft';
import { buildVehicleCard } from '../data/addedVehicle';
import { useGarage } from '../state/garage';

export default function MyGarageScreen({ navigation, route }) {
  const [sheet, setSheet] = useState(null);
  const { startDraft, reset } = useAddVehicleDraft();
  const { vehicles: allVehicles, addVehicle } = useGarage();
  // The single-state Saved card opens this page scoped to one vehicle — so the
  // reminders and notifications below relate only to that car, not the garage.
  const single = route.params?.single;
  const baseVehicles = single
    ? [allVehicles.find((v) => v.id === 'mini') ?? allVehicles[0]]
    : allVehicles;
  const [sortBy, setSortBy] = useState('profit');
  const vehicles = useMemo(() => sortVehicles(baseVehicles, sortBy), [baseVehicles, sortBy]);
  const singleId = vehicles[0]?.id;
  const shownReminders = single ? reminders.filter((r) => r.vehicleId === singleId) : reminders;
  const summaryLines = single ? shownReminders.map((r) => r.summary) : summaryReminders;
  // The count follows the garage, so adding or removing a vehicle is reflected
  // rather than reporting the seed list's length forever.
  const totals = garageTotals(vehicles);
  const livePortfolio = {
    ...portfolio,
    count: `${vehicles.length} lists`,
    totalValue: totals.valueLabel,
    // Single view is scoped to one car, so Overall performance mirrors that
    // vehicle's own gain rather than the portfolio-wide computed return.
    delta: single ? vehicles[0]?.delta ?? totals.gainLabel : totals.gainLabel,
    deltaValue: totals.profitLabel,
  };
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
        {/* #5: the notification summary ("Insurance renewal…") card is hidden for now. */}

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>My vehicles</Text>
          <SortButton onPress={() => setSheet('sort')} />
        </View>

        <View style={styles.list}>
          {vehicles.map((vehicle) => (
            <VehicleListCard
              key={vehicle.id}
              vehicle={vehicle}
              onPress={() => navigation.navigate('VehicleDetails', { id: vehicle.id })}
            />
          ))}
        </View>

        {!single && (
          <Pressable
            style={({ pressed }) => [styles.prevOwned, pressed && styles.prevOwnedPressed]}
            onPress={() => setSheet('previous')}
            accessibilityRole="button"
            accessibilityLabel="Show previously owned car"
          >
            <AppIcon name="clock-rotate-left" size={18} color={color.text.neutralBold} />
            <Text style={styles.prevOwnedLabel}>Show previously owned car</Text>
          </Pressable>
        )}
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
      <PreviouslyOwnedSheet visible={sheet === 'previous'} onClose={close} />
      <SortSheet visible={sheet === 'sort'} value={sortBy} onSelect={setSortBy} onClose={close} />
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
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listTitle: {
    ...font.title3Emphasized,
    color: color.text.neutralBold,
  },
  list: {
    gap: spacing[6],
  },
  prevOwned: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    minHeight: 48,
    borderRadius: radius.md,
    backgroundColor: color.background.neutralSubtle,
  },
  prevOwnedPressed: {
    opacity: 0.7,
  },
  prevOwnedLabel: {
    ...font.bodySmEmphasized,
    color: color.text.neutralBold,
  },
});
