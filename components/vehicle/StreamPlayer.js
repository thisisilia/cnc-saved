import { Feather } from '@expo/vector-icons';
import { Image, Linking, Pressable, StyleSheet, View } from 'react-native';
import { color } from '../../theme/tokens';

/**
 * Native fallback for the Cloudflare Stream player: shows the poster and opens
 * the hosted player in the browser on tap. The web build renders the inline
 * iframe player instead (see StreamPlayer.web.js).
 */
export default function StreamPlayer({ embedUrl, poster, style }) {
  return (
    <Pressable
      style={[styles.wrap, style]}
      onPress={() => embedUrl && Linking.openURL(embedUrl)}
      accessibilityRole="button"
      accessibilityLabel="Play video"
    >
      {poster ? <Image source={{ uri: poster }} style={StyleSheet.absoluteFill} resizeMode="cover" /> : null}
      <View style={styles.playButton}>
        <Feather name="play" size={22} color={color.text.neutralBold} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 3,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
});
