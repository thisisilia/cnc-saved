import { StyleSheet, View } from 'react-native';
import { spacing } from '../theme/tokens';
import VehicleTile from './VehicleTile';

const COLUMNS = 2;

function chunk(items, size) {
  const rows = [];
  for (let i = 0; i < items.length; i += size) rows.push(items.slice(i, i + size));
  return rows;
}

/**
 * Two-column vehicle grid.
 *
 * Built from explicit rows rather than flexWrap: with percentage widths and a
 * gap, rounding can push the pair past 100% and collapse the grid to a single
 * column. A trailing spacer keeps a lone last card at half width.
 */
export default function VehicleGrid({ vehicles, sold = false, onSelect }) {
  return (
    <View style={styles.grid}>
      {chunk(vehicles, COLUMNS).map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((vehicle) => (
            <VehicleTile
              key={vehicle.id}
              vehicle={vehicle}
              sold={sold}
              onPress={onSelect ? () => onSelect(vehicle) : undefined}
            />
          ))}
          {Array.from({ length: COLUMNS - row.length }, (_, i) => (
            <View key={`spacer-${i}`} style={styles.spacer} />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: spacing[4],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[4],
  },
  spacer: {
    flex: 1,
  },
});
