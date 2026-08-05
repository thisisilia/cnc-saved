import { StyleSheet, Text, View } from 'react-native';
import { color, font, spacing } from '../../theme/tokens';

/**
 * Centred icon + title + subtitle shown inside a Saved section card when it has
 * nothing in it yet. The icon is passed in so each card keeps its own mark.
 */
export default function EmptyPrompt({ icon, title, subtitle }) {
  return (
    <View style={styles.wrap}>
      {icon}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1.5],
    paddingVertical: spacing[3],
  },
  title: {
    ...font.calloutEmphasized,
    color: color.text.neutralBold,
    textAlign: 'center',
    marginTop: spacing[1],
  },
  subtitle: {
    ...font.bodySmRegular,
    color: color.text.neutralRegular,
    textAlign: 'center',
  },
});
