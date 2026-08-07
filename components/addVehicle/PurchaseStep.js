import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { CURRENCIES, PURCHASE_SOURCES } from '../../data/addVehicle';
import { borderWidth, color, font, radius, spacing } from '../../theme/tokens';
import ContinueButton from './ContinueButton';
import DatePickerSheet from '../DatePickerSheet';
import { SelectField, borderFor } from './Field';
import FlowHeader from './FlowHeader';
import OptionSheet from './OptionSheet';

/**
 * Purchase details step — collected before condition so the vehicle's detail
 * page opens with its purchase (and insurance renewal) already filled in.
 */
export default function PurchaseStep({ purchase, onChange, onBack, onContinue, onPickerOpenChange }) {
  const [picker, setPicker] = useState(null);
  const [yearPickerOpen, setYearPickerOpen] = useState(false);
  const [priceFocused, setPriceFocused] = useState(false);
  const floatPrice = priceFocused || !!purchase.price;
  const openYearPicker = (next) => {
    setYearPickerOpen(next);
    onPickerOpenChange?.(next);
  };
  const complete =
    String(purchase.year).trim().length > 0 &&
    String(purchase.price).trim().length > 0 &&
    Boolean(purchase.source);

  return (
    <View style={styles.step}>
      <FlowHeader title="Purchase details" onBack={onBack} />

      <View style={styles.body}>
        <Pressable
          style={[styles.field, { borderColor: borderFor(yearPickerOpen, !!purchase.year) }]}
          onPress={() => openYearPicker(true)}
          accessibilityRole="button"
          accessibilityLabel="Purchase year"
        >
          {purchase.year ? <Text style={styles.floatLabel}>Purchase year</Text> : null}
          <Text style={[styles.input, !purchase.year && styles.placeholder]}>
            {purchase.year || 'Purchase year'}
          </Text>
        </Pressable>

        <View style={[styles.field, { borderColor: borderFor(priceFocused, !!purchase.price) }]}>
          {floatPrice ? <Text style={styles.floatLabel}>Purchase price</Text> : null}
          <View style={styles.priceRow}>
            <TextInput
              style={[styles.input, styles.inputFlex]}
              value={purchase.price}
              onChangeText={(t) => onChange('price', t.replace(/[^0-9]/g, ''))}
              onFocus={() => setPriceFocused(true)}
              onBlur={() => setPriceFocused(false)}
              placeholder={floatPrice ? '' : 'Purchase price'}
              placeholderTextColor={color.text.neutralRegular}
              keyboardType="number-pad"
              accessibilityLabel="Purchase price"
            />
            <Pressable
              style={styles.currency}
              onPress={() => setPicker('currency')}
              accessibilityRole="button"
              accessibilityLabel={`Currency: ${purchase.currency}`}
            >
              <Text style={styles.currencyLabel}>{purchase.currency}</Text>
              <Feather name="chevron-down" size={20} color={color.icon.neutralBold} />
            </Pressable>
          </View>
        </View>

        <SelectField
          label="Purchased from"
          value={purchase.source}
          active={picker === 'source'}
          onPress={() => setPicker('source')}
        />
      </View>

      <View style={styles.footer}>
        <ContinueButton disabled={!complete} onPress={onContinue} />
      </View>

      <OptionSheet
        visible={picker === 'currency'}
        title="Currency"
        options={CURRENCIES.map((c) => c.code)}
        value={purchase.currency}
        onClose={() => setPicker(null)}
        onSelect={(code) => {
          onChange('currency', code);
          setPicker(null);
        }}
      />
      <OptionSheet
        visible={picker === 'source'}
        title="Purchased from"
        options={PURCHASE_SOURCES}
        value={purchase.source}
        onClose={() => setPicker(null)}
        onSelect={(option) => {
          onChange('source', option);
          setPicker(null);
        }}
      />
      <DatePickerSheet
        visible={yearPickerOpen}
        mode="year"
        value={purchase.year}
        onClose={() => openYearPicker(false)}
        onConfirm={(v) => onChange('year', v)}
      />
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
    gap: spacing[3],
  },
  field: {
    justifyContent: 'center',
    gap: 2,
    minHeight: 56,
    backgroundColor: color.background.neutralWhite,
    borderWidth: borderWidth.xs,
    borderColor: color.border.neutralSubtle,
    borderRadius: radius.lg,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
  },
  floatLabel: {
    ...font.bodyXsRegular,
    color: color.text.neutralRegular,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  input: {
    minWidth: 0,
    padding: 0,
    ...font.calloutRegular,
    color: color.text.neutralBold,
    outlineStyle: 'none',
  },
  placeholder: {
    color: color.text.neutralRegular,
  },
  inputFlex: {
    flex: 1,
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
    paddingTop: spacing[4],
  },
});
