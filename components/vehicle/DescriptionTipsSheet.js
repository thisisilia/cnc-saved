import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { DESCRIPTION_TIPS, DESCRIPTION_TIPS_INTRO } from '../../data/sell';
import { color, font, spacing } from '../../theme/tokens';
import BottomSheet from '../BottomSheet';
import AppIcon from '../icons/AppIcon';
import Button from './Button';

/** What a good description covers. Opened by the info icon on Create advert. */
export default function DescriptionTipsSheet({ visible, onClose }) {
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.body}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          <Text style={styles.intro}>{DESCRIPTION_TIPS_INTRO}</Text>
          {DESCRIPTION_TIPS.map((tip) => (
            <View key={tip.id} style={styles.tip}>
              <AppIcon name={tip.icon} size={24} color={color.icon.brandPrimaryRegular} />
              <View style={styles.tipBody}>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipText}>{tip.description}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <Button label="Got it" onPress={onClose} />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  body: {
    alignSelf: 'stretch',
    // Allow the sheet's max-height to bound this column so the list scrolls
    // instead of overflowing (RN defaults flexShrink to 0).
    flexShrink: 1,
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
    gap: spacing[6],
  },
  scroll: {
    flexShrink: 1,
  },
  list: {
    gap: spacing[6],
  },
  intro: {
    ...font.calloutEmphasized,
    color: color.text.neutralBold,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[4],
  },
  tipBody: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  tipTitle: {
    ...font.calloutEmphasized,
    color: color.text.neutralBold,
  },
  tipText: {
    ...font.subheadlineRegular,
    color: color.text.neutralRegular,
  },
});
