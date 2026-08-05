import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackButton from '../components/BackButton';
import Checkbox from '../components/Checkbox';
import ApplePaySheet from '../components/vehicle/ApplePaySheet';
import PurchaseConfirmSheet from '../components/vehicle/PurchaseConfirmSheet';
import { Feather } from '@expo/vector-icons';
import { ADVERT_PACKAGES } from '../data/sell';
import { color, font, radius, spacing } from '../theme/tokens';

const ROCKET = require('../assets/rocket.png');

// Three groups of four bars — grey (Basic), light (Featured), dark (Spotlight) —
// climbing left to right, with a rocket riding the trend.
const GROUPS = [
  { fill: '#c9cdc9', heights: [26, 26, 26, 26] },
  { fill: '#8fe3b4', heights: [58, 66, 74, 82] },
  { fill: '#1f9d57', heights: [104, 118, 132, 148] },
];
const CHART_H = 160;

function ViewsChart() {
  const [w, setW] = useState(0);
  const bars = GROUPS.flatMap((g) => g.heights.map((h) => ({ h, fill: g.fill })));
  const n = bars.length;
  const gap = 6;
  const groupGap = 14;
  const totalGaps = gap * (n - 1) + (groupGap - gap) * 2;
  const barW = w ? Math.max((w - totalGaps) / n, 2) : 0;
  let x = 0;
  const laid = bars.map((b, i) => {
    if (i > 0) x += barW + (i % 4 === 0 ? groupGap : gap);
    return { ...b, x };
  });
  return (
    <View style={styles.chart} onLayout={(e) => setW(e.nativeEvent.layout.width)}>
      {w > 0 && (
        <Svg width={w} height={CHART_H}>
          {laid.map((b, i) => (
            <Rect key={i} x={b.x} y={CHART_H - b.h} width={barW} height={b.h} rx={3} fill={b.fill} />
          ))}
        </Svg>
      )}
      <Image source={ROCKET} style={styles.rocket} resizeMode="contain" pointerEvents="none" />
    </View>
  );
}

function PackageOption({ pkg, selected, onSelect }) {
  return (
    <Pressable
      style={[styles.option, selected && styles.optionSelected]}
      onPress={onSelect}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={pkg.name}
    >
      {pkg.badge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeLabel}>{pkg.badge}</Text>
        </View>
      ) : null}
      <View style={styles.optionBody}>
        <Text style={styles.optionName}>{pkg.name}</Text>
        {pkg.description ? <Text style={styles.optionDesc}>{pkg.description}</Text> : null}
        {pkg.priceLabel ? <Text style={styles.optionPrice}>{pkg.priceLabel}</Text> : null}
      </View>
      <Checkbox rounded checked={selected} onChange={onSelect} accessibilityLabel={pkg.name} />
    </Pressable>
  );
}

/** Promote-the-advert step: pick a listing package, then pay for any boost. */
export default function AdvertPackageScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const id = route.params?.id;
  const [selectedId, setSelectedId] = useState('basic');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const selected = ADVERT_PACKAGES.find((p) => p.id === selectedId) ?? ADVERT_PACKAGES[0];

  const finish = () => {
    setPayOpen(false);
    navigation.navigate('AdvertSuccess', { id, packageId: selected.id });
  };

  const onContinue = () => {
    // A free Basic listing has nothing to pay for — skip straight to submitted.
    if (selected.amount > 0) setConfirmOpen(true);
    else navigation.navigate('AdvertSuccess', { id, packageId: selected.id });
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 32) }]}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Advert package</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.chartTitle}>DAILY LISTING VIEWS</Text>
        <ViewsChart />
        <View style={styles.chartLabels}>
          {ADVERT_PACKAGES.map((p) => (
            <Text key={p.id} style={styles.chartLabel}>
              {p.name}
            </Text>
          ))}
        </View>

        <View style={styles.options}>
          {ADVERT_PACKAGES.map((p) => (
            <PackageOption key={p.id} pkg={p} selected={p.id === selectedId} onSelect={() => setSelectedId(p.id)} />
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom || spacing[4] }]}>
        <Pressable style={styles.continue} onPress={onContinue} accessibilityRole="button" accessibilityLabel="Continue">
          <Text style={styles.continueLabel}>Continue</Text>
          <Feather name="arrow-right" size={18} color={color.text.inverseBold} />
        </Pressable>
      </View>

      <PurchaseConfirmSheet
        visible={confirmOpen}
        vehicleId={id}
        pkg={selected}
        onClose={() => setConfirmOpen(false)}
        onContinue={() => {
          setConfirmOpen(false);
          setPayOpen(true);
        }}
      />
      <ApplePaySheet visible={payOpen} amount={selected.amount} onClose={() => setPayOpen(false)} onPaid={finish} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.background.neutralWhite },
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
  headerSpacer: { width: 24 },
  content: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
  },
  chartTitle: {
    ...font.labelSm,
    color: color.text.neutralRegular,
    letterSpacing: 0.6,
    textAlign: 'center',
  },
  chart: {
    height: CHART_H,
    marginTop: spacing[4],
    justifyContent: 'flex-end',
  },
  rocket: {
    position: 'absolute',
    left: '22%',
    top: 54,
    width: 48,
    height: 46,
  },
  chartLabels: {
    flexDirection: 'row',
    marginTop: spacing[2],
  },
  chartLabel: {
    ...font.subheadlineRegular,
    color: color.text.neutralBold,
    flex: 1,
    textAlign: 'center',
  },
  options: {
    marginTop: spacing[5],
    gap: spacing[3],
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    padding: spacing[4],
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: color.border.neutralSubtle,
    backgroundColor: color.background.neutralWhite,
  },
  optionSelected: {
    borderColor: color.border.brandPrimaryRegular ?? color.background.brandPrimaryRegular,
    borderWidth: 1.5,
  },
  badge: {
    position: 'absolute',
    top: -10,
    right: spacing[4],
    paddingHorizontal: spacing[2.5],
    paddingVertical: 3,
    borderRadius: radius.full,
    backgroundColor: color.background.brandPrimaryRegular,
  },
  badgeLabel: {
    ...font.labelSm,
    color: color.text.inverseBold,
    letterSpacing: 0.4,
  },
  optionBody: {
    flex: 1,
    gap: 2,
  },
  optionName: {
    ...font.bodyEmphasized,
    color: color.text.neutralBold,
  },
  optionDesc: {
    ...font.subheadlineRegular,
    color: color.text.neutralBold,
  },
  optionPrice: {
    ...font.subheadlineRegular,
    color: color.text.neutralRegular,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: color.border.neutralRegular,
  },
  footer: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
  },
  continue: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    minHeight: 52,
    borderRadius: radius.xl,
    backgroundColor: color.background.brandPrimaryRegular,
  },
  continueLabel: {
    ...font.bodyEmphasized,
    color: color.text.inverseBold,
  },
});
