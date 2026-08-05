import { StyleSheet, Text, View } from 'react-native';
import { color, font, size, spacing } from '../../theme/tokens';
import AppIcon from '../icons/AppIcon';
import Button from './Button';
import SectionCard from './SectionCard';

/**
 * Core specifications, in two columns. The comp reads left-to-right across the
 * pair (steering, odometer / transmission, engine / …), so the flat list is
 * split by odd/even rather than in half.
 */
export default function CarInfoSection({ items, onEdit }) {
  const columns = [items.filter((_, i) => i % 2 === 0), items.filter((_, i) => i % 2 === 1)];

  return (
    <SectionCard title="Vehicle details" gap={spacing[5]}>
      <View style={styles.columns}>
        {columns.map((column, i) => (
          <View key={i} style={styles.column}>
            {column.map((item) => (
              <View key={item.id} style={styles.row}>
                <AppIcon name={item.glyph} size={size[6]} color={color.text.neutralBold} />
                <Text style={styles.label}>{item.label}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
      <Button label="Edit details" variant="outline" onPress={onEdit} />
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  columns: {
    flexDirection: 'row',
    gap: spacing[8],
  },
  column: {
    flex: 1,
    gap: spacing[4],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  label: {
    ...font.subheadlineRegular,
    color: color.text.neutralBold,
    flex: 1,
  },
});
