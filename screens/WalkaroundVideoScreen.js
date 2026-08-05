import { Feather, Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CameraCapture from '../components/addVehicle/CameraCapture';
import GallerySheet from '../components/addVehicle/GallerySheet';
import MediaSourceSheet from '../components/addVehicle/MediaSourceSheet';
import Button from '../components/vehicle/Button';
import AppIcon from '../components/icons/AppIcon';
import { VIDEO_INTRO_STEPS, VIDEO_STILL, makeVideo } from '../data/photos';
import { usePhotoTarget } from '../state/photoTarget';
import { color, font, radius, spacing } from '../theme/tokens';

/**
 * PRD step 5 — walkaround video (1148-9117).
 *
 * Guidance for shooting a walkaround, an example clip, and an Add video action.
 * Capture is UI-only (see makeVideo); a real clip needs expo-camera.
 */
export default function WalkaroundVideoScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { setVideo } = usePhotoTarget(route.params?.id);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [camera, setCamera] = useState(false);
  const [gallery, setGallery] = useState(false);

  const save = () => {
    setVideo(makeVideo());
    navigation.goBack();
  };

  if (camera) {
    return (
      <CameraCapture
        // UI only: the viewfinder is a still and the shutter "records" a clip.
        preview={VIDEO_STILL}
        hint="Record a slow walkaround"
        captureLabel="Record video"
        showFrame={false}
        onCapture={save}
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
        <Text style={styles.headerTitle}>Walkaround video</Text>
        {/* Balances the back chevron so the title stays centred. */}
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {VIDEO_INTRO_STEPS.map((step) => (
          <View key={step.id} style={styles.tip}>
            <AppIcon name={step.icon} size={40} />
            <View style={styles.tipBody}>
              <Text style={styles.tipTitle}>{step.title}</Text>
              <Text style={styles.tipText}>{step.description}</Text>
            </View>
          </View>
        ))}

        <View style={styles.example}>
          <Image source={VIDEO_STILL} style={styles.exampleImage} resizeMode="cover" />
          <View style={styles.play} pointerEvents="none">
            <Ionicons name="play-circle" size={64} color="rgba(255,255,255,0.85)" />
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom || spacing[4] }]}>
        <Button
          label="Add video"
          leading={<Feather name="plus" size={18} color={color.text.inverseBold} />}
          onPress={() => setSheetOpen(true)}
        />
      </View>

      <MediaSourceSheet
        visible={sheetOpen}
        title="Add video"
        onClose={() => setSheetOpen(false)}
        onPickLibrary={() => {
          // Same picker as photos, so choosing a clip from the library looks
          // identical to choosing a photo.
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
        onDone={() => {
          setGallery(false);
          save();
        }}
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
    gap: spacing[3],
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[2],
  },
  tipBody: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  tipTitle: {
    ...font.subheadlineEmphasized,
    color: color.text.neutralBold,
  },
  tipText: {
    ...font.subheadlineRegular,
    color: color.text.neutralRegular,
  },
  example: {
    height: 232,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: color.background.neutralRegular,
    marginTop: spacing[2],
  },
  exampleImage: {
    width: '100%',
    height: '100%',
  },
  play: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
  },
});
