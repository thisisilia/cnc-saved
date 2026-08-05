import { Feather } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppIcon from '../components/icons/AppIcon';
import RegPlate from '../components/addVehicle/RegPlate';
import MakeLogo from '../components/addVehicle/MakeLogo';
import GradeScale from '../components/vehicle/GradeScale';
import Button from '../components/vehicle/Button';
import SectionCard from '../components/vehicle/SectionCard';
import { color, font, radius, spacing } from '../theme/tokens';

/**
 * Value my car — the estimate shown after the condition step (Figma 1135-26191
 * / 1135-26251).
 *
 * A green vehicle illustration over an estimate card. The card identifies the
 * car by registration (reg path) or make/model with year and mileage (search
 * path). "Go to valuation" opens the full valuation detail.
 */
export default function ValuationEstimateScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { mode, vehicle, fields = {}, mileage, estimate } = route.params ?? {};
  const uk = mode === 'uk';

  const subline = [fields.year, mileage ? `${mileage} miles` : null].filter(Boolean).join(' · ');

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, spacing[8]) }]}>
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Back"
          hitSlop={8}
        >
          <Feather name="chevron-left" size={24} color={color.icon.neutralBold} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <AppIcon name="classic-cars" size={110} color={color.icon.brandPrimaryRegular} />
        </View>

        <SectionCard gap={spacing[4]}>
          <View style={styles.summaryHead}>
            {uk ? (
              <RegPlate value={vehicle?.registration} />
            ) : (
              <View style={styles.summaryText}>
                <Text style={styles.summaryTitle}>{vehicle?.title}</Text>
                {subline ? <Text style={styles.summarySub}>{subline}</Text> : null}
              </View>
            )}
            <MakeLogo make={vehicle?.make} size={32} />
          </View>

          <View style={styles.estimateHead}>
            <Text style={styles.estimateLabel}>Estimated value</Text>
            <Text style={styles.estimateExpires}>{estimate?.expires}</Text>
          </View>

          <View style={styles.valueRow}>
            <Text style={styles.value}>{estimate?.value}</Text>
            <Pressable
              style={styles.gradePill}
              onPress={() => {}}
              accessibilityRole="button"
              accessibilityLabel={`${estimate?.grade} condition — how this is calculated`}
            >
              <Text style={styles.gradePillLabel}>{estimate?.grade}</Text>
              <Feather name="info" size={13} color={color.text.inverseBold} />
            </Pressable>
          </View>

          <GradeScale grades={estimate?.grades ?? []} />
        </SectionCard>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom || spacing[4] }]}>
        <Button
          label="Go to valuation"
          onPress={() => navigation.navigate('ValuationDetail', { title: vehicle?.title })}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.background.neutralWhite,
  },
  header: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[2],
  },
  content: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[6],
  },
  hero: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[8],
  },
  summaryHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[3],
  },
  summaryText: {
    flex: 1,
    minWidth: 0,
    gap: spacing[1],
  },
  summaryTitle: {
    ...font.title3Emphasized,
    color: color.text.neutralBold,
  },
  summarySub: {
    ...font.bodySmRegular,
    color: color.text.neutralRegular,
  },
  estimateHead: {
    gap: spacing[1],
  },
  estimateLabel: {
    ...font.bodyEmphasized,
    color: color.text.neutralBold,
  },
  estimateExpires: {
    ...font.labelSm,
    color: color.text.neutralRegular,
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
  footer: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
  },
});
