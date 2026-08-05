import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CameraCapture from '../components/addVehicle/CameraCapture';
import GallerySheet from '../components/addVehicle/GallerySheet';
import MediaSourceSheet from '../components/addVehicle/MediaSourceSheet';
import PhotoTipsSheet from '../components/addVehicle/PhotoTipsSheet';
import PhotoGuidanceList from '../components/addVehicle/PhotoGuidanceList';
import Button from '../components/vehicle/Button';
import { PHOTO_GUIDANCE, makePhotos } from '../data/photos';
import { usePhotoTarget } from '../state/photoTarget';
import { color, font, radius, spacing } from '../theme/tokens';

/**
 * PRD step 5 — photographs.
 *
 * Opens on guidance for what to shoot, then becomes a grid of what has been
 * added. Picking and capture are stubbed; see makePhotos.
 */
export default function PhotographsScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { photos, setPhotos } = usePhotoTarget(route.params?.id);
  const [items, setItems] = useState(photos?.items ?? []);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [gallery, setGallery] = useState(false);
  const [camera, setCamera] = useState(false);
  const [tipsOpen, setTipsOpen] = useState(false);

  const addFromGallery = (chosen) => {
    setGallery(false);
    setItems((prev) => [...prev, ...makePhotos(chosen)]);
  };

  const done = () => {
    setPhotos({ items });
    // From the "add a vehicle" welcome flow: continue to the detail page with the
    // photos already filled, rather than back to the picker's opener.
    if (route.params?.next) navigation.navigate(route.params.next, { id: route.params.id });
    else navigation.goBack();
  };

  const empty = items.length === 0;

  if (camera) {
    return (
      <CameraCapture
        // UI only: the viewfinder is a still and the shutter adds a canned shot.
        preview={PHOTO_GUIDANCE[0].image}
        hint=""
        captureLabel="Take photo"
        showFrame={false}
        onCapture={() => setItems((prev) => [...prev, ...makePhotos(1)])}
        onDone={() => setCamera(false)}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 32) }]}>
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Back"
          hitSlop={8}
        >
          <Feather name="chevron-left" size={24} color={color.icon.neutralBold} />
        </Pressable>
        <Text style={styles.headerTitle}>Photos</Text>
        {/* Once the grid replaces the guidance, the guidance moves behind this
            info button. While empty the page already shows it in full. */}
        {empty ? (
          <View style={styles.headerSpacer} />
        ) : (
          <Pressable
            onPress={() => setTipsOpen(true)}
            accessibilityRole="button"
            accessibilityLabel="About photos"
            hitSlop={8}
          >
            <Feather name="info" size={22} color={color.icon.neutralBold} />
          </Pressable>
        )}
      </View>

      <ScrollView
        contentContainerStyle={empty ? styles.content : styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {empty ? (
          <PhotoGuidanceList thumbWidth={84} thumbHeight={64} />
        ) : (
          items.map((photo, index) => (
            <View key={photo.id} style={styles.gridCell}>
              <Image source={photo.image} style={styles.gridImage} resizeMode="cover" />
              {index === 0 && (
                <View style={styles.coverTag}>
                  <Text style={styles.coverLabel}>COVER IMAGE</Text>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom || spacing[4] }]}>
        {empty ? (
          <Button
            label="Add photos"
            leading={<Feather name="plus" size={18} color={color.text.inverseBold} />}
            onPress={() => setSheetOpen(true)}
          />
        ) : (
          <View style={styles.actions}>
            <Button
              label="Add more"
              variant="secondary"
              leading={<Feather name="plus" size={18} color={color.text.neutralBold} />}
              onPress={() => setSheetOpen(true)}
              style={styles.action}
            />
            <Button label="Done" onPress={done} style={styles.action} />
          </View>
        )}
      </View>

      <PhotoTipsSheet visible={tipsOpen} onClose={() => setTipsOpen(false)} />

      <MediaSourceSheet
        visible={sheetOpen}
        title="Add photos"
        onClose={() => setSheetOpen(false)}
        onPickLibrary={() => {
          setSheetOpen(false);
          setGallery(true);
        }}
        onOpenCamera={() => {
          setSheetOpen(false);
          setCamera(true);
        }}
      />

      <GallerySheet visible={gallery} onCancel={() => setGallery(false)} onDone={addFromGallery} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.background.neutralWhite,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[3],
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[3],
  },
  headerTitle: {
    ...font.bodyEmphasized,
    color: color.text.neutralBold,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 24,
  },
  content: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
    gap: spacing[4],
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing[4],
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
  },
  // Two columns, landscape cells per the comp (172.5×120 ≈ 1.44). space-between
  // supplies the column gap; a fixed px gap plus % widths can overflow and wrap.
  gridCell: {
    width: '48%',
    aspectRatio: 172.5 / 120,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: color.background.neutralRegular,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  coverTag: {
    position: 'absolute',
    top: spacing[2.5],
    left: spacing[2.5],
    height: 18,
    justifyContent: 'center',
    paddingHorizontal: spacing[2],
    borderRadius: radius.full,
    backgroundColor: 'rgba(37,37,37,0.82)',
  },
  coverLabel: {
    ...font.caption2Emphasized,
    color: '#ffffff',
    letterSpacing: 1,
  },
  footer: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
  },
  actions: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  action: {
    flex: 1,
  },
});
