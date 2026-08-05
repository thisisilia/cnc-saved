import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ContinueButton from '../components/addVehicle/ContinueButton';
import { SelectField } from '../components/addVehicle/Field';
import FlowHeader from '../components/addVehicle/FlowHeader';
import OptionSheet from '../components/addVehicle/OptionSheet';
import { CURRENCIES, PURCHASE_SOURCES } from '../data/addVehicle';
import { useAddVehicleDraft } from '../state/addVehicleDraft';
import { borderWidth, color, font, radius, spacing } from '../theme/tokens';

/**
 * PRD step 2 — purchase information.
 *
 * Reached from the Add vehicle checklist, and returns the values so the row can
 * be marked complete. Re-opening it carries the saved values back in, so the
 * user edits rather than re-enters.
 */
export default function PurchaseInformationScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { purchase, setPurchase } = useAddVehicleDraft();
  const saved = purchase ?? {};

  const [year, setYear] = useState(saved.year ?? '');
  const [price, setPrice] = useState(saved.price ?? '');
  const [currency, setCurrency] = useState(saved.currency ?? 'GBP');
  const [source, setSource] = useState(saved.source ?? '');
  const [picker, setPicker] = useState(null);

  const complete = year.trim() && price.trim() && source;

  const save = () => {
    setPurchase({ year, price, currency, source });
    navigation.goBack();
  };

  return (
    <View style={styles.screen}>
      <FlowHeader
        title="Purchase information"
        backIcon="chevron-left"
        onBack={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        style={styles.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.field}>
            <TextInput
              style={styles.input}
              value={year}
              onChangeText={(text) => setYear(text.replace(/[^0-9]/g, ''))}
              placeholder="Purchase year"
              placeholderTextColor={color.text.neutralRegular}
              keyboardType="number-pad"
              maxLength={4}
              accessibilityLabel="Purchase year"
            />
          </View>

          <View style={styles.field}>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={(text) => setPrice(text.replace(/[^0-9]/g, ''))}
              placeholder="Purchase price"
              placeholderTextColor={color.text.neutralRegular}
              keyboardType="number-pad"
              accessibilityLabel="Purchase price"
            />
            <Pressable
              style={styles.currency}
              onPress={() => setPicker('currency')}
              accessibilityRole="button"
              accessibilityLabel={`Currency: ${currency}`}
            >
              <Text style={styles.currencyLabel}>{currency}</Text>
              <Feather name="chevron-down" size={20} color={color.icon.neutralBold} />
            </Pressable>
          </View>

          <SelectField
            label="Purchased from"
            value={source}
            onPress={() => setPicker('source')}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={[styles.footer, { paddingBottom: insets.bottom || spacing[4] }]}>
        <ContinueButton disabled={!complete} onPress={save} />
      </View>

      <OptionSheet
        visible={picker === 'currency'}
        title="Currency"
        options={CURRENCIES.map((c) => c.code)}
        value={currency}
        onClose={() => setPicker(null)}
        onSelect={(code) => {
          setCurrency(code);
          setPicker(null);
        }}
      />

      <OptionSheet
        visible={picker === 'source'}
        title="Purchased from"
        options={PURCHASE_SOURCES}
        value={source}
        onClose={() => setPicker(null)}
        onSelect={(option) => {
          setSource(option);
          setPicker(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.background.neutralWhite,
  },
  fill: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing[4],
    gap: spacing[3],
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    minHeight: 56,
    backgroundColor: color.background.neutralWhite,
    borderWidth: borderWidth.xs,
    borderColor: color.border.neutralSubtle,
    borderRadius: radius.lg,
    paddingHorizontal: spacing[4],
  },
  input: {
    flex: 1,
    minWidth: 0,
    ...font.calloutRegular,
    color: color.text.neutralBold,
    outlineStyle: 'none',
  },
  currency: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  currencyLabel: {
    ...font.calloutRegular,
    color: color.text.neutralRegular,
  },
  footer: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
  },
});
