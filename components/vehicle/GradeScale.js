import { StyleSheet, Text, View } from 'react-native';
import { color, font, radius, spacing } from '../../theme/tokens';
import AppIcon from '../icons/AppIcon';

/**
 * Condition scale: a rail with a marker per grade, and the vehicle's own grade
 * called out. Laid out as equal columns so the markers line up with their
 * labels at any width.
 *
 * Shared by the valuation sheet (behind the vehicle detail info icon) and the
 * valuation detail page, which shows it inline.
 */
export default function GradeScale({ grades }) {
  return (
    <View style={styles.scale}>
      <View style={styles.track}>
        <View style={styles.rail} />
        <View style={styles.markers}>
          {grades.map((grade) => (
            <View key={grade.id} style={styles.markerCell}>
              {grade.active ? (
                <View style={styles.markerActive}>
                  <AppIcon name="seal" size={20} color={color.text.inverseBold} />
                </View>
              ) : (
                <View style={styles.marker} />
              )}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.labelRow}>
        {grades.map((grade) => (
          <Text key={grade.id} style={[styles.gradePrice, grade.active && styles.gradeActiveText]}>
            {grade.price}
          </Text>
        ))}
      </View>
      <View style={styles.labelRow}>
        {grades.map((grade) => (
          <Text key={grade.id} style={[styles.gradeLabel, grade.active && styles.gradeActiveText]}>
            {grade.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scale: {
    gap: spacing[1],
  },
  track: {
    height: 24,
    justifyContent: 'center',
  },
  rail: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    borderRadius: 6,
    backgroundColor: color.border.neutralRegular,
  },
  markers: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  markerCell: {
    flex: 1,
    alignItems: 'center',
  },
  marker: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: color.background.neutralBold,
  },
  markerActive: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
    backgroundColor: color.background.brandPrimaryRegular,
  },
  labelRow: {
    flexDirection: 'row',
  },
  gradePrice: {
    ...font.bodyXsEmphasized,
    color: color.text.neutralRegular,
    flex: 1,
    textAlign: 'center',
  },
  gradeLabel: {
    ...font.bodyXsEmphasized,
    color: color.text.neutralRegular,
    flex: 1,
    textAlign: 'center',
  },
  gradeActiveText: {
    color: color.text.neutralBold,
  },
});
