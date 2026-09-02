import { ScrollView, StyleSheet, Text, View } from 'react-native';
import BottomSheet from './BottomSheet';
import VehicleGrid from './VehicleGrid';
import { previouslyOwned } from '../data/garage';
import { color, font, spacing } from '../theme/tokens';

/**
 * Previously owned cars, as a bottom sheet opened from the "Show previously
 * owned car" button on My Garage — a 2-column grid (Figma 1322-25051).
 */
export default function PreviouslyOwnedSheet({ visible, onClose }) {
  return (
    <BottomSheet visible={visible} onClose={onClose} topInset={40} fill>
      <View style={styles.sheet}>
        <Text style={styles.title}>Previously owned cars</Text>
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          <VehicleGrid vehicles={previouslyOwned} sold />
        </ScrollView>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    alignSelf: 'stretch',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[2],
  },
  title: {
    ...font.bodyEmphasized,
    color: color.text.neutralBold,
    paddingBottom: spacing[3],
  },
  list: {
    paddingBottom: spacing[6],
  },
});
