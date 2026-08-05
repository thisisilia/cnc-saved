import { Feather } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { searchCatalogue } from '../../data/addVehicle';
import { color, font, radius, spacing } from '../../theme/tokens';
import FlowHeader from './FlowHeader';
import MakeLogo from './MakeLogo';

/** PRD step 1, non-UK: find the vehicle by make and model. */
export default function FindVehicleStep({ query, onChangeQuery, onBack, onSelect }) {
  const results = useMemo(() => searchCatalogue(query), [query]);

  return (
    <View style={styles.step}>
      <FlowHeader title="Find your vehicle" onBack={onBack} />

      <View style={styles.body}>
        <View style={styles.search}>
          <Feather name="search" size={20} color={color.icon.neutralRegular} />
          <TextInput
            style={styles.input}
            value={query}
            onChangeText={onChangeQuery}
            placeholder="Search for your vehicle"
            placeholderTextColor={color.text.neutralRegular}
            autoCorrect={false}
            autoFocus
            accessibilityLabel="Search for your vehicle"
          />
        </View>

        {results.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Start by typing in your vehicle&apos;s make &amp; model.</Text>
            <Text style={styles.emptyText}>Example: &ldquo;Porsche 911&rdquo;</Text>
          </View>
        ) : (
          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {results.map((entry) => (
              <Pressable
                key={entry.id}
                style={({ pressed }) => [styles.result, pressed && styles.resultPressed]}
                onPress={() => onSelect(entry)}
                accessibilityRole="button"
                accessibilityLabel={entry.label}
              >
                <MakeLogo make={entry.make} size={24} />
                <Text style={styles.resultLabel}>{entry.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  step: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  body: {
    flex: 1,
    width: 353,
    gap: spacing[4],
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    minHeight: 44,
    backgroundColor: color.background.neutralRegular,
    borderRadius: radius.md,
    paddingHorizontal: spacing[3],
  },
  input: {
    flex: 1,
    minWidth: 0,
    ...font.calloutRegular,
    color: color.text.neutralBold,
    outlineStyle: 'none',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
  },
  emptyText: {
    ...font.subheadlineRegular,
    color: color.text.neutralRegular,
    textAlign: 'center',
  },
  result: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[2.5],
  },
  resultPressed: {
    opacity: 0.6,
  },
  resultLabel: {
    ...font.subheadlineRegular,
    color: color.text.neutralBold,
    flex: 1,
  },
});
