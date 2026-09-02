import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CameraCapture from '../components/addVehicle/CameraCapture';
import CoverImageSheet from '../components/CoverImageSheet';
import DeletePhotoSheet from '../components/DeletePhotoSheet';
import DraggableGrid from '../components/DraggableGrid';
import GallerySheet from '../components/addVehicle/GallerySheet';
import MediaSourceSheet from '../components/addVehicle/MediaSourceSheet';
import PhotoTipsSheet from '../components/addVehicle/PhotoTipsSheet';
import PhotoGuidanceList from '../components/addVehicle/PhotoGuidanceList';
import Button from '../components/vehicle/Button';
import { PHOTO_GUIDANCE, makePhotos } from '../data/photos';
import { allVehiclePhotos } from '../data/saved';
import { usePhotoTarget } from '../state/photoTarget';
import { color, font, radius, spacing } from '../theme/tokens';

// Corner-control glyphs, taken from Icons/Icon for Images so the photo tools
// match the design system: edit (pen-to-square) on the cover, a move handle for
// reordering (both #5D605D), and a red trash to delete.
const EDIT_XML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.87614 1.79173C9.48717 1.40276 8.85843 1.40276 8.46946 1.79173L7.93485 2.32456L9.67366 4.06337L10.2083 3.52876C10.5972 3.13979 10.5972 2.51105 10.2083 2.12208L9.87614 1.79173ZM4.56202 5.69917C4.45367 5.80751 4.3702 5.94072 4.32224 6.08814L3.79651 7.66533C3.745 7.81807 3.78586 7.9868 3.89953 8.10225C4.0132 8.2177 4.18193 8.25677 4.33645 8.20526L5.91364 7.67954C6.05928 7.63158 6.19249 7.5481 6.3026 7.43976L9.27404 4.46655L7.53345 2.72596L4.56202 5.69917ZM3.20507 2.54302C2.26373 2.54302 1.5 3.30675 1.5 4.24809V8.79493C1.5 9.73627 2.26373 10.5 3.20507 10.5H7.75191C8.69325 10.5 9.45698 9.73627 9.45698 8.79493V7.08987C9.45698 6.77549 9.20299 6.52151 8.88862 6.52151C8.57425 6.52151 8.32027 6.77549 8.32027 7.08987V8.79493C8.32027 9.1093 8.06628 9.36329 7.75191 9.36329H3.20507C2.8907 9.36329 2.63671 9.1093 2.63671 8.79493V4.24809C2.63671 3.93372 2.8907 3.67973 3.20507 3.67973H4.91013C5.22451 3.67973 5.47849 3.42575 5.47849 3.11138C5.47849 2.79701 5.22451 2.54302 4.91013 2.54302H3.20507Z" fill="#5D605D"/></svg>`;
const TRASH_XML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.19262 2.34375H6.80608C6.85257 2.34375 6.89562 2.3666 6.92145 2.40703L7.24862 2.90625H4.7518L5.07897 2.40703C5.1048 2.36836 5.14785 2.34375 5.19434 2.34375H5.19262ZM8.24217 2.90625L7.61022 1.9377C7.43114 1.66523 7.1298 1.5 6.8078 1.5H5.19262C4.87062 1.5 4.56928 1.66523 4.3902 1.9377L3.75825 2.90625H3.52234H2.69409H2.55633C2.32731 2.90625 2.14307 3.09434 2.14307 3.32812C2.14307 3.56191 2.32731 3.75 2.55633 3.75H2.75608L3.16934 9.45762C3.21239 10.0447 3.69109 10.5 4.26794 10.5H7.73076C8.30761 10.5 8.78631 10.0447 8.82935 9.45762L9.24434 3.75H9.44409C9.67311 3.75 9.85735 3.56191 9.85735 3.32812C9.85735 3.09434 9.67311 2.90625 9.44409 2.90625H9.30633H8.47808H8.24217ZM8.41609 3.75L8.00627 9.39609C7.99594 9.54375 7.8754 9.65625 7.73076 9.65625H4.26794C4.1233 9.65625 4.00448 9.54199 3.99243 9.39609L3.58433 3.75H8.41609Z" fill="#DC2626"/></svg>`;
const MOVE_XML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.3973 1.66481C6.17756 1.44506 5.82069 1.44506 5.60094 1.66481L4.47583 2.78992C4.25608 3.00967 4.25608 3.36654 4.47583 3.58629C4.69558 3.80604 5.05245 3.80604 5.27219 3.58629L5.43744 3.42104V5.43744H3.42104L3.58629 5.27219C3.80604 5.05245 3.80604 4.69558 3.58629 4.47583C3.36654 4.25608 3.00967 4.25608 2.78992 4.47583L1.66481 5.60094C1.44506 5.82069 1.44506 6.17756 1.66481 6.3973L2.78992 7.52241C3.00967 7.74216 3.36654 7.74216 3.58629 7.52241C3.80604 7.30267 3.80604 6.94579 3.58629 6.72605L3.42104 6.5608L5.43744 6.56255V8.57896L5.27219 8.41371C5.05245 8.19396 4.69558 8.19396 4.47583 8.41371C4.25608 8.63346 4.25608 8.99033 4.47583 9.21008L5.60094 10.3352C5.82069 10.5549 6.17756 10.5549 6.3973 10.3352L7.52241 9.21008C7.74216 8.99033 7.74216 8.63346 7.52241 8.41371C7.30267 8.19396 6.94579 8.19396 6.72605 8.41371L6.5608 8.57896L6.56255 6.56255H8.57896L8.41371 6.72781C8.19396 6.94755 8.19396 7.30442 8.41371 7.52417C8.63346 7.74392 8.99033 7.74392 9.21008 7.52417L10.3352 6.39906C10.5549 6.17931 10.5549 5.82244 10.3352 5.6027L9.21008 4.47759C8.99033 4.25784 8.63346 4.25784 8.41371 4.47759C8.19396 4.69733 8.19396 5.0542 8.41371 5.27395L8.57896 5.4392L6.56255 5.43744V3.42104L6.72781 3.58629C6.94755 3.80604 7.30442 3.80604 7.52417 3.58629C7.74392 3.36654 7.74392 3.00967 7.52417 2.78992L6.39906 1.66481H6.3973Z" fill="#5D605D"/></svg>`;

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
  const [coverSheetOpen, setCoverSheetOpen] = useState(false);
  // The photo pending deletion (its trash was tapped); confirmed in the sheet.
  const [deleteId, setDeleteId] = useState(null);

  const addFromGallery = (chosen) => {
    setGallery(false);
    setItems((prev) => [...prev, ...makePhotos(chosen)]);
  };

  // The cover is the first photo (every consumer reads photos[0]), so choosing a
  // cover moves the picked photo to the front.
  const setCover = (id) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      if (idx <= 0) return prev;
      const next = [...prev];
      const [chosen] = next.splice(idx, 1);
      next.unshift(chosen);
      return next;
    });
  };

  const removeItem = (id) => setItems((prev) => prev.filter((p) => p.id !== id));

  // Drag-to-reorder: move the dragged photo to the drop position. The first
  // photo stays the cover, so reordering can also promote a new cover.
  const reorder = (fromIndex, toIndex) =>
    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });

  const renderCell = (photo, index) => (
    <View style={styles.gridCell}>
      <Image source={photo.image} style={styles.gridImage} resizeMode="cover" />
      {index === 0 ? (
        <>
          <View style={styles.coverTag}>
            <Text style={styles.coverLabel}>COVER IMAGE</Text>
          </View>
          <Pressable
            style={[styles.cornerBtn, styles.cornerRight]}
            onPress={() => setCoverSheetOpen(true)}
            accessibilityRole="button"
            accessibilityLabel="Edit cover image"
            hitSlop={8}
          >
            <SvgXml xml={EDIT_XML} width={14} height={14} />
          </Pressable>
        </>
      ) : (
        <>
          <View
            style={[styles.cornerBtn, styles.cornerLeft]}
            accessibilityLabel="Drag to reorder"
            pointerEvents="none"
          >
            <SvgXml xml={MOVE_XML} width={12} height={12} />
          </View>
          <Pressable
            style={[styles.cornerBtn, styles.cornerRight]}
            onPress={() => setDeleteId(photo.id)}
            accessibilityRole="button"
            accessibilityLabel="Delete photo"
            hitSlop={8}
          >
            <SvgXml xml={TRASH_XML} width={14} height={14} />
          </Pressable>
        </>
      )}
    </View>
  );

  const done = () => {
    setPhotos({ items });
    // From the "add a vehicle" welcome flow: continue to the detail page with the
    // photos already filled, rather than back to the picker's opener.
    if (route.params?.next) navigation.navigate(route.params.next, { id: route.params.id });
    else navigation.goBack();
  };

  const empty = items.length === 0;

  // Picker roll: the vehicle's current photos first, then every other car photo,
  // deduped by image so nothing repeats.
  const galleryRoll = [];
  const seen = new Set();
  for (const entry of [...items, ...allVehiclePhotos]) {
    if (seen.has(entry.image)) continue;
    seen.add(entry.image);
    galleryRoll.push({ id: entry.id, image: entry.image });
  }

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
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={empty ? styles.content : styles.gridContent}
        showsVerticalScrollIndicator={false}
      >
        {empty ? (
          <PhotoGuidanceList thumbWidth={84} thumbHeight={64} />
        ) : (
          <DraggableGrid items={items} renderItem={renderCell} onReorder={reorder} />
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
            <Button label="Save photos" onPress={done} style={styles.action} />
          </View>
        )}
      </View>

      <CoverImageSheet
        visible={coverSheetOpen}
        items={items}
        coverId={items[0]?.id}
        onSave={(id) => {
          setCover(id);
          setCoverSheetOpen(false);
        }}
        onClose={() => setCoverSheetOpen(false)}
      />

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

      <GallerySheet
        visible={gallery}
        onCancel={() => setGallery(false)}
        onDone={addFromGallery}
        // The roll combines this vehicle's own photos (including any just added)
        // with every other vehicle's photos, deduped — so there's a full library
        // to pick from, using all the real car images.
        images={galleryRoll}
      />

      <DeletePhotoSheet
        visible={deleteId != null}
        onDelete={() => {
          removeItem(deleteId);
          setDeleteId(null);
        }}
        onClose={() => setDeleteId(null)}
      />
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
  gridContent: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
  },
  // Two columns, landscape cells per the comp (172.5×120 ≈ 1.44). space-between
  // supplies the column gap; a fixed px gap plus % widths can overflow and wrap.
  hint: {
    ...font.bodyXsRegular,
    color: color.text.neutralRegular,
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[3],
  },
  gridCell: {
    width: '100%',
    aspectRatio: 172.5 / 120,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: color.background.neutralRegular,
  },
  gridCellPressed: {
    opacity: 0.7,
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
  // Corner controls sit in a soft white circle: edit/delete top-right, the move
  // handle top-left (per Figma 1482-12832).
  cornerBtn: {
    position: 'absolute',
    top: spacing[2],
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  cornerRight: {
    right: spacing[2],
  },
  cornerLeft: {
    left: spacing[2],
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
