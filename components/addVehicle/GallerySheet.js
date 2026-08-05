import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GALLERY } from '../../data/photos';
import { font, spacing } from '../../theme/tokens';

/** iOS picker green — this surface is the system sheet, not the brand's. */
const ACCENT = '#4da764';
const COLUMNS = 3;
const GUTTER = 2;

/** Selected shots carry their pick order, as the system picker does. */
function SelectionBadge({ order }) {
  return (
    <View style={[styles.badge, order ? styles.badgeOn : styles.badgeOff]}>
      {order ? <Text style={styles.badgeLabel}>{order}</Text> : null}
    </View>
  );
}

/**
 * Stands in for the iOS photo picker.
 *
 * Presentation only: the grid is a fixed set (see GALLERY) rather than the
 * device camera roll, which needs expo-image-picker and permission handling.
 * Selection itself is real — tap to pick, tap again to drop, and the numbers
 * renumber to keep the pick order contiguous.
 *
 * An absolute overlay rather than a native Modal, for the same reason as
 * BottomSheet: a Modal portals to the viewport root, which on web would escape
 * the letterboxed phone frame and cover the whole browser window.
 */
export default function GallerySheet({ visible, onCancel, onDone }) {
  const insets = useSafeAreaInsets();
  const [picked, setPicked] = useState([]);
  // Measured: a percentage width cannot account for the pixel gutters, so the
  // row fell short of the full width.
  const [gridWidth, setGridWidth] = useState(0);
  const cell = gridWidth ? (gridWidth - GUTTER * (COLUMNS - 1)) / COLUMNS : 0;

  // Each opening starts a fresh selection.
  useEffect(() => {
    if (visible) setPicked([]);
  }, [visible]);

  const toggle = (id) =>
    setPicked((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));

  const confirm = () => onDone(picked.map((id) => GALLERY.find((g) => g.id === id)));

  if (!visible) return null;

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, spacing[3]) }]}>
        <Pressable onPress={onCancel} accessibilityRole="button" accessibilityLabel="Cancel">
          <Text style={styles.action}>Cancel</Text>
        </Pressable>

        <View style={styles.tabs}>
          <View style={[styles.tab, styles.tabActive]}>
            <Text style={styles.tabLabelActive}>Photos</Text>
          </View>
          <View style={styles.tab}>
            <Text style={styles.tabLabel}>Albums</Text>
          </View>
        </View>

        <Pressable
          onPress={confirm}
          disabled={picked.length === 0}
          accessibilityRole="button"
          accessibilityLabel="Done selecting"
          accessibilityState={{ disabled: picked.length === 0 }}
        >
          <Text style={[styles.action, picked.length === 0 && styles.actionDisabled]}>Done</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        onLayout={(e) => setGridWidth(e.nativeEvent.layout.width)}
      >
        {GALLERY.map((item) => {
          const order = picked.indexOf(item.id) + 1;
          return (
            <Pressable
              key={item.id}
              style={[styles.cell, { width: cell }]}
              onPress={() => toggle(item.id)}
              accessibilityRole="checkbox"
              accessibilityLabel={`Photo ${item.id}`}
              accessibilityState={{ checked: Boolean(order) }}
              // accessibilityState does not reach the DOM on react-native-web.
              aria-checked={Boolean(order)}
            >
              <Image source={item.image} style={styles.image} resizeMode="cover" />
              {Boolean(order) && <View style={styles.dim} pointerEvents="none" />}
              <SelectionBadge order={order} />
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[2],
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[3],
  },
  action: {
    ...font.bodyRegular,
    color: '#ffffff',
  },
  actionDisabled: {
    opacity: 0.4,
  },
  tabs: {
    flexDirection: 'row',
    padding: 2,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  tab: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: 6,
  },
  tabActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  tabLabel: {
    ...font.bodySmEmphasized,
    color: '#ffffff',
  },
  tabLabelActive: {
    ...font.bodySmEmphasized,
    color: '#ffffff',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GUTTER,
  },
  // Width is supplied per-render from the measured grid; see `cell` above.
  cell: {
    aspectRatio: 1,
    backgroundColor: '#111111',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  dim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  badge: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 17,
    height: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },
  badgeOn: {
    backgroundColor: ACCENT,
  },
  badgeOff: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  badgeLabel: {
    ...font.caption2Emphasized,
    color: '#ffffff',
  },
});
