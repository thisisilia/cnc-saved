import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, font, spacing } from '../../theme/tokens';
import ContinueButton from './ContinueButton';
import FlowHeader from './FlowHeader';
import { RegPlateInput } from './RegPlate';

const MIN_REG_LENGTH = 2;

/** PRD step 1, UK: enter the registration and look the vehicle up. */
export default function RegistrationStep({ registration, onChangeRegistration, onBack, onContinue, onSkip }) {
  return (
    <View style={styles.step}>
      <FlowHeader title="Vehicle registration" onBack={onBack} />

      <View style={styles.body}>
        <View style={styles.entry}>
          <RegPlateInput value={registration} onChangeText={onChangeRegistration} autoFocus />
          <Pressable
            style={styles.skip}
            onPress={onSkip}
            accessibilityRole="button"
            accessibilityLabel="Continue without vehicle registration"
          >
            <Text style={styles.skipLabel}>Continue without vehicle registration</Text>
            <Feather name="chevron-right" size={16} color={color.text.neutralBold} />
          </Pressable>
        </View>

        <ContinueButton
          disabled={registration.trim().length < MIN_REG_LENGTH}
          onPress={onContinue}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  step: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  body: {
    flex: 1,
    width: 353,
    justifyContent: 'space-between',
    paddingTop: 64,
    paddingBottom: spacing[4],
  },
  entry: {
    gap: spacing[4],
  },
  skip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
  skipLabel: {
    ...font.subheadlineRegular,
    color: color.text.neutralBold,
  },
});
