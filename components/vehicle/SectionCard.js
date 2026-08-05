import { StyleSheet, Text, View } from 'react-native';
import { color, font, radius, spacing } from '../../theme/tokens';

/** The subtle rounded card every Vehicle Details section sits in. */
export default function SectionCard({ title, children, style, gap = spacing[3] }) {
  return (
    <View style={[styles.card, style]}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      <View style={{ gap }}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.background.neutralSubtle,
    borderRadius: radius.lg,
    padding: spacing[4],
    gap: spacing[3],
    overflow: 'hidden',
  },
  title: {
    ...font.bodyEmphasized,
    color: color.text.neutralBold,
  },
});
