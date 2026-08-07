import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MANUAL_FIELDS, RADIO_GROUPS } from '../../data/addVehicle';
import { color, font, radius, spacing } from '../../theme/tokens';
import ContinueButton from './ContinueButton';
import { SelectField, TextField } from './Field';
import FlowHeader from './FlowHeader';
import MakeLogo from './MakeLogo';
import MileageBlock from './MileageBlock';
import OptionSheet from './OptionSheet';
import RadioGroupCard from './RadioGroupCard';
import RegPlate from './RegPlate';

/**
 * PRD step 1 result — "Your vehicle".
 *
 * Both regions land here. The UK path arrives with the lookup already resolved
 * and only needs mileage; the non-UK path arrives with just a make/model and
 * collects the rest by hand.
 */
export default function YourVehicleStep({
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
  onBack,
  onEditDetails,
  onContinue,
}) {
  const uk = mode === 'uk';
  const canContinue = notApplicable || mileage.trim().length > 0;
  const [picker, setPicker] = useState(null);

  return (
    <View style={styles.step}>
      <FlowHeader title="Your vehicle" onBack={onBack} />

      <KeyboardAvoidingView
        style={styles.scroll}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
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

          {uk && (
            <>
              <View style={styles.summaryText}>
                <Text style={styles.title}>{vehicle.title}</Text>
                <Text style={styles.spec}>{vehicle.specLine}</Text>
              </View>
              <Pressable
                style={styles.editRow}
                onPress={onEditDetails}
                accessibilityRole="button"
                accessibilityLabel="Edit vehicle details"
              >
                <Feather name="edit" size={16} color={color.icon.neutralBold} />
                <Text style={styles.editLabel}>Edit vehicle details</Text>
              </Pressable>
            </>
          )}
        </View>

        {!uk && (
          <View style={styles.card}>
            {MANUAL_FIELDS.map((field) =>
              field.type === 'select' ? (
                <SelectField
                  key={field.id}
                  label={field.label}
                  value={fields[field.id]}
                  active={picker?.id === field.id}
                  onPress={() => setPicker(field)}
                />
              ) : (
                <TextField
                  key={field.id}
                  label={field.label}
                  value={fields[field.id]}
                  keyboardType={field.keyboardType}
                  autoCapitalize={field.autoCapitalize}
                  onChangeText={(text) => onChangeField(field.id, text)}
                />
              )
            )}
          </View>
        )}

        <View style={styles.card}>
          {!uk && <Text style={styles.sectionTitle}>Mileage</Text>}
          <MileageBlock
            label={uk ? 'Mileage' : 'Odometer reading'}
            mileage={mileage}
            onChangeMileage={onChangeMileage}
            unit={unit}
            onChangeUnit={onChangeUnit}
            notApplicable={notApplicable}
            onChangeNotApplicable={onChangeNotApplicable}
          />
        </View>

        {!uk &&
          RADIO_GROUPS.map((group) => (
            <RadioGroupCard
              key={group.id}
              title={group.label}
              options={group.options}
              value={fields[group.id]}
              onChange={(option) => onChangeField(group.id, option)}
            />
          ))}
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
    </View>
  );
}

const styles = StyleSheet.create({
  step: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  // flex:1 is what lets KeyboardAvoidingView shrink the form when the keyboard
  // appears, instead of the fields sitting underneath it.
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
  summaryText: {
    gap: spacing[1],
  },
  title: {
    ...font.calloutEmphasized,
    color: color.text.neutralBold,
  },
  spec: {
    ...font.subheadlineRegular,
    color: color.text.neutralRegular,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  editLabel: {
    ...font.subheadlineRegular,
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
