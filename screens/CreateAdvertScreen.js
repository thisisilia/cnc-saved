import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackButton from '../components/BackButton';
import DescriptionTipsSheet from '../components/vehicle/DescriptionTipsSheet';
import MakeLogo from '../components/addVehicle/MakeLogo';
import RegPlate from '../components/addVehicle/RegPlate';
import AppIcon from '../components/icons/AppIcon';
import { ADVERT_STEPS } from '../data/sell';
import { getVehicleDetails } from '../data/vehicleDetails';
import { useAdvertDraft } from '../state/advertDraft';
import { applyVehicleEdits, useVehicleEdits } from '../state/vehicleEdits';
import { color, font, radius, spacing } from '../theme/tokens';

const RING = 48;
const RING_STROKE = 5;

/** Circular completion indicator with the percentage in the middle. */
function ProgressRing({ percent }) {
  const r = (RING - RING_STROKE) / 2;
  const circumference = 2 * Math.PI * r;
  const dash = (percent / 100) * circumference;
  return (
    <View style={{ width: RING, height: RING }}>
      <Svg width={RING} height={RING}>
        <Circle cx={RING / 2} cy={RING / 2} r={r} stroke={color.border.neutralSubtle} strokeWidth={RING_STROKE} fill="none" />
        <Circle
          cx={RING / 2}
          cy={RING / 2}
          r={r}
          stroke={color.icon.successBold}
          strokeWidth={RING_STROKE}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          fill="none"
          transform={`rotate(-90 ${RING / 2} ${RING / 2})`}
        />
      </Svg>
      <View style={styles.ringLabel}>
        <Text style={styles.ringText}>{percent}%</Text>
      </View>
    </View>
  );
}

function StepRow({ label, done, onPress }) {
  return (
    <Pressable
      style={[styles.row, done && styles.rowDone]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {done && <AppIcon name="circle-check" size={20} color={color.icon.successBold} />}
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowArrow}>
        <Feather name="arrow-right" size={18} color={color.text.inverseBold} />
      </View>
    </Pressable>
  );
}

/**
 * The self-listing hub: four steps to a complete advert, tracked as a progress
 * ring. History and photos reuse the existing edit flows; description and price
 * are collected here. "Review advert" unlocks once all four are done.
 */
export default function CreateAdvertScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const id = route.params?.id;
  const { getEdits } = useVehicleEdits();
  const vehicle = applyVehicleEdits(getVehicleDetails(id), getEdits(id));
  const { description, price } = useAdvertDraft(id);
  const [info, setInfo] = useState(false);

  const done = {
    history: (vehicle.serviceHistory?.length ?? 0) > 0,
    photos: (vehicle.photos?.length ?? 0) > 0,
    description: description.trim().length > 0,
    price: price != null,
  };
  const completeCount = ADVERT_STEPS.filter((s) => done[s.id]).length;
  const percent = Math.round((completeCount / ADVERT_STEPS.length) * 100);
  const ready = completeCount === ADVERT_STEPS.length;

  const open = (stepId) => {
    if (stepId === 'history') navigation.navigate('History', { id });
    else if (stepId === 'photos') navigation.navigate('PhotosVideo', { id, returnTo: 'CreateAdvert' });
    else if (stepId === 'description') navigation.navigate('Description', { id });
    else navigation.navigate('Price', { id });
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 32) }]}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Create your advert</Text>
        <Pressable onPress={() => setInfo(true)} accessibilityRole="button" accessibilityLabel="About your advert" hitSlop={8}>
          <Feather name="info" size={22} color={color.icon.neutralBold} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.vrnRow}>
          {vehicle.registration ? <RegPlate value={vehicle.registration} /> : <View />}
          <MakeLogo make={vehicle.make} logo={vehicle.logo} size={30} chip />
        </View>

        <Text style={styles.estimate}>{vehicle.valuation.value}</Text>
        <View style={styles.estimateLabelRow}>
          <Text style={styles.estimateLabel}>ESTIMATED VALUE</Text>
          <Feather name="info" size={14} color={color.icon.neutralRegular} />
        </View>

        <View style={styles.steps}>
          {ADVERT_STEPS.map((step) => (
            <StepRow key={step.id} label={step.label} done={done[step.id]} onPress={() => open(step.id)} />
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom || spacing[4] }]}>
        <ProgressRing percent={percent} />
        <Pressable
          style={[styles.review, !ready && styles.reviewDisabled]}
          disabled={!ready}
          onPress={() => navigation.navigate('ReviewAdvert', { id })}
          accessibilityRole="button"
          accessibilityLabel="Review advert"
        >
          <Text style={[styles.reviewLabel, !ready && styles.reviewLabelDisabled]}>Review advert</Text>
          <Feather name="arrow-right" size={18} color={ready ? color.text.inverseBold : color.text.neutralBoldDisabled} />
        </Pressable>
      </View>

      <DescriptionTipsSheet visible={info} onClose={() => setInfo(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.background.neutralWhite,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[3],
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[3],
  },
  headerTitle: {
    ...font.bodyEmphasized,
    color: color.text.neutralBold,
    flex: 1,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[2],
  },
  vrnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 40,
  },
  estimate: {
    ...font.title3Emphasized,
    color: color.text.neutralBold,
    marginTop: spacing[4],
  },
  estimateLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1.5],
    marginTop: spacing[1],
  },
  estimateLabel: {
    ...font.labelSm,
    color: color.text.neutralRegular,
    letterSpacing: 0.6,
  },
  steps: {
    marginTop: spacing[5],
    gap: spacing[3],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    backgroundColor: color.background.neutralSubtle,
    borderRadius: radius.lg,
    paddingLeft: spacing[4],
    paddingRight: spacing[2],
    paddingVertical: spacing[2],
    minHeight: 60,
  },
  rowDone: {
    backgroundColor: color.background.brandPrimarySubtle,
  },
  rowLabel: {
    ...font.calloutEmphasized,
    color: color.text.neutralBold,
    flex: 1,
  },
  rowArrow: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: color.background.brandPrimaryRegular,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
  },
  ringLabel: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringText: {
    ...font.labelSm,
    fontWeight: '700',
    color: color.text.neutralBold,
  },
  review: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    minHeight: 52,
    borderRadius: radius.xl,
    backgroundColor: color.background.brandPrimaryRegular,
  },
  reviewDisabled: {
    backgroundColor: color.background.neutralSubtle,
  },
  reviewLabel: {
    ...font.bodyEmphasized,
    color: color.text.inverseBold,
  },
  reviewLabelDisabled: {
    color: color.text.neutralBoldDisabled,
  },
});
