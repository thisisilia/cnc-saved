import { StyleSheet, View } from 'react-native';
import { spacing } from '../theme/tokens';

/**
 * Native fallback: a static two-column grid (no drag reordering). The web build
 * renders a draggable grid instead (see DraggableGrid.web.js).
 */
export default function DraggableGrid({ items, renderItem }) {
  return (
    <View style={styles.grid}>
      {items.map((item, i) => (
        <View key={item.id} style={styles.cell}>
          {renderItem(item, i)}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing[4],
    width: '100%',
  },
  cell: {
    width: '48%',
  },
});
