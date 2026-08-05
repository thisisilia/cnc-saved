import { Feather } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CONDITIONS } from '../../data/addVehicle';
import { borderWidth, color, font, radius, size, spacing } from '../../theme/tokens';
import AppIcon from '../icons/AppIcon';
import ContinueButton from './ContinueButton';
import FlowHeader from './FlowHeader';

/**
 * Selected marker.
 *
 * The shared Checkbox draws a dot for `shape="radio"`, per its own Figma spec.
 * This comp shows a tick in a filled circle instead, so the marker is local
 * rather than bending the design-system component out of shape.
 */
function Marker({ selected }) {
  return (
    <View style={[styles.marker, selected ? styles.markerOn : styles.markerOff]}>
      {selected && <Feather name="check" size={16} color={color.text.inverseBold} />}
    </View>
  );
}

function ConditionOption({ condition, selected, onPress }) {
  return (
    <Pressable
      style={[styles.option, selected && styles.optionSelected]}
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={`${condition.label}. ${condition.description}`}
    >
      <View style={styles.optionHead}>
        <AppIcon
          name={condition.glyph}
          size={size[6]}
          color={selected ? color.icon.brandPrimaryRegular : color.icon.neutralBold}
        />
        <Text style={styles.label}>{condition.label}</Text>
        <Marker selected={selected} />
      </View>
      <Text style={styles.description}>{condition.description}</Text>
    </Pressable>
  );
}

/** PRD step 3 — vehicle condition. Feeds the estimated value. */
export default function ConditionStep({ vehicleTitle, value, onChange, onBack, onContinue }) {
  return (
    <View style={styles.step}>
      <FlowHeader title="Vehicle condition" onBack={onBack} />

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.prompt}>
          Please rate the general overall condition of your {vehicleTitle}
        </Text>

        <View style={styles.options}>
          {CONDITIONS.map((condition) => (
            <ConditionOption
              key={condition.id}
              condition={condition}
              selected={condition.id === value}
              onPress={() => onChange(condition.id)}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <ContinueButton disabled={!value} onPress={onContinue} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Fill the (filled) sheet so the footer button pins to the bottom.
  step: {
    flex: 1,
    alignSelf: 'stretch',
    // minHeight:0 lets this column shrink to the sheet height so the scroll
    // area below is bounded (and therefore actually scrolls) instead of growing
    // to fit its content.
    minHeight: 0,
  },
  body: {
    flex: 1,
    minHeight: 0,
    alignSelf: 'stretch',
  },
  bodyContent: {
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[3],
    gap: spacing[4],
  },
  prompt: {
    ...font.calloutEmphasized,
    color: color.text.neutralBold,
  },
  options: {
    gap: spacing[3],
  },
  option: {
    backgroundColor: color.background.neutralSubtle,
    borderWidth: borderWidth.xs,
    borderColor: color.border.neutralSubtle,
    borderRadius: radius.lg,
    padding: spacing[4],
    gap: spacing[2],
  },
  optionSelected: {
    backgroundColor: color.background.neutralWhite,
    borderColor: color.border.brandPrimaryRegular,
  },
  optionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  label: {
    ...font.bodyEmphasized,
    color: color.text.neutralBold,
    flex: 1,
  },
  description: {
    ...font.bodySmRegular,
    color: color.text.neutralRegular,
  },
  marker: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
  },
  markerOn: {
    backgroundColor: color.background.brandPrimaryRegular,
  },
  markerOff: {
    borderWidth: borderWidth.xs,
    borderColor: color.border.neutralRegular,
  },
  footer: {
    alignSelf: 'stretch',
    paddingHorizontal: spacing[5],
    paddingTop: spacing[3],
    paddingBottom: spacing[4],
  },
});
