import { useEffect, useState } from 'react';
import { Keyboard, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackButton from '../components/BackButton';
import AIReviewAlert from '../components/vehicle/AIReviewAlert';
import AppIcon from '../components/icons/AppIcon';
import { DESCRIPTION_INTRO, DESCRIPTION_PLACEHOLDER } from '../data/sell';
import { useAdvertDraft } from '../state/advertDraft';
import { color, font, radius, spacing } from '../theme/tokens';

/**
 * Write-up step of the advert. Free text with an AI-style "Review" and a "Done"
 * that saves and returns. The action row shows once the keyboard is dismissed;
 * Review is disabled until there's something to review.
 */
export default function DescriptionScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const id = route.params?.id;
  const { description, setDescription } = useAdvertDraft(id);
  const [text, setText] = useState(description);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [keyboardUp, setKeyboardUp] = useState(false);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => setKeyboardUp(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardUp(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const hasContent = text.trim().length > 0;

  const done = () => {
    setDescription(text);
    navigation.goBack();
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 32) }]}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Description</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.intro}>{DESCRIPTION_INTRO}</Text>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder={DESCRIPTION_PLACEHOLDER}
          placeholderTextColor={color.text.neutralRegular}
          multiline
          autoFocus
          textAlignVertical="top"
          accessibilityLabel="Description"
        />
      </ScrollView>

      {!keyboardUp && (
        <View style={[styles.footer, { paddingBottom: insets.bottom || spacing[4] }]}>
          <Pressable
            style={[styles.reviewBtn, !hasContent && styles.reviewDisabled]}
            disabled={!hasContent}
            onPress={() => setReviewOpen(true)}
            accessibilityRole="button"
            accessibilityLabel="Review"
          >
            <AppIcon
              name="sparkles"
              size={18}
              color={hasContent ? color.icon.brandPrimaryRegular : color.text.neutralBoldDisabled}
            />
            <Text style={[styles.reviewLabel, !hasContent && styles.reviewLabelDisabled]}>Review</Text>
          </Pressable>
          <Pressable style={styles.doneBtn} onPress={done} accessibilityRole="button" accessibilityLabel="Done">
            <Text style={styles.doneLabel}>Done</Text>
          </Pressable>
        </View>
      )}

      <AIReviewAlert visible={reviewOpen} onClose={() => setReviewOpen(false)} />
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
    flexGrow: 1,
    paddingHorizontal: spacing[4],
    paddingTop: spacing[2],
    gap: spacing[4],
  },
  intro: {
    ...font.subheadlineRegular,
    color: color.text.neutralRegular,
  },
  input: {
    flex: 1,
    minHeight: 240,
    ...font.bodyMdEmphasized,
    fontWeight: '400',
    color: color.text.neutralBold,
    padding: 0,
    // No focus ring while typing.
    outlineStyle: 'none',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
  },
  reviewBtn: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    minHeight: 52,
    borderRadius: radius.xl,
    backgroundColor: color.background.neutralSubtle,
  },
  reviewDisabled: {
    opacity: 0.6,
  },
  reviewLabel: {
    ...font.bodyEmphasized,
    color: color.text.neutralBold,
  },
  reviewLabelDisabled: {
    color: color.text.neutralBoldDisabled,
  },
  doneBtn: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    borderRadius: radius.xl,
    backgroundColor: color.background.brandPrimaryRegular,
  },
  doneLabel: {
    ...font.bodyEmphasized,
    color: color.text.inverseBold,
  },
});
