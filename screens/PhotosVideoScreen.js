import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PhotoTipsSheet from '../components/addVehicle/PhotoTipsSheet';
import Button from '../components/vehicle/Button';
import AppIcon from '../components/icons/AppIcon';
import { PHOTOS_VIDEO_STEPS } from '../data/photos';
import { usePhotoTarget } from '../state/photoTarget';
import { borderWidth, color, font, radius, size, spacing } from '../theme/tokens';

/** The green arrow that opens a step. */
function StepAction({ label, onPress }) {
  return (
    <Pressable
      style={styles.action}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Feather name="arrow-right" size={18} color={color.text.inverseBold} />
    </Pressable>
  );
}

/** Empty step: icon, label, optional badge, arrow. */
function StepRow({ step, onPress }) {
  return (
    <View style={styles.row}>
      <Feather name={step.icon} size={20} color={color.icon.brandPrimaryRegular} />
      <Text style={styles.rowLabel}>{step.label}</Text>
      {step.badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeLabel}>{step.badge}</Text>
        </View>
      )}
      <StepAction label={`Add ${step.label}`} onPress={onPress} />
    </View>
  );
}

/**
 * Completed step: a preview of what was captured (1148-9013).
 *
 * Photos fan out as a small stack; a single item (a video still) sits flat.
 */
function StepCard({ step, thumbs, subtitle, onPress }) {
  return (
    <View style={styles.card}>
      <View style={styles.thumbs}>
        {thumbs.slice(0, 2).map((image, i) => (
          <View
            key={i}
            style={[styles.thumb, i === 0 ? styles.thumbBack : styles.thumbFront]}
          >
            <Image source={image} style={styles.thumbImage} resizeMode="cover" />
          </View>
        ))}
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {step.label}
        </Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>
      <StepAction label={`Edit ${step.label}`} onPress={onPress} />
    </View>
  );
}

/**
 * PRD step 5 — photos & video.
 *
 * A hub over two collections: photographs (required) and a walkaround video
 * (optional). Empty steps show a prompt row; once captured they show a preview.
 */
export default function PhotosVideoScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const id = route.params?.id;
  const { photos, video } = usePhotoTarget(id);
  const [info, setInfo] = useState(false);

  const preview = {
    photographs: photos?.items?.length
      ? {
          thumbs: photos.items.map((p) => p.image),
          subtitle: `${photos.items.length} ${photos.items.length === 1 ? 'photo' : 'photos'}`,
        }
      : null,
    video: video?.items?.length
      ? { thumbs: video.items.map((v) => v.image), subtitle: video.duration }
      : null,
  };

  const open = (step) => {
    navigation.navigate(step.id === 'photographs' ? 'Photographs' : 'WalkaroundVideo', { id });
  };

  // Nothing to save until something has been added, so the button only appears
  // once there are photos or a video — then it commits them as "Save changes".
  const hasContent = Boolean(photos?.items?.length || video?.items?.length);

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
        <Text style={styles.headerTitle}>Photos &amp; video</Text>
        <Pressable
          onPress={() => setInfo(true)}
          accessibilityRole="button"
          accessibilityLabel="About photos and video"
          hitSlop={8}
        >
          <Feather name="info" size={22} color={color.icon.neutralBold} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {PHOTOS_VIDEO_STEPS.map((step) =>
          preview[step.id] ? (
            <StepCard
              key={step.id}
              step={step}
              thumbs={preview[step.id].thumbs}
              subtitle={preview[step.id].subtitle}
              onPress={() => open(step)}
            />
          ) : (
            <StepRow key={step.id} step={step} onPress={() => open(step)} />
          )
        )}
      </ScrollView>

      {/* #VD4: the "Save changes" button is removed from the Photos & video hub. */}

      <PhotoTipsSheet visible={info} onClose={() => setInfo(false)} />
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
  content: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    gap: spacing[3],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    backgroundColor: color.background.neutralSubtle,
    borderRadius: radius.lg,
    paddingLeft: spacing[4],
    paddingRight: spacing[2],
    paddingVertical: spacing[2],
    minHeight: 56,
  },
  rowLabel: {
    ...font.calloutEmphasized,
    color: color.text.neutralBold,
    flex: 1,
  },
  badge: {
    borderWidth: borderWidth.xs,
    borderColor: color.border.neutralRegular,
    borderRadius: radius.sm,
    paddingHorizontal: spacing[1.5],
    paddingVertical: 2,
  },
  badgeLabel: {
    ...font.labelSm,
    color: color.text.neutralRegular,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2.5],
    height: 120,
    backgroundColor: color.background.neutralSubtle,
    borderRadius: radius.xl,
    padding: spacing[4],
  },
  // Fixed box so the fanned thumbs have room; the back one is offset and the
  // front one tilts over it.
  thumbs: {
    width: 95,
    height: 74,
    justifyContent: 'center',
  },
  thumb: {
    position: 'absolute',
    width: 85,
    height: 60,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.border.white,
    overflow: 'hidden',
    backgroundColor: color.background.neutralRegular,
  },
  thumbBack: {
    left: 4,
    top: 7,
  },
  thumbFront: {
    transform: [{ rotate: '-10deg' }],
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  cardBody: {
    flex: 1,
    minWidth: 0,
    gap: spacing[2.5],
    justifyContent: 'center',
  },
  cardTitle: {
    ...font.bodyEmphasized,
    color: color.text.neutralBold,
  },
  cardSubtitle: {
    ...font.subheadlineRegular,
    color: color.text.neutralBold,
  },
  action: {
    width: size[8],
    height: size[8],
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: color.background.brandPrimaryRegular,
  },
  footer: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
  },
});
