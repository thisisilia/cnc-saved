import { Feather } from '@expo/vector-icons';
import { Fragment, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SelectField, TextField, borderFor } from '../components/addVehicle/Field';
import PickerField from '../components/addVehicle/PickerField';
import DatePickerSheet from '../components/DatePickerSheet';
import MileageBlock from '../components/addVehicle/MileageBlock';
import OptionSheet from '../components/addVehicle/OptionSheet';
import NavHeader from '../components/NavHeader';
import Button from '../components/vehicle/Button';
import { COLOUR_OPTIONS, CURRENCIES, GEAR_OPTIONS, PURCHASE_SOURCES, RADIO_GROUPS } from '../data/addVehicle';
import { getVehicleDetails } from '../data/vehicleDetails';
import { applyVehicleEdits, useVehicleEdits } from '../state/vehicleEdits';
import { borderWidth, color, font, radius, spacing } from '../theme/tokens';

/** Field name per car-info id (the value lives in `label`). */
const CAR_INFO_LABELS = {
  registration: 'Vehicle registration',
  steering: 'Steering position',
  transmission: 'Transmission type',
  engine: 'Engine capacity',
  year: 'Year of manufacture',
  fuel: 'Fuel type',
  colour: 'Colour',
};

const optionsFor = (id) => RADIO_GROUPS.find((g) => g.id === id)?.options ?? [];

/** Car-info rows shown as pickers rather than free text. */
const CAR_INFO_OPTIONS = {
  steering: optionsFor('steering'),
  fuel: optionsFor('fuel'),
  colour: COLOUR_OPTIONS,
};

const splitMileage = (value = '') => {
  const match = String(value).match(/^([\d,.]+)\s*(miles|km)?/i);
  return {
    amount: match?.[1]?.replace(/,/g, '') ?? '',
    unit: match?.[2]?.toLowerCase() === 'km' ? 'km' : 'miles',
  };
};
const joinMileage = (amount, unit) => {
  const n = Number(String(amount).replace(/[^0-9]/g, ''));
  return `${Number.isFinite(n) && n ? n.toLocaleString('en-GB') : amount} ${unit}`;
};

const SECTION_TITLES = {
  details: 'Edit vehicle details',
  mileage: 'Update mileage',
  purchase: 'Purchase details',
};

const symbolFor = (code) => CURRENCIES.find((c) => c.code === code)?.symbol ?? '£';
const digits = (value) => String(value ?? '').replace(/[^0-9]/g, '');

/**
 * Focused editor for one part of a saved vehicle, opened from the Edit details
 * hub. Photos and history have their own richer flows; this covers the vehicle
 * details form, its mileage, and purchase information. Each section saves only
 * its own data, so opening one never clobbers another.
 */
export default function EditVehicleScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { getEdits, saveEdits } = useVehicleEdits();
  const id = route.params?.id;
  const section = route.params?.section ?? 'details';

  const vehicle = useMemo(() => applyVehicleEdits(getVehicleDetails(id), getEdits(id)), [id, getEdits]);

  const [carInfo, setCarInfo] = useState(vehicle.carInfo ?? []);

  // Purchase seeded from the vehicle, split into the fields the form edits.
  const seededPurchase = vehicle.purchase;
  const seededPrice = seededPurchase?.rows?.find((r) => r.id === 'price')?.value ?? '';
  const [purchaseYear, setPurchaseYear] = useState(
    (seededPurchase?.rows?.find((r) => r.id === 'acquired')?.value ?? '').match(/\d{4}/)?.[0] ?? ''
  );
  const [purchasePrice, setPurchasePrice] = useState(digits(seededPrice));
  const [currency, setCurrency] = useState(seededPurchase?.currency ?? 'GBP');
  const [source, setSource] = useState(seededPurchase?.rows?.find((r) => r.id === 'source')?.value ?? '');
  const [priceFocused, setPriceFocused] = useState(false);
  const floatPrice = priceFocused || !!purchasePrice;

  const [picker, setPicker] = useState(null);
  // The date/year wheel opens at the screen root (not inside the ScrollView, whose
  // overflow would clip its full-screen scrim), and hides the Save-changes footer.
  const [datePicker, setDatePicker] = useState(null);

  const carInfoValue = (fieldId) => carInfo.find((item) => item.id === fieldId)?.label ?? '';
  const changeCarInfo = (fieldId, label) =>
    setCarInfo((prev) => {
      if (prev.some((item) => item.id === fieldId)) {
        return prev.map((item) => (item.id === fieldId ? { ...item, label } : item));
      }
      return [...prev, { id: fieldId, label }];
    });

  const [transmissionType, gearCount] = (() => {
    const parts = carInfoValue('transmission').split(',').map((p) => p.trim());
    return [parts[0] ?? '', parts[1] ?? ''];
  })();
  const setTransmission = (type, gears) =>
    changeCarInfo('transmission', [type, gears].filter(Boolean).join(', '));

  const odometer = splitMileage(carInfoValue('odometer'));
  const openPicker = (title, options, value, onSelect) => setPicker({ title, options, value, onSelect });

  const save = () => {
    if (section === 'purchase') {
      saveEdits(id, {
        purchase: {
          title: 'Purchase information',
          currency,
          rows: [
            { id: 'acquired', label: 'Purchase year', value: purchaseYear },
            {
              id: 'price',
              label: 'Purchase price',
              value: `${symbolFor(currency)}${Number(digits(purchasePrice) || 0).toLocaleString('en-GB')}`,
            },
            { id: 'source', label: 'Purchased from', value: source },
          ],
        },
      });
    } else {
      // details + mileage both edit the car-info grid.
      saveEdits(id, { carInfo });
    }
    navigation.goBack();
  };

  // Fields for the vehicle-details form: the spec rows, minus the odometer
  // (mileage has its own editor) and the registration order kept first.
  const detailFields = carInfo.filter((item) => item.id !== 'odometer');

  return (
    <View style={styles.screen}>
      <NavHeader title={SECTION_TITLES[section] ?? 'Edit vehicle'} onBack={() => navigation.goBack()} />

      <KeyboardAvoidingView style={styles.fill} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {section === 'details' &&
            detailFields.map((item) => {
              if (item.id === 'transmission') {
                return (
                  <Fragment key={item.id}>
                    <SelectField
                      label="Transmission type"
                      value={transmissionType}
                      onPress={() =>
                        openPicker('Transmission type', optionsFor('transmission'), transmissionType, (v) =>
                          setTransmission(v, gearCount)
                        )
                      }
                    />
                    <SelectField
                      label="Gear count"
                      value={gearCount}
                      onPress={() =>
                        openPicker('Gear count', GEAR_OPTIONS, gearCount, (v) => setTransmission(transmissionType, v))
                      }
                    />
                  </Fragment>
                );
              }

              const options = CAR_INFO_OPTIONS[item.id];
              const label = CAR_INFO_LABELS[item.id] ?? item.id;
              return options ? (
                <SelectField
                  key={item.id}
                  label={label}
                  value={item.label}
                  onPress={() => openPicker(label, options, item.label, (v) => changeCarInfo(item.id, v))}
                />
              ) : item.id === 'year' ? (
                <PickerField
                  key={item.id}
                  label={label}
                  value={item.label}
                  mode="year"
                  onChange={(v) => changeCarInfo('year', v)}
                  onRequestOpen={setDatePicker}
                />
              ) : (
                <TextField
                  key={item.id}
                  label={label}
                  value={item.label}
                  onChangeText={(text) => changeCarInfo(item.id, text)}
                  editable={item.id !== 'registration'}
                />
              );
            })}

          {section === 'mileage' && (
            <MileageBlock
              label="Odometer reading"
              mileage={odometer.amount}
              onChangeMileage={(text) => changeCarInfo('odometer', joinMileage(text, odometer.unit))}
              unit={odometer.unit}
              onChangeUnit={(unit) => changeCarInfo('odometer', joinMileage(odometer.amount, unit))}
              hideNotApplicable
            />
          )}

          {section === 'purchase' && (
            <>
              <PickerField
                label="Purchase year"
                value={purchaseYear}
                mode="year"
                onChange={setPurchaseYear}
                onRequestOpen={setDatePicker}
              />
              {/* Amount and currency share one field, as in the add flow. */}
              <View
                style={[
                  styles.priceField,
                  { borderColor: borderFor(priceFocused, !!purchasePrice) },
                ]}
              >
                {floatPrice ? <Text style={styles.priceFloatLabel}>Purchase price</Text> : null}
                <View style={styles.priceRow}>
                  <TextInput
                    style={styles.priceInput}
                    value={purchasePrice}
                    onChangeText={(text) => setPurchasePrice(text.replace(/[^0-9]/g, ''))}
                    onFocus={() => setPriceFocused(true)}
                    onBlur={() => setPriceFocused(false)}
                    placeholder={floatPrice ? '' : 'Purchase price'}
                    placeholderTextColor={color.text.neutralRegular}
                    keyboardType="number-pad"
                    accessibilityLabel="Purchase price"
                  />
                  <Pressable
                    style={styles.currency}
                    onPress={() =>
                      openPicker('Currency', CURRENCIES.map((c) => c.code), currency, setCurrency)
                    }
                    accessibilityRole="button"
                    accessibilityLabel={`Currency: ${currency}`}
                  >
                    <Text style={styles.currencyLabel}>{currency}</Text>
                    <Feather name="chevron-down" size={20} color={color.icon.neutralBold} />
                  </Pressable>
                </View>
              </View>
              <SelectField
                label="Purchased from"
                value={source}
                onPress={() => openPicker('Purchased from', PURCHASE_SOURCES, source, setSource)}
              />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {!datePicker && (
        <View style={[styles.footer, { paddingBottom: insets.bottom || spacing[4] }]}>
          <Button label="Save changes" onPress={save} />
        </View>
      )}

      <OptionSheet
        visible={Boolean(picker)}
        title={picker?.title}
        options={picker?.options}
        value={picker?.value}
        onClose={() => setPicker(null)}
        onSelect={(option) => {
          picker?.onSelect(option);
          setPicker(null);
        }}
      />

      <DatePickerSheet
        visible={Boolean(datePicker)}
        mode={datePicker?.mode ?? 'date'}
        value={datePicker?.value}
        onClose={() => setDatePicker(null)}
        onConfirm={(v) => datePicker?.onConfirm(v)}
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
    paddingBottom: spacing[6],
    gap: spacing[3],
  },
  priceField: {
    justifyContent: 'center',
    gap: 2,
    minHeight: 52,
    backgroundColor: color.background.neutralWhite,
    borderWidth: borderWidth.xs,
    borderColor: color.border.neutralSubtle,
    borderRadius: radius.md,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  priceFloatLabel: {
    ...font.bodyXsRegular,
    color: color.text.neutralRegular,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  priceInput: {
    flex: 1,
    minWidth: 0,
    padding: 0,
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
    color: color.text.neutralBold,
  },
  footer: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
  },
});
