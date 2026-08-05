import { StyleSheet, Text, TextInput, View } from 'react-native';
import { MILEAGE_UNITS } from '../../data/addVehicle';
import { borderWidth, color, font, radius, spacing } from '../../theme/tokens';
import Checkbox from '../Checkbox';
import SegmentedControl from './SegmentedControl';

/**
 * Odometer reading with its unit, plus the "not applicable" opt-out.
 *
 * The opt-out belongs to the add flow, where the reading may genuinely be
 * unknown. Editing an existing vehicle always has a figure to correct, so the
 * edit form hides it.
 */
export default function MileageBlock({
  label = 'Mileage',
  mileage,
  onChangeMileage,
  unit,
  onChangeUnit,
  notApplicable,
  onChangeNotApplicable,
  hideNotApplicable = false,
}) {
  return (
    <View style={styles.block}>
      <View style={styles.field}>
        <TextInput
          style={styles.input}
          value={mileage}
          onChangeText={(text) => onChangeMileage(text.replace(/[^0-9]/g, ''))}
          placeholder={label}
          placeholderTextColor={color.text.neutralRegular}
          keyboardType="number-pad"
          editable={!notApplicable}
          accessibilityLabel={label}
        />
        <SegmentedControl options={MILEAGE_UNITS} value={unit} onChange={onChangeUnit} />
      </View>

      {!hideNotApplicable && (
        <View style={styles.optOut}>
          <Checkbox
            checked={notApplicable}
            onChange={onChangeNotApplicable}
            accessibilityLabel="Not applicable"
          />
          <Text style={styles.optOutLabel}>Not applicable</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    gap: spacing[3],
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    minHeight: 52,
    backgroundColor: color.background.neutralWhite,
    borderWidth: borderWidth.xs,
    borderColor: color.border.neutralSubtle,
    borderRadius: radius.md,
    paddingLeft: spacing[3],
    paddingRight: spacing[1],
    paddingVertical: spacing[1],
  },
  input: {
    flex: 1,
    // Web gives flex items an automatic min-width, which lets the input's
    // intrinsic size push the unit control past the field's edge.
    minWidth: 0,
    ...font.calloutRegular,
    color: color.text.neutralBold,
    outlineStyle: 'none',
  },
  optOut: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  optOutLabel: {
    ...font.subheadlineRegular,
    color: color.text.neutralBold,
  },
});
