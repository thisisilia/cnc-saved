import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AddValuationFlow from '../components/addVehicle/AddValuationFlow';
import NavHeader from '../components/NavHeader';
import ValuationCard from '../components/valuations/ValuationCard';
import { buildVehicleCard, draftFromValuation } from '../data/addedVehicle';
import { NOT_OWNED, valuationEntries } from '../data/valuations';
import { useGarage } from '../state/garage';
import { color, spacing } from '../theme/tokens';

/**
 * Saved → Valuations: the running log of every valuation the user has run
 * (PRD section 6). Each row opens the full valuation detail.
 */
export default function ValuationsScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const [flowOpen, setFlowOpen] = useState(false);
  const { addVehicle } = useGarage();
  const entries = route.params?.single ? valuationEntries.slice(0, 1) : valuationEntries;

  // Owned → into the garage and onto the vehicle page to finish; not owned →
  // straight to the valuation detail, no estimate preview in between.
  const completeValuation = (result) => {
    setFlowOpen(false);
    if (result.ownership === NOT_OWNED) {
      navigation.navigate('ValuationDetail', { title: result.vehicle?.title, result });
      return;
    }
    const card = buildVehicleCard(draftFromValuation(result));
    addVehicle(card);
    navigation.navigate('VehicleDetails', { id: card.id });
  };

  return (
    <View style={styles.screen}>
      <NavHeader
        title="Valuations"
        onBack={() => navigation.goBack()}
        actions={[
          {
            key: 'add',
            icon: 'plus',
            tone: 'brand',
            label: 'Add valuation',
            onPress: () => setFlowOpen(true),
          },
        ]}
      />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom || spacing[8] }]}
        showsVerticalScrollIndicator={false}
      >
        {entries.map((entry) => (
          <ValuationCard
            key={entry.id}
            entry={entry}
            onPress={() => navigation.navigate('ValuationDetail', { id: entry.id })}
          />
        ))}
      </ScrollView>

      <AddValuationFlow visible={flowOpen} onClose={() => setFlowOpen(false)} onComplete={completeValuation} />
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
    paddingTop: spacing[1],
    gap: spacing[4],
  },
});
