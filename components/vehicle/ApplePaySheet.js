import { Feather } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { APPLE_PAY, money } from '../../data/sell';
import { color, font, spacing } from '../../theme/tokens';
import BottomSheet from '../BottomSheet';

const IOS_BLUE = '#0a84ff';

function Row({ label, children, last }) {
  return (
    <View style={[styles.row, last && styles.rowLast]}>
      {label ? <Text style={styles.rowLabel}>{label}</Text> : null}
      <View style={styles.rowValue}>{children}</View>
      <Feather name="chevron-right" size={18} color={IOS_BLUE} />
    </View>
  );
}

/**
 * Mock of the native Apple Pay sheet. It authenticates itself after a short
 * delay — `onPaid` fires to advance the flow, as a Face ID confirmation would.
 */
export default function ApplePaySheet({ visible, amount, onClose, onPaid }) {
  useEffect(() => {
    if (!visible) return undefined;
    const timer = setTimeout(() => onPaid(), 2000);
    return () => clearTimeout(timer);
  }, [visible, onPaid]);

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.body}>
        <View style={styles.header}>
          <Text style={styles.applePay}> Pay</Text>
          <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Cancel">
            <Text style={styles.cancel}>Cancel</Text>
          </Pressable>
        </View>

        <Row>
          <View style={styles.mastercard}>
            <View style={[styles.mcCircle, { backgroundColor: '#eb001b' }]} />
            <View style={[styles.mcCircle, styles.mcCircleRight, { backgroundColor: '#f79e1b' }]} />
          </View>
          <Text style={styles.cardText}>
            {APPLE_PAY.card} {APPLE_PAY.cardTail}
          </Text>
        </Row>

        <Row label="ADDRESS">
          <View>
            {APPLE_PAY.address.map((line) => (
              <Text key={line} style={styles.multiline}>
                {line}
              </Text>
            ))}
          </View>
        </Row>

        <Row label="CONTACT" last>
          <Text style={styles.contact}>{APPLE_PAY.contact}</Text>
        </Row>

        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalMuted}>SUBTOTAL</Text>
            <Text style={styles.totalMutedValue}>{money(amount)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalMuted}>{APPLE_PAY.merchant}</Text>
            <Text style={styles.totalValue}>{money(amount)}</Text>
          </View>
        </View>

        <View style={styles.faceId}>
          <View style={styles.faceIdCircle}>
            <Feather name="smile" size={26} color={IOS_BLUE} />
          </View>
          <Text style={styles.faceIdHint}>Confirm with Face ID</Text>
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  body: {
    alignSelf: 'stretch',
    paddingHorizontal: spacing[5],
    paddingTop: spacing[2],
    paddingBottom: spacing[4],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing[3],
  },
  applePay: {
    ...font.title3Emphasized,
    color: color.text.neutralBold,
  },
  cancel: {
    ...font.bodyEmphasized,
    color: IOS_BLUE,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[3],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: color.border.neutralRegular,
  },
  rowLast: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color.border.neutralRegular,
  },
  rowLabel: {
    ...font.bodyXsRegular,
    color: color.text.neutralRegular,
    width: 64,
  },
  rowValue: {
    flex: 1,
  },
  mastercard: {
    width: 34,
    height: 22,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mcCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  mcCircleRight: {
    marginLeft: -8,
    opacity: 0.9,
  },
  cardText: {
    ...font.subheadlineRegular,
    color: color.text.neutralBold,
    flex: 1,
  },
  multiline: {
    ...font.subheadlineRegular,
    color: color.text.neutralBold,
    lineHeight: 20,
  },
  contact: {
    ...font.subheadlineRegular,
    color: color.text.neutralBold,
  },
  totals: {
    paddingTop: spacing[3],
    gap: spacing[2],
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalMuted: {
    ...font.subheadlineRegular,
    color: color.text.neutralRegular,
  },
  totalMutedValue: {
    ...font.subheadlineRegular,
    color: color.text.neutralRegular,
  },
  totalValue: {
    ...font.title3Emphasized,
    color: color.text.neutralBold,
  },
  faceId: {
    alignItems: 'center',
    gap: spacing[2],
    marginTop: spacing[4],
  },
  faceIdCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: IOS_BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faceIdHint: {
    ...font.bodyXsRegular,
    color: color.text.neutralRegular,
  },
});
