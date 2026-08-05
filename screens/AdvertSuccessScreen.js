import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ADVERT_SUCCESS } from '../data/sell';
import { getVehicleDetails } from '../data/vehicleDetails';
import { color, font, radius, spacing } from '../theme/tokens';

/** Confirmation that the advert is submitted. "Finish" returns to the vehicle. */
export default function AdvertSuccessScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const id = route.params?.id;
  const vehicle = getVehicleDetails(id);
  const cover = (vehicle.photos && vehicle.photos[0]) || vehicle.heroImage;

  return (
    <View style={styles.screen}>
      <View style={styles.hero}>
        {cover ? <Image source={cover} style={styles.heroImage} resizeMode="cover" /> : null}
        <LinearGradient colors={['rgba(18,19,18,0)', color.text.neutralBold]} style={styles.fade} pointerEvents="none" />
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>{ADVERT_SUCCESS.title}</Text>
        <Text style={styles.text}>{ADVERT_SUCCESS.body}</Text>
        <Text style={styles.footerText}>{ADVERT_SUCCESS.footer}</Text>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom || spacing[4] }]}>
        <Pressable
          style={styles.finish}
          onPress={() => navigation.navigate('Saved')}
          accessibilityRole="button"
          accessibilityLabel="Finish"
        >
          <Text style={styles.finishLabel}>Finish</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.text.neutralBold,
  },
  hero: {
    height: 340,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  fade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 160,
  },
  body: {
    flex: 1,
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
    gap: spacing[4],
  },
  title: {
    ...font.title2Emphasized,
    color: color.text.inverseBold,
  },
  text: {
    ...font.bodyMdEmphasized,
    fontWeight: '400',
    color: color.text.inverseBold,
    lineHeight: 24,
  },
  footerText: {
    ...font.bodyMdEmphasized,
    color: color.text.inverseBold,
  },
  footer: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
  },
  finish: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.xl,
    backgroundColor: color.background.brandPrimaryRegular,
  },
  finishLabel: {
    ...font.bodyEmphasized,
    color: color.text.inverseBold,
  },
});
