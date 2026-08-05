import { ScrollView, StyleSheet, View } from 'react-native';
import NavHeader from '../components/NavHeader';
import DecorativeIcon from '../components/saved/DecorativeIcon';
import EmptyPrompt from '../components/saved/EmptyPrompt';
import VehicleGrid from '../components/VehicleGrid';
import { previouslyOwned } from '../data/garage';
import { color, spacing } from '../theme/tokens';

/** Archive of vehicles that have been marked as sold. */
export default function PreviouslyOwnedScreen({ navigation, route }) {
  // Scoped to a single current car (from the single Saved state): nothing sold.
  const single = route.params?.single;

  return (
    <View style={styles.screen}>
      <NavHeader title="Previously owned cars" onBack={() => navigation.goBack()} />
      {single ? (
        <View style={styles.empty}>
          <EmptyPrompt
            icon={<DecorativeIcon name="garage" />}
            title="No previously owned cars"
            subtitle="Cars you mark as sold will appear here"
          />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <VehicleGrid vehicles={previouslyOwned} sold />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.background.neutralWhite,
  },
  content: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[8],
  },
  empty: {
    flex: 1,
    paddingHorizontal: spacing[6],
    paddingBottom: 80,
  },
});
