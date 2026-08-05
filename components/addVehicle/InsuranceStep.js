import { StyleSheet, Text, View } from 'react-native';
import { color, font, radius, spacing } from '../../theme/tokens';
import ContinueButton from './ContinueButton';
import FlowHeader from './FlowHeader';
import PickerField from './PickerField';

/**
 * "Insurance information" — its own step between the vehicle details and
 * purchase information, asking when the policy renews (Figma 1278-8719).
 */
export default function InsuranceStep({
  value,
  onChange,
  onBack,
  onContinue,
  onRequestPicker,
  pickerOpen,
}) {
  return (
    <View style={styles.step}>
      <FlowHeader title="Insurance information" onBack={onBack} />

      <View style={styles.body}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>When does your insurance renew?</Text>
          <PickerField
            label="Enter insurance renew date"
            value={value}
            onChange={onChange}
            mode="date"
            accessibilityLabel="Insurance renewal date"
            onRequestOpen={onRequestPicker}
          />
        </View>
      </View>

      {!pickerOpen && (
        <View style={styles.footer}>
          <ContinueButton disabled={!value} onPress={onContinue} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Fill the (filled) sheet so the footer button pins to the bottom.
  step: {
    flex: 1,
    alignSelf: 'stretch',
  },
  body: {
    flex: 1,
    paddingHorizontal: spacing[5],
    paddingTop: spacing[2],
    gap: spacing[4],
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
    paddingHorizontal: spacing[5],
    paddingTop: spacing[3],
    paddingBottom: spacing[4],
  },
});
