import { Feather } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackButton from '../components/BackButton';
import Button from '../components/vehicle/Button';
import { CURRENCIES } from '../data/sell';
import { getVehicleDetails } from '../data/vehicleDetails';
import { useAdvertDraft } from '../state/advertDraft';
import { color, font, radius, spacing } from '../theme/tokens';

const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const THUMB = 18;

export default function PriceScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const id = route.params?.id;
  const vehicle = getVehicleDetails(id);
  const { low, high, recommended } = vehicle.sale;
  const estimateValue = vehicle.valuation.value;
  const { price, currency: savedCurrency, setPrice } = useAdvertDraft(id);

  // Everything is held in GBP; the currency toggle only changes how it's shown.
  const [gbp, setGbp] = useState(price ?? recommended);
  const [currency, setCurrency] = useState(savedCurrency ?? 'GBP');
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [trackWidth, setTrackWidth] = useState(0);

  const cur = CURRENCIES.find((c) => c.id === currency) ?? CURRENCIES[0];
  const shown = Math.round(gbp * cur.rate);
  const ratio = high > low ? (gbp - low) / (high - low) : 0.5;

  const setFromRatio = (r) => setGbp(Math.round(low + clamp(r, 0, 1) * (high - low)));

  const track = useRef(null);
  const pan = (evt) => {
    if (!trackWidth) return;
    setFromRatio(evt.nativeEvent.locationX / trackWidth);
  };

  const commitEdit = () => {
    const typed = Number(String(draft).replace(/[^0-9]/g, ''));
    if (typed) setGbp(clamp(Math.round(typed / cur.rate), low, high));
    setEditing(false);
  };

  const done = () => {
    setPrice(gbp, currency);
    navigation.goBack();
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 32) }]}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Price</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <View style={styles.estimateLabelRow}>
          <Text style={styles.estimateLabel}>ESTIMATED VALUE</Text>
          <Feather name="info" size={14} color={color.icon.neutralRegular} />
        </View>
        <Text style={styles.range}>{estimateValue}</Text>
        <Text style={styles.blurb}>
          Based on the information you've given us, recent sales and current market trends we recommend an
          asking price of {cur.symbol}
          {Math.round(recommended * cur.rate).toLocaleString('en-GB')} for your {vehicle.make || 'vehicle'}.
        </Text>

        <View style={styles.priceBlock}>
          <View style={styles.priceRow}>
            <Text style={styles.symbol}>{cur.symbol}</Text>
            {editing ? (
              <TextInput
                style={styles.priceInput}
                value={draft}
                onChangeText={setDraft}
                onBlur={commitEdit}
                onSubmitEditing={commitEdit}
                keyboardType="number-pad"
                autoFocus
                accessibilityLabel="Asking price"
              />
            ) : (
              <Pressable
                onPress={() => {
                  setDraft(String(shown));
                  setEditing(true);
                }}
                accessibilityRole="button"
                accessibilityLabel="Edit asking price"
              >
                <Text style={styles.price}>{shown.toLocaleString('en-GB')}</Text>
              </Pressable>
            )}
          </View>

          <View
            ref={track}
            style={styles.track}
            onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderGrant={pan}
            onResponderMove={pan}
          >
            <View style={styles.trackLine} />
            <View style={styles.trackFill} />
            <View style={[styles.thumb, { left: clamp(ratio, 0, 1) * (trackWidth - THUMB) }]} />
          </View>
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>Quicker sale</Text>
            <Text style={styles.sliderLabel}>Happy to wait</Text>
          </View>

          <View style={styles.currencies}>
            {CURRENCIES.map((c) => {
              const active = c.id === currency;
              return (
                <Pressable
                  key={c.id}
                  style={[styles.currency, active && styles.currencyActive]}
                  onPress={() => setCurrency(c.id)}
                  accessibilityRole="button"
                  accessibilityLabel={c.label}
                >
                  <Text style={[styles.currencyLabel, active && styles.currencyLabelActive]}>{c.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom || spacing[4] }]}>
        <Button label="Done" onPress={done} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.background.neutralWhite,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[3],
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[3],
  },
  headerTitle: {
    ...font.bodyEmphasized,
    color: color.text.neutralBold,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing[4],
    paddingTop: spacing[2],
  },
  estimateLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1.5],
  },
  estimateLabel: {
    ...font.labelSm,
    color: color.text.neutralRegular,
    letterSpacing: 0.6,
  },
  range: {
    ...font.title3Emphasized,
    color: color.text.neutralBold,
    marginTop: spacing[1],
  },
  blurb: {
    ...font.subheadlineRegular,
    color: color.text.neutralRegular,
    marginTop: spacing[2],
  },
  priceBlock: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing[3],
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
  symbol: {
    ...font.title3Emphasized,
    color: color.text.neutralBold,
  },
  price: {
    fontSize: 48,
    fontWeight: '700',
    color: color.text.neutralBold,
  },
  priceInput: {
    fontSize: 48,
    fontWeight: '700',
    color: color.text.neutralBold,
    minWidth: 180,
    padding: 0,
    textAlign: 'center',
    // No focus ring while typing, same as the registration field.
    outlineStyle: 'none',
  },
  track: {
    height: 36,
    justifyContent: 'center',
    marginTop: spacing[2],
  },
  trackLine: {
    height: 1,
    backgroundColor: color.border.neutralRegular,
  },
  trackFill: {
    position: 'absolute',
    left: 0,
    height: 1,
  },
  thumb: {
    position: 'absolute',
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    backgroundColor: color.background.brandPrimaryRegular,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    ...font.subheadlineRegular,
    fontWeight: '600',
    color: color.text.neutralBold,
  },
  currencies: {
    flexDirection: 'row',
    alignSelf: 'center',
    gap: spacing[1],
    padding: spacing[1],
    borderRadius: radius.full,
    backgroundColor: color.background.neutralSubtle,
    marginTop: spacing[4],
  },
  currency: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radius.full,
  },
  currencyActive: {
    backgroundColor: color.background.brandPrimaryRegular,
  },
  currencyLabel: {
    ...font.subheadlineRegular,
    fontWeight: '600',
    color: color.text.neutralBold,
  },
  currencyLabelActive: {
    color: color.text.inverseBold,
  },
  footer: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
  },
});
