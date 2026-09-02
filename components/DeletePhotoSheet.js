import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import BottomSheet from './BottomSheet';
import Button from './vehicle/Button';
import { color, font, spacing } from '../theme/tokens';

const TRASH_XML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.1575 4.81406L9.50312 5.8125H14.4967L13.8424 4.81406C13.7907 4.73672 13.7046 4.6875 13.6117 4.6875H10.3848C10.2918 4.6875 10.2057 4.7332 10.154 4.81406H10.1575ZM15.22 3.87891L16.4839 5.8125H16.9591H18.6122H18.8877C19.3457 5.8125 19.7142 6.18867 19.7142 6.65625C19.7142 7.12383 19.3457 7.5 18.8877 7.5H18.6122V18.1875C18.6122 19.7414 17.3793 21 15.8571 21H8.14279C6.62059 21 5.38769 19.7414 5.38769 18.1875V7.5H5.11218C4.65414 7.5 4.28564 7.12383 4.28564 6.65625C4.28564 6.18867 4.65414 5.8125 5.11218 5.8125H5.38769H7.04075H7.516L8.7799 3.87539C9.13807 3.33047 9.74075 3 10.3848 3H13.6117C14.2557 3 14.8583 3.33047 15.2165 3.87539L15.22 3.87891ZM7.04075 7.5V18.1875C7.04075 18.8098 7.53322 19.3125 8.14279 19.3125H15.8571C16.4666 19.3125 16.9591 18.8098 16.9591 18.1875V7.5H7.04075ZM9.79585 9.75V17.0625C9.79585 17.3719 9.54789 17.625 9.24483 17.625C8.94177 17.625 8.69381 17.3719 8.69381 17.0625V9.75C8.69381 9.44063 8.94177 9.1875 9.24483 9.1875C9.54789 9.1875 9.79585 9.44063 9.79585 9.75ZM12.551 9.75V17.0625C12.551 17.3719 12.303 17.625 11.9999 17.625C11.6969 17.625 11.4489 17.3719 11.4489 17.0625V9.75C11.4489 9.44063 11.6969 9.1875 11.9999 9.1875C12.303 9.1875 12.551 9.44063 12.551 9.75ZM15.3061 9.75V17.0625C15.3061 17.3719 15.0581 17.625 14.755 17.625C14.452 17.625 14.204 17.3719 14.204 17.0625V9.75C14.204 9.44063 14.452 9.1875 14.755 9.1875C15.0581 9.1875 15.3061 9.44063 15.3061 9.75Z" fill="#DC2626"/></svg>`;

/**
 * Confirm deleting a photo (Figma 1505-13175): a red trash mark, a warning, and
 * destructive/cancel actions in a bottom sheet.
 */
export default function DeletePhotoSheet({ visible, onDelete, onClose }) {
  const insets = useSafeAreaInsets();
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={[styles.sheet, { paddingBottom: insets.bottom || spacing[4] }]}>
        <SvgXml xml={TRASH_XML} width={28} height={28} />
        <Text style={styles.title}>Delete this image?</Text>
        <Text style={styles.subtitle}>
          We&apos;ll remove this image from your vehicle details. This cannot be undone.
        </Text>
        <View style={styles.actions}>
          <Button
            label="Delete image"
            variant="secondary"
            labelStyle={styles.deleteLabel}
            onPress={onDelete}
          />
          <Button label="Cancel" variant="secondary" onPress={onClose} />
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheet: {
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[2],
    gap: spacing[2],
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
    color: color.text.neutralBold,
    textAlign: 'center',
    marginTop: spacing[1],
  },
  subtitle: {
    ...font.subheadlineRegular,
    color: color.text.neutralRegular,
    textAlign: 'center',
  },
  actions: {
    alignSelf: 'stretch',
    gap: spacing[3],
    marginTop: spacing[3],
  },
  deleteLabel: {
    color: color.text.dangerBold ?? '#DC2626',
  },
});
