import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { color, font, radius, spacing } from '../../theme/tokens';
import { plateFont } from '../addVehicle/RegPlate';
import BottomSheet from '../BottomSheet';

function Action({ label, onPress, children }) {
  return (
    <Pressable style={styles.action} onPress={onPress} accessibilityRole="button" accessibilityLabel={label}>
      {children}
      <Text style={styles.actionLabel}>{label}</Text>
    </Pressable>
  );
}

const Tile = ({ source }) => (
  <View style={styles.tile}>
    <Image source={source} style={styles.tileImg} resizeMode="cover" />
  </View>
);

/**
 * A square collage of up to four garage photos that adapts to how many there
 * are — no repeats or blank cells: 1 fills; 2 split; 3 is two on top with one
 * filling the bottom row; 4 is a 2×2 grid.
 */
function Mosaic({ images }) {
  const pics = images.slice(0, 4);
  return (
    <View style={styles.mosaic}>
      {pics.length === 1 ? (
        <Tile source={pics[0]} />
      ) : pics.length === 2 ? (
        <View style={styles.mosaicRow}>
          <Tile source={pics[0]} />
          <Tile source={pics[1]} />
        </View>
      ) : pics.length === 3 ? (
        <>
          <View style={styles.mosaicRow}>
            <Tile source={pics[0]} />
            <Tile source={pics[1]} />
          </View>
          <Tile source={pics[2]} />
        </>
      ) : (
        <>
          <View style={styles.mosaicRow}>
            <Tile source={pics[0]} />
            <Tile source={pics[1]} />
          </View>
          <View style={styles.mosaicRow}>
            <Tile source={pics[2]} />
            <Tile source={pics[3]} />
          </View>
        </>
      )}
    </View>
  );
}

/**
 * Share sheet (Figma 1286-15547): a preview card of the vehicle — photo,
 * registration, name and site — a privacy note, then a row of share targets.
 */
export default function ShareSheet({
  visible,
  onClose,
  image,
  images,
  registration,
  name,
  url = 'carandclassic.com',
}) {
  const hasMosaic = Boolean(images?.length);

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.body}>
        <View style={styles.header}>
          <Text style={styles.title}>Share</Text>
          <Pressable style={styles.close} onPress={onClose} accessibilityRole="button" accessibilityLabel="Close">
            <Feather name="x" size={18} color={color.text.neutralBold} />
          </Pressable>
        </View>

        {/* The preview scrolls so a tall card can't push the share targets off
            the bottom of the sheet on short screens. */}
        <ScrollView
          style={styles.preview}
          contentContainerStyle={styles.previewContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            {hasMosaic ? (
              <Mosaic images={images} />
            ) : image ? (
              <View style={styles.imageWrap}>
                <Image source={image} style={styles.imageFill} resizeMode="cover" />
              </View>
            ) : null}
            {registration ? <Text style={styles.plate}>{registration}</Text> : null}
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
            <Text style={styles.url}>{url}</Text>
          </View>
        </ScrollView>

        {/* Disclaimer + share targets stay together at the bottom. */}
        <View style={styles.footer}>
          <View style={styles.separator} />
          <Text style={styles.disclaimer}>
            We will not share pricing insights, purchase details or mileage
          </Text>

          <View style={styles.actions}>
          <Action label="Copy link" onPress={onClose}>
            <View style={[styles.iconTile, styles.iconNeutral]}>
              <Feather name="copy" size={22} color={color.text.neutralBold} />
            </View>
          </Action>
          <Action label="WhatsApp" onPress={onClose}>
            <View style={[styles.iconTile, styles.iconWhatsapp]}>
              <MaterialCommunityIcons name="whatsapp" size={26} color="#fff" />
            </View>
          </Action>
          <Action label="IG Story" onPress={onClose}>
            <LinearGradient
              colors={['#feda75', '#d62976', '#4f5bd5']}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
              style={styles.iconTile}
            >
              <MaterialCommunityIcons name="instagram" size={26} color="#fff" />
            </LinearGradient>
          </Action>
          <Action label="More" onPress={onClose}>
            <View style={[styles.iconTile, styles.iconNeutral]}>
              <Feather name="more-horizontal" size={22} color={color.text.neutralBold} />
            </View>
          </Action>
          </View>
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  body: {
    // flexShrink lets the sheet's max-height bound the body so the preview can
    // shrink/scroll instead of shoving the actions past the bottom edge.
    flexShrink: 1,
    alignSelf: 'stretch',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[1],
    gap: spacing[3],
  },
  preview: {
    flexGrow: 0,
    flexShrink: 1,
  },
  previewContent: {
    gap: spacing[3],
  },
  footer: {
    gap: spacing[3],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    ...font.bodyEmphasized,
    color: color.text.neutralBold,
  },
  close: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.background.neutralSubtle,
  },
  card: {
    alignItems: 'center',
    gap: spacing[2],
    padding: spacing[4],
    borderRadius: radius.lg,
    backgroundColor: color.background.neutralSubtle,
  },
  imageWrap: {
    alignSelf: 'stretch',
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: color.background.neutralRegular,
  },
  imageFill: {
    width: '100%',
    height: '100%',
  },
  mosaic: {
    alignSelf: 'stretch',
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: color.background.neutralRegular,
  },
  mosaicRow: {
    flex: 1,
    flexDirection: 'row',
  },
  tile: {
    flex: 1,
    alignSelf: 'stretch',
    overflow: 'hidden',
    backgroundColor: color.background.neutralRegular,
  },
  tileImg: {
    width: '100%',
    height: '100%',
  },
  plate: {
    fontFamily: plateFont,
    fontWeight: '700',
    fontSize: 26,
    letterSpacing: 1,
    color: color.text.neutralBold,
    marginTop: spacing[1],
  },
  name: {
    ...font.bodyEmphasized,
    color: color.text.neutralBold,
    textAlign: 'center',
  },
  url: {
    ...font.bodyXsRegular,
    color: color.text.neutralRegular,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: color.border.neutralRegular,
  },
  disclaimer: {
    ...font.bodySmRegular,
    color: color.text.neutralRegular,
    textAlign: 'center',
    paddingHorizontal: spacing[4],
  },
  actions: {
    flexDirection: 'row',
    // Each target flexes to an equal share of the row, so a narrow phone can't
    // push the last one (More) off the edge.
    gap: spacing[2],
  },
  action: {
    flex: 1,
    alignItems: 'center',
    gap: spacing[1.5],
  },
  iconTile: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconNeutral: {
    backgroundColor: color.background.neutralSubtle,
  },
  iconWhatsapp: {
    backgroundColor: '#25D366',
  },
  actionLabel: {
    ...font.bodyXsRegular,
    color: color.text.neutralBold,
    textAlign: 'center',
  },
});
