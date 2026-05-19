import { Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  const getClassNames = () => {
    switch (type) {
      case 'title':
        return 'text-3xl font-bold leading-8';
      case 'defaultSemiBold':
        return 'text-base leading-6 font-semibold';
      case 'subtitle':
        return 'text-xl font-bold';
      case 'link':
        return 'text-base leading-loose text-cyan-700';
      case 'default':
      default:
        return 'text-base leading-6';
    }
  };

  return (
    <Text
      style={[{ color }, style]}
      className={getClassNames()}
      {...rest}
    />
  );
}
