import { Feather } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import BottomSheet from '../components/BottomSheet';
import NavHeader from '../components/NavHeader';
import ConditionStep from '../components/addVehicle/ConditionStep';
import GradeScale from '../components/vehicle/GradeScale';
import ListingCard from '../components/listings/ListingCard';
import Button from '../components/vehicle/Button';
import MarketSection from '../components/vehicle/MarketSection';
import SectionCard from '../components/vehicle/SectionCard';
import AppIcon from '../components/icons/AppIcon';
import CircleInfo from '../components/icons/CircleInfo';
import ValuationSheet from '../components/vehicle/ValuationSheet';
import { buildVehicleCard, draftFromValuation } from '../data/addedVehicle';
import { buildEstimate, getValuationDetail } from '../data/valuations';
import { gradeRange } from '../data/portfolio';
import { useGarage } from '../state/garage';
import { color, font, radius, spacing } from '../theme/tokens';

const COLUMNS = 2;

function chunk(items, size) {
  const rows = [];
  for (let i = 0; i < items.length; i += size) rows.push(items.slice(i, i + size));
  return rows;
}

/** "Similar vehicle" / "Recently sold" heading with a See all affordance. */
function SectionHead({ title, onSeeAll }) {
  return (
    <View style={styles.sectionHead}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Pressable
        style={styles.seeAll}
        onPress={onSeeAll}
        accessibilityRole="button"
        accessibilityLabel={`See all ${title}`}
      >
        <Text style={styles.seeAllLabel}>See all</Text>
        <Feather name="chevron-right" size={16} color={color.icon.neutralBold} />
      </Pressable>
    </View>
  );
}

function Grid({ items }) {
  return chunk(items, COLUMNS).map((row, i) => (
    <View key={i} style={styles.row}>
      {row.map((item) => (
        <ListingCard key={item.id} listing={item} />
      ))}
      {Array.from({ length: COLUMNS - row.length }, (_, j) => (
        <View key={`spacer-${j}`} style={styles.spacer} />
      ))}
    </View>
  ));
}

/**
 * A logged valuation opened from Saved → Valuations (Figma 1135-21390).
 *
 * Reuses the vehicle market section for demand, but shows the condition scale
 * inline (no info icon) and adds similar and recently-sold comparables. The
 * sticky action offers to add the car to the garage rather than to sell.
 */
export default function ValuationDetailScreen({ navigation, route }) {
  const { addVehicle } = useGarage();
  const detail = useMemo(
    () => getValuationDetail(route.params?.id, route.params?.title),
    [route.params?.id, route.params?.title]
  );
  const { market, similar, recentlySold, expired } = detail;

  const [menuOpen, setMenuOpen] = useState(false);
  const [valuationOpen, setValuationOpen] = useState(false);
  const [conditionOpen, setConditionOpen] = useState(false);
  const [conditionId, setConditionId] = useState(null);
  // "Update valuation" re-asks the condition and recomputes the estimate.
  const [valuationOverride, setValuationOverride] = useState(null);
  const valuation = valuationOverride ?? detail.valuation;

  // "I own this car" commits it to the garage and opens the (unfinished) vehicle
  // page to fill in the rest, exactly like the add-vehicle flow.
  const ownCar = () => {
    setMenuOpen(false);
    const draft = route.params?.result ? draftFromValuation(route.params.result) : { title: detail.title };
    const card = buildVehicleCard(draft);
    addVehicle(card);
    navigation.navigate('VehicleDetails', { id: card.id });
  };

  const applyCondition = () => {
    setValuationOverride({ ...detail.valuation, ...buildEstimate(conditionId) });
    setConditionOpen(false);
  };

  return (
    <View style={styles.screen}>
      <NavHeader
        title={detail.title}
        onBack={() => navigation.goBack()}
        actions={[
          { key: 'menu', label: 'Valuation options', icon: 'more-vertical', onPress: () => setMenuOpen(true) },
        ]}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionCard gap={spacing[5]}>
          <View style={styles.estimateMain}>
            <Pressable
              style={styles.estimateHead}
              onPress={() => setValuationOpen(true)}
              accessibilityRole="button"
              accessibilityLabel="Valuation history"
              hitSlop={8}
            >
              <Text style={styles.estimateLabel}>Valuation</Text>
              <CircleInfo size={20} color={color.text.neutralRegular} />
            </Pressable>

            <View style={styles.estimateValueBlock}>
              <Text style={styles.value}>{gradeRange(valuation.grades, valuation.value)}</Text>
              <Text style={[styles.estimateExpires, expired && styles.estimateExpired]}>
                {valuation.expires}
              </Text>
            </View>

            <View style={styles.conditionBlock}>
              <Text style={styles.conditionTitle}>Vehicle condition</Text>
              <GradeScale grades={valuation.grades} />
            </View>
          </View>

          <Text style={styles.blurb}>{valuation.blurb}</Text>

          <Button label="Get expert valuation" onPress={() => {}} />
        </SectionCard>

        <MarketSection market={market} comparables={[]} />

        <View style={styles.section}>
          <SectionHead title="Recently sold" onSeeAll={() => {}} />
          <Grid items={recentlySold} />
        </View>

        <View style={styles.section}>
          <SectionHead title="Similar vehicle" onSeeAll={() => {}} />
          <Grid items={similar} />
        </View>
      </ScrollView>

      <ValuationSheet
        visible={valuationOpen}
        onClose={() => setValuationOpen(false)}
        valuation={valuation}
      />

      <BottomSheet visible={menuOpen} onClose={() => setMenuOpen(false)}>
        <View style={styles.menu}>
          <Button label="I own this car" onPress={ownCar} />
          <Button
            label="Update valuation"
            variant="outline"
            leading={<AppIcon name="rotate-reverse" size={18} color={color.text.brandPrimaryBold} />}
            onPress={() => {
              setMenuOpen(false);
              setConditionOpen(true);
            }}
          />
        </View>
      </BottomSheet>

      <BottomSheet visible={conditionOpen} onClose={() => setConditionOpen(false)} topInset={40} fill>
        <ConditionStep
          vehicleTitle={detail.title}
          value={conditionId}
          onChange={setConditionId}
          onBack={() => setConditionOpen(false)}
          onContinue={applyCondition}
        />
      </BottomSheet>
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
    paddingBottom: spacing[6],
    gap: spacing[4],
  },
  estimateMain: {
    gap: spacing[4],
  },
  estimateHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    alignSelf: 'flex-start',
  },
  estimateValueBlock: {
    gap: spacing[1],
  },
  conditionBlock: {
    gap: spacing[2],
  },
  estimateLabel: {
    ...font.bodyEmphasized,
    color: color.text.neutralBold,
  },
  estimateExpires: {
    ...font.labelSm,
    color: color.text.neutralRegular,
  },
  estimateExpired: {
    color: color.text.dangerBold,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  value: {
    ...font.title2Emphasized,
    color: color.text.neutralBold,
  },
  conditionTitle: {
    ...font.bodySmEmphasized,
    color: color.text.neutralBold,
  },
  gradePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    minHeight: 24,
    paddingHorizontal: spacing[2.5],
    borderRadius: radius.full,
    backgroundColor: color.background.brandPrimaryRegular,
  },
  gradePillLabel: {
    ...font.bodyXsEmphasized,
    color: color.text.inverseBold,
  },
  blurb: {
    ...font.bodyXsRegular,
    color: color.text.neutralRegular,
  },
  section: {
    gap: spacing[3],
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    // Match the "Valuation" card title (estimateLabel) size.
    ...font.bodyEmphasized,
    color: color.text.neutralBold,
  },
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  seeAllLabel: {
    ...font.bodySmRegular,
    color: color.text.neutralBold,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[4],
  },
  spacer: {
    flex: 1,
  },
  menu: {
    alignSelf: 'stretch',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[2],
    gap: spacing[3],
  },
});
