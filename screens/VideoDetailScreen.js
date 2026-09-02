import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../components/vehicle/Button';
import StreamPlayer from '../components/vehicle/StreamPlayer';
import { usePhotoTarget } from '../state/photoTarget';
import { color, font, radius, spacing } from '../theme/tokens';

/**
 * Video page (Figma 1322-35078): a rounded player that shows the poster until
 * tapped, then plays the Cloudflare Stream clip. Footer offers "Replace video"
 * (re-record) and a "Save videos" action (disabled until something changes).
 */
export default function VideoDetailScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const id = route.params?.id;
  const { video } = usePhotoTarget(id);

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
        <Text style={styles.headerTitle}>Video</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        {video?.embedUrl ? (
          <StreamPlayer
            embedUrl={video.embedUrl}
            poster={video.items?.[0]?.image?.uri}
            style={styles.player}
          />
        ) : null}
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom || spacing[4] }]}>
        <Button
          label="Replace video"
          variant="secondary"
          onPress={() => navigation.navigate('WalkaroundVideo', { id })}
          style={styles.action}
        />
        <Button label="Save videos" variant="secondary" disabled style={styles.action} />
      </View>
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
    flex: 1,
    paddingHorizontal: spacing[4],
    paddingTop: spacing[2],
  },
  player: {
    borderRadius: radius.xl,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing[3],
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
  },
  action: {
    flex: 1,
  },
});
