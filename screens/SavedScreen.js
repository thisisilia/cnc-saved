import { Feather } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AddVehicleSheet from '../components/AddVehicleSheet';
import AddValuationFlow from '../components/addVehicle/AddValuationFlow';
import AddVehicleFlow from '../components/addVehicle/AddVehicleFlow';
import GarageCard from '../components/GarageCard';
import GridCard from '../components/GridCard';
import Coachmark from '../components/onboarding/Coachmark';
import OnboardingSheet from '../components/onboarding/OnboardingSheet';
import ResumeSetupStrip from '../components/ResumeSetupStrip';
import SavedEmptyState from '../components/SavedEmptyState';
import TabBar, { TAB_BAR_HEIGHT } from '../components/TabBar';
import { STATUS_BAR_H } from '../components/StatusBarMock';
import { HOME_INDICATOR_H } from '../components/HomeIndicator';
import ValuationsCard from '../components/ValuationsCard';
import { garage, listings, searches, valuations } from '../data/saved';
import { sortVehicles } from '../data/garage';
import { NOT_OWNED, valuationEntries } from '../data/valuations';
import { buildVehicleCard, draftFromValuation } from '../data/addedVehicle';
import { useAddVehicleDraft } from '../state/addVehicleDraft';
import { useGarage } from '../state/garage';
import { color, font, layout, radius, size, spacing } from '../theme/tokens';

export default function SavedScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  // On web, reserve the fake home-indicator band so the bar floats above it; on
  // device the safe-area inset already covers it.
  const bottomInset = insets.bottom + (Platform.OS === 'web' ? HOME_INDICATOR_H : 0);
  // Which of the three prototype states to show — chosen on the ViewMenu screen
  // and passed in as a route param (deep-linkable via /saved?view=…).
  const viewState = route.params?.view ?? 'multiple';
  // Empty-view condition: once the user adds a car/valuation, that card fills in
  // (renders like the single state) while the others stay empty.
  const [enteredGarage, setEnteredGarage] = useState(false);
  const [enteredValuation, setEnteredValuation] = useState(false);
  const [addSheetOpen, setAddSheetOpen] = useState(false);
  const [addVehicleOpen, setAddVehicleOpen] = useState(false);
  const [addValuationOpen, setAddValuationOpen] = useState(false);
  const { startDraft, draft, reset } = useAddVehicleDraft();
  // Whether the add-vehicle sheet was opened to resume a dropped-off draft.
  const [resuming, setResuming] = useState(false);
  // First-run onboarding carousel + coachmark — shown on the empty garage view.
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [coachmarkOpen, setCoachmarkOpen] = useState(false);
  // The empty view is now its own "Nothing saved yet!" screen (Figma 1529-13301),
  // so the onboarding carousel/coachmark no longer auto-opens over it.
  const { vehicles, addVehicle } = useGarage();

  // Where a finished valuation lands depends on the ownership answer: a car the
  // user owns joins the garage and opens its detail page to finish (like the
  // add-vehicle flow); one they don't own goes straight to its valuation detail,
  // skipping the estimate preview.
  // Reflect the add-vehicle / add-valuation flow (and its live step) in the URL,
  // so /add-vehicle/:step and /add-valuation/:step are real, shareable paths.
  // Stable so the flows' onStepChange effect only fires on real step changes
  // (an inline handler would re-fire every render and thrash setParams).
  const setFlowUrl = useCallback(
    (flow, step) =>
      navigation.setParams({ addFlow: flow ?? undefined, addStep: step ?? undefined }),
    [navigation]
  );
  const onVehicleStep = useCallback((step) => setFlowUrl('vehicle', step), [setFlowUrl]);
  const onValuationStep = useCallback((step) => setFlowUrl('valuation', step), [setFlowUrl]);

  const completeValuation = (result) => {
    setAddValuationOpen(false);
    setFlowUrl();
    if (result.ownership === NOT_OWNED) {
      setEnteredValuation(true);
      navigation.navigate('ValuationDetail', { title: result.vehicle?.title, result });
      return;
    }
    setEnteredGarage(true);
    const card = buildVehicleCard(draftFromValuation(result));
    addVehicle(card);
    navigation.navigate('VehicleDetails', { id: card.id });
  };

  const garageVariant = viewState === 'empty' && enteredGarage ? 'single' : viewState;
  const valuationVariant = viewState === 'empty' && enteredValuation ? 'single' : viewState;

  // A dropped-off add-vehicle draft is offered back to the user. Progress is how
  // far through the sheet they got: vehicle chosen, mileage entered, condition set.
  const resumePercent = draft
    ? Math.round(
        (((draft.title ? 1 : 0) + (draft.mileage ? 1 : 0) + (draft.conditionId ? 1 : 0)) / 3) * 100
      )
    : 0;

  const openAddVehicle = (fromResume) => {
    setResuming(fromResume);
    setAddVehicleOpen(true);
    setFlowUrl('vehicle', 'registration');
  };
  const openAddValuation = () => {
    setAddValuationOpen(true);
    setFlowUrl('valuation', 'registration');
  };

  // Deep link: landing on /add-vehicle/… or /add-valuation/… opens that flow.
  const addFlowParam = route.params?.addFlow;
  useEffect(() => {
    if (addFlowParam === 'vehicle' && !addVehicleOpen) openAddVehicle(false);
    else if (addFlowParam === 'valuation' && !addValuationOpen) openAddValuation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addFlowParam]);

  // The Saved page keeps the chooser — a vehicle, a valuation or a search.
  // Garage and valuation have flows; search is still to build.
  const handleSelectOption = (key) => {
    setAddSheetOpen(false);
    if (key === 'garage') openAddVehicle(false);
    else if (key === 'valuation') openAddValuation();
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, STATUS_BAR_H) }]}>
        <View style={styles.headerRow}>
          <View style={styles.titleRow}>
            <Pressable
              onPress={() => navigation.goBack()}
              accessibilityRole="button"
              accessibilityLabel="Back to views"
              hitSlop={8}
            >
              <Feather name="chevron-left" size={24} color={color.icon.neutralBold} />
            </Pressable>
            <Text style={styles.title}>Saved</Text>
          </View>
          <Pressable
            style={styles.addButton}
            onPress={() => setAddSheetOpen(true)}
            accessibilityRole="button"
            accessibilityLabel="Add vehicles"
          >
            <Feather name="plus" size={size[6]} color={color.background.neutralWhite} />
          </Pressable>
        </View>
      </View>

      {viewState === 'empty' ? (
        <SavedEmptyState />
      ) : (
      <ScrollView
        contentContainerStyle={[
          styles.content,
          // Reserve room so content scrolls clear of the floating glass bar.
          { paddingBottom: spacing[4] + TAB_BAR_HEIGHT + bottomInset },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.garageAnchor, coachmarkOpen && styles.garageAnchorActive]}>
          <GarageCard
            title={garage.title}
            subtitle={
              garageVariant === 'single'
                ? '1 vehicle'
                : `${vehicles.length} vehicle${vehicles.length === 1 ? '' : 's'}`
            }
            delta={garage.delta}
            deltaCaption={garage.deltaCaption}
            vehicles={
              garageVariant === 'single'
                ? [vehicles.find((v) => v.id === 'mini') ?? vehicles[0]]
                : sortVehicles(vehicles, 'profit')
            }
            variant={garageVariant}
            highlighted={coachmarkOpen}
            onAdd={() => openAddVehicle(false)}
            onPress={() =>
              navigation.navigate('MyGarage', garageVariant === 'single' ? { single: true } : undefined)
            }
            onSelectVehicle={(vehicle) => navigation.navigate('VehicleDetails', { id: vehicle.id })}
            resume={
              // Hidden in the production (Vercel) build for now; still available in dev.
              __DEV__ && draft ? (
                <ResumeSetupStrip
                  title={draft.title}
                  percent={resumePercent}
                  onContinue={() => openAddVehicle(true)}
                />
              ) : null
            }
          />

          {coachmarkOpen && (
            <Coachmark
              style={styles.coachmark}
              onStart={() => {
                // Open the flow first so it covers the card, then clear the
                // coachmark/highlight behind it (avoids a jump under the scrim).
                openAddVehicle(false);
                setTimeout(() => setCoachmarkOpen(false), 320);
              }}
              onSkip={() => setCoachmarkOpen(false)}
            />
          )}
        </View>
        <View style={styles.gridRow}>
          <GridCard
            {...listings}
            variant={viewState}
            onPress={() =>
              navigation.navigate('Listings', viewState === 'single' ? { single: true } : undefined)
            }
          />
          <GridCard
            {...searches}
            variant={viewState}
            onPress={() =>
              navigation.navigate('Searches', viewState === 'single' ? { single: true } : undefined)
            }
          />
        </View>
        <ValuationsCard
          title={valuations.title}
          subtitle={undefined}
          variant={valuationVariant}
          onAdd={() => setAddValuationOpen(true)}
          valuations={valuationEntries.map((e) => ({
            id: e.id,
            name: e.title,
            price: e.value,
            delta: e.delta,
            expiry: e.expires,
          }))}
          onSeeAll={() =>
            navigation.navigate('Valuations', valuationVariant === 'single' ? { single: true } : undefined)
          }
          onSelect={(v) => navigation.navigate('ValuationDetail', { id: v.id })}
        />
      </ScrollView>
      )}

      {/* Floats over the scrolling content so the glass has something to
          refract — no opaque wrapper between it and the list. */}
      <View style={[styles.tabBarWrap, { bottom: bottomInset }]} pointerEvents="box-none">
        <TabBar active="saved" />
      </View>

      <OnboardingSheet
        visible={onboardingOpen}
        onClose={() => {
          setOnboardingOpen(false);
          // After "Get started", point the user at the garage card.
          if (viewState === 'empty') setCoachmarkOpen(true);
        }}
      />

      <AddVehicleSheet
        visible={addSheetOpen}
        onClose={() => setAddSheetOpen(false)}
        onSelect={handleSelectOption}
      />

      <AddVehicleFlow
        visible={addVehicleOpen}
        resumeDraft={resuming ? draft : null}
        onStepChange={onVehicleStep}
        onClose={(partial) => {
          setAddVehicleOpen(false);
          setResuming(false);
          setFlowUrl();
          // Dropped off partway: keep the progress so it can be resumed.
          if (partial) startDraft(partial);
        }}
        onComplete={(completed) => {
          setAddVehicleOpen(false);
          setResuming(false);
          setFlowUrl();
          reset();
          setEnteredGarage(true);
          // Open the car's detail page; the welcome prompt shows over it there.
          const card = buildVehicleCard(completed);
          addVehicle(card);
          navigation.navigate('VehicleDetails', { id: card.id, welcome: true });
        }}
      />

      <AddValuationFlow
        visible={addValuationOpen}
        onStepChange={onValuationStep}
        onClose={() => {
          setAddValuationOpen(false);
          setFlowUrl();
        }}
        onComplete={completeValuation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.background.neutralWhite,
  },
  header: {
    backgroundColor: color.background.neutralWhite,
    paddingHorizontal: spacing[4],
    paddingBottom: layout.headerBottom,
    gap: spacing[2],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  title: {
    ...font.title1Emphasized,
    color: color.text.neutralBold,
  },
  addButton: {
    width: size[10],
    height: size[10],
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
    backgroundColor: color.background.brandPrimaryRegular,
  },
  content: {
    paddingHorizontal: spacing[4],
    gap: spacing[4],
  },
  tabBarWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  gridRow: {
    flexDirection: 'row',
    gap: spacing[4],
  },
  garageAnchor: {
    position: 'relative',
  },
  // Lifts the card + its coachmark above the cards below while it's showing.
  garageAnchorActive: {
    zIndex: 20,
  },
  coachmark: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: spacing[1],
    zIndex: 20,
  },
});

