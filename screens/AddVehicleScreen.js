import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MakeLogo from '../components/addVehicle/MakeLogo';
import ProgressRing from '../components/addVehicle/ProgressRing';
import RegPlate from '../components/addVehicle/RegPlate';
import AppIcon from '../components/icons/AppIcon';
import FlowHeader from '../components/addVehicle/FlowHeader';
import { ADD_VEHICLE_STEPS, completionPercent, estimateValue } from '../data/addVehicle';
import { useAddVehicleDraft } from '../state/addVehicleDraft';
import { borderWidth, color, font, radius, size, spacing } from '../theme/tokens';

/** One checklist row. Turns green once its step is complete. */
function StepRow({ step, complete, onPress }) {
  return (
    <View style={[styles.row, complete && styles.rowComplete]}>
      {complete && (
        <AppIcon name="circle-check" size={20} color={color.icon.brandPrimaryRegular} />
      )}
      <Text style={styles.rowLabel}>{step.label}</Text>
      {step.badge && !complete && (
        <View style={styles.badge}>
          <Text style={styles.badgeLabel}>{step.badge}</Text>
        </View>
      )}
      <Pressable
        style={styles.rowAction}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={complete ? `Edit ${step.label}` : `Add ${step.label}`}
      >
        <Feather name="arrow-right" size={18} color={color.text.inverseBold} />
      </Pressable>
    </View>
  );
}

/**
 * Add vehicle — the profile checklist.
 *
 * Reached once vehicle information and condition are done in the sheet flow.
 * Purchase information, history and photos are each their own step; review
 * unlocks when every required one is complete.
 */
export default function AddVehicleScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  // Every step reads and writes the shared draft, so nothing is threaded
  // through route params.
  const { draft: vehicle, purchase, history, photos } = useAddVehicleDraft();
  const draft = vehicle ?? {};
  const [completed, setCompleted] = useState({});

  // A step counts as done once its screen has stored data, not when tapped.
  const done = {
    ...completed,
    purchase: Boolean(purchase),
    history: Boolean(history?.entries?.length),
    photos: Boolean(photos?.items?.length),
  };

  const openStep = (step) => {
    if (step.id === 'purchase') {
      navigation.navigate('PurchaseInformation');
      return;
    }
    if (step.id === 'history') {
      navigation.navigate('History');
      return;
    }
    if (step.id === 'photos') {
      navigation.navigate('PhotosVideo');
    }
  };

  const estimate = estimateValue({
    conditionId: draft.conditionId,
    mileage: draft.mileage,
    notApplicable: draft.notApplicable,
  });
  const percent = completionPercent(done);
  const canReview = ADD_VEHICLE_STEPS.filter((s) => s.required).every((s) => done[s.id]);

  return (
    <View style={styles.screen}>
      <FlowHeader title="Add vehicle" backIcon="chevron-left" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.identity}>
          {draft.registration ? (
            <RegPlate value={draft.registration} />
          ) : (
            <Text style={styles.title}>{draft.title}</Text>
          )}
          <MakeLogo make={draft.make} size={32} chip />
        </View>

        <View style={styles.estimate}>
          <Text style={styles.estimateValue}>{estimate.label}</Text>
          <View style={styles.estimateLabelRow}>
            <Text style={styles.estimateLabel}>Estimated value</Text>
            <AppIcon name="circle-info" size={16} color={color.icon.neutralRegular} />
          </View>
        </View>

        <View style={styles.steps}>
          {ADD_VEHICLE_STEPS.map((step) => (
            <StepRow
              key={step.id}
              step={step}
              complete={Boolean(done[step.id])}
              onPress={() => openStep(step)}
            />
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom || spacing[4] }]}>
        <ProgressRing percent={percent} />
        <Pressable
          style={[styles.review, !canReview && styles.reviewDisabled]}
          onPress={canReview ? () => navigation.navigate('ReviewDetails') : undefined}
          disabled={!canReview}
          accessibilityRole="button"
          accessibilityState={{ disabled: !canReview }}
          accessibilityLabel="Review details"
        >
          <Text style={[styles.reviewLabel, !canReview && styles.reviewLabelDisabled]}>
            Review details
          </Text>
          <Feather
            name="arrow-right"
            size={20}
            color={canReview ? color.text.inverseBold : color.text.neutralBoldDisabled}
          />
        </Pressable>
      </View>
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
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[3],
  },
  title: {
    ...font.bodyLgEmphasized,
    color: color.text.neutralBold,
    flex: 1,
  },
  estimate: {
    gap: spacing[1],
  },
  estimateValue: {
    ...font.bodyLgEmphasized,
    color: color.text.neutralBold,
  },
  estimateLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  estimateLabel: {
    ...font.labelSm,
    color: color.text.neutralRegular,
  },
  steps: {
    gap: spacing[3],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: color.background.neutralSubtle,
    borderRadius: radius.lg,
    paddingLeft: spacing[4],
    paddingRight: spacing[2],
    paddingVertical: spacing[2],
    minHeight: 56,
  },
  rowComplete: {
    backgroundColor: color.background.brandPrimarySubtle,
  },
  rowLabel: {
    ...font.calloutEmphasized,
    color: color.text.neutralBold,
    flex: 1,
  },
  badge: {
    borderWidth: borderWidth.xs,
    borderColor: color.border.neutralRegular,
    borderRadius: radius.sm,
    paddingHorizontal: spacing[1.5],
    paddingVertical: 2,
  },
  badgeLabel: {
    ...font.labelSm,
    color: color.text.neutralRegular,
  },
  rowAction: {
    width: size[8],
    height: size[8],
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: color.background.brandPrimaryRegular,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
  },
  review: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    minHeight: 48,
    borderRadius: radius.xl,
    backgroundColor: color.background.brandPrimaryRegular,
  },
  reviewDisabled: {
    backgroundColor: color.background.neutralSubtle,
  },
  reviewLabel: {
    ...font.bodyLgEmphasized,
    color: color.text.inverseBold,
  },
  reviewLabelDisabled: {
    color: color.text.neutralBoldDisabled,
  },
});
