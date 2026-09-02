import { Pressable, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';

// Icons/Button short by.svg — a light rounded square with up/down sort arrows.
const XML = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 8C0 3.58172 3.58172 0 8 0H24C28.4183 0 32 3.58172 32 8V24C32 28.4183 28.4183 32 24 32H8C3.58172 32 0 28.4183 0 24V8Z" fill="#EFF1EF"/>
<path d="M12.9139 22.2863C12.5477 22.6525 11.953 22.6525 11.5869 22.2863L8.77463 19.4741C8.40846 19.1079 8.40846 18.5133 8.77463 18.1471C9.14081 17.7809 9.73548 17.7809 10.1017 18.1471L11.3144 19.3599V10.3754C11.3144 9.85689 11.7333 9.43799 12.2518 9.43799C12.7703 9.43799 13.1892 9.85689 13.1892 10.3754V19.3599L14.402 18.1471C14.7682 17.7809 15.3629 17.7809 15.729 18.1471C16.0952 18.5133 16.0952 19.1079 15.729 19.4741L12.9168 22.2863H12.9139ZM23.2254 12.5226C23.5915 12.8888 23.5915 13.4835 23.2254 13.8497C22.8592 14.2158 22.2645 14.2158 21.8984 13.8497L20.6885 12.6398V21.6243C20.6885 22.1428 20.2696 22.5617 19.7511 22.5617C19.2326 22.5617 18.8137 22.1428 18.8137 21.6243V12.6398L17.6009 13.8526C17.2347 14.2188 16.6401 14.2188 16.2739 13.8526C15.9077 13.4864 15.9077 12.8918 16.2739 12.5256L19.0861 9.71335C19.4523 9.34718 20.047 9.34718 20.4131 9.71335L23.2254 12.5256V12.5226Z" fill="#1E1F1E"/>
</svg>`;

/** Sort-by button — the Figma "Button short by" icon. */
export default function SortButton({ onPress, size = 32 }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Sort by"
      hitSlop={8}
      style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
    >
      <SvgXml xml={XML} width={size} height={size} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.7 },
});
