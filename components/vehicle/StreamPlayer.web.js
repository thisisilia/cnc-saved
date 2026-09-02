import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { color } from '../../theme/tokens';

/**
 * Cloudflare Stream player (web). Shows the poster with a play button until
 * tapped, then swaps in the Stream iframe with autoplay so the click plays the
 * video. Native falls back to the poster (see StreamPlayer.js).
 */
export default function StreamPlayer({ embedUrl, poster, style }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    const src = embedUrl + (embedUrl.includes('?') ? '&' : '?') + 'autoplay=true';
    return (
      <View style={[styles.wrap, style]}>
        <iframe
          src={src}
          title="Walkaround video"
          style={{ border: 0, width: '100%', height: '100%', display: 'block' }}
          allow="accelerometer; gyroscope; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </View>
    );
  }

  return (
    <Pressable
      style={[styles.wrap, style]}
      onPress={() => setPlaying(true)}
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
