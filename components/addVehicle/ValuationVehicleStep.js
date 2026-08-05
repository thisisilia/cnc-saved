import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { OWNERSHIP_OPTIONS, VALUATION_FIELDS } from '../../data/valuations';
import { color, font, radius, spacing } from '../../theme/tokens';
import ContinueButton from './ContinueButton';
import { SelectField, TextField } from './Field';
import FlowHeader from './FlowHeader';
import MakeLogo from './MakeLogo';
import MileageBlock from './MileageBlock';
import OptionSheet from './OptionSheet';
import RegPlate from './RegPlate';

/**
 * Valuation step 2 — vehicle information.
 *
 * A lighter cousin of the add-vehicle "Your vehicle" step: a valuation only
 * needs enough to price the car. The registration path shows the plate and
 * make/model (no spec line); the search path collects year, variant and body
 * type by hand. Both then take an odometer reading and how long it's been owned.
 */
export default function ValuationVehicleStep({
  mode,
  vehicle,
  fields,
  onChangeField,
  mileage,
  onChangeMileage,
  unit,
  onChangeUnit,
  notApplicable,
  onChangeNotApplicable,
  ownership,
  onChangeOwnership,
  onBack,
  onContinue,
}) {
  const uk = mode === 'uk';
  const [picker, setPicker] = useState(null);
  const [ownershipOpen, setOwnershipOpen] = useState(false);

  const canContinue = (notApplicable || mileage.trim().length > 0) && Boolean(ownership);

  return (
    <View style={styles.step}>
      <FlowHeader title="Your vehicle" onBack={onBack} />

      <KeyboardAvoidingView style={styles.scroll} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.body}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.summary}>
            <View style={styles.summaryHead}>
              {uk ? <RegPlate value={vehicle.registration} /> : <Text style={styles.title}>{vehicle.title}</Text>}
              <MakeLogo make={vehicle.make} size={32} />
            </View>
            {/* Registration keeps the make/model line but drops the spec detail. */}
            {uk && <Text style={styles.title}>{vehicle.title}</Text>}
          </View>

          {!uk && (
            <View style={styles.card}>
              {VALUATION_FIELDS.map((field) =>
                field.type === 'select' ? (
                  <SelectField
                    key={field.id}
                    label={field.label}
                    value={fields[field.id]}
                    onPress={() => setPicker(field)}
                  />
                ) : (
                  <TextField
                    key={field.id}
                    label={field.label}
                    value={fields[field.id]}
                    keyboardType={field.keyboardType}
                    onChangeText={(text) => onChangeField(field.id, text)}
                  />
                )
              )}
            </View>
          )}

          <View style={styles.card}>
            <MileageBlock
              label="Odometer reading"
              mileage={mileage}
              onChangeMileage={onChangeMileage}
              unit={unit}
              onChangeUnit={onChangeUnit}
              notApplicable={notApplicable}
              onChangeNotApplicable={onChangeNotApplicable}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>How long have you owned the vehicle?</Text>
            <SelectField
              label="Select ownership length"
              value={ownership}
              onPress={() => setOwnershipOpen(true)}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <ContinueButton disabled={!canContinue} onPress={onContinue} />
      </View>

      <OptionSheet
        visible={Boolean(picker)}
        title={picker?.label}
        options={picker?.options}
        value={picker ? fields[picker.id] : undefined}
        onClose={() => setPicker(null)}
        onSelect={(option) => {
          onChangeField(picker.id, option);
          setPicker(null);
        }}
      />

      <OptionSheet
        visible={ownershipOpen}
        title="How long have you owned the vehicle?"
        options={OWNERSHIP_OPTIONS}
        value={ownership}
        onClose={() => setOwnershipOpen(false)}
        onSelect={(option) => {
          onChangeOwnership(option);
          setOwnershipOpen(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  step: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  scroll: {
    flex: 1,
    alignSelf: 'stretch',
  },
  body: {
    paddingHorizontal: spacing[5],
    gap: spacing[4],
  },
  summary: {
    backgroundColor: color.background.neutralSubtle,
    borderRadius: radius.lg,
    padding: spacing[4],
    gap: spacing[3],
  },
  summaryHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[3],
  },
  title: {
    ...font.calloutEmphasized,
    color: color.text.neutralBold,
  },
  card: {
    backgroundColor: color.background.neutralSubtle,
    borderRadius: radius.lg,
    padding: spacing[3],
    gap: spacing[3],
  },
  sectionTitle: {
    ...font.calloutEmphasized,
    color: color.text.neutralBold,
    paddingHorizontal: spacing[1],
  },
  footer: {
    alignSelf: 'stretch',
    paddingHorizontal: spacing[5],
    paddingTop: spacing[3],
    paddingBottom: spacing[4],
  },
});
