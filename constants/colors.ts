/**
 * COLOR PALETTE
 *
 * Why centralize colors?
 * - Brand consistency: All buttons, text, backgrounds use same colors
 * - Dark mode support: Easy to provide light/dark versions
 * - Accessibility: Colors are tested for contrast ratios
 * - Maintainability: Change color globally, not in every component
 */

/**
 * NEUTRAL COLORS
 * Used for text, backgrounds, borders
 * These are grays at different brightness levels
 */
export const neutral = {
  // Pure white - backgrounds, surfaces
  white: '#FFFFFF',
  // Near white - card backgrounds, light surfaces
  light: '#F9FAFB',
  // Light gray - borders, dividers
  lighter: '#F3F4F6',
  // Medium light gray - disabled states
  mediumLight: '#E5E7EB',
  // Medium gray - secondary text, icons
  medium: '#9BA1A6',
  // Medium dark gray - body text
  mediumDark: '#687076',
  // Dark gray - primary text, titles
  dark: '#11181C',
  // Very dark gray (almost black)
  darker: '#0a0a0a',
  // Black
  black: '#000000',
};

/**
 * SEMANTIC COLORS
 * Colors that represent meaning/status
 */
export const semantic = {
  // Primary color - main action, highlights
  // Used for: Primary buttons, links, active states
  primary: '#0a7ea4',
  primaryLight: '#E0F2FE',
  primaryDark: '#075985',

  // Success color - positive actions, completed items
  // Used for: Checkmarks, done badges, success messages
  success: '#10B981',
  successLight: '#DCFCE7',
  successDark: '#047857',

  // Warning color - pending items, caution
  // Used for: Pending badges, warning icons
  warning: '#F59E0B',
  warningLight: '#FFFBEB',
  warningDark: '#D97706',

  // Error color - destructive actions, errors
  // Used for: Delete buttons, error messages
  error: '#EF4444',
  errorLight: '#FEE2E2',
  errorDark: '#DC2626',

  // Info color - informational elements
  // Used for: Info badges, help text
  info: '#3B82F6',
  infoLight: '#EFF6FF',
  infoDark: '#1D4ED8',
};

/**
 * THEME COLORS (Light and Dark mode)
 */
export const Colors = {
  light: {
    text: neutral.dark,
    textSecondary: neutral.mediumDark,
    textTertiary: neutral.medium,
    background: neutral.white,
    surface: neutral.light,
    border: neutral.lighter,
    tint: semantic.primary,
    icon: neutral.mediumDark,
    tabIconDefault: neutral.mediumDark,
    tabIconSelected: semantic.primary,
  },
  dark: {
    text: '#ECEDEE',
    textSecondary: '#9BA1A6',
    textTertiary: '#687076',
    background: '#151718',
    surface: '#262A2E',
    border: '#383D42',
    tint: '#fff',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#fff',
  },
};

/**
 * GRADIENT COLORS (for future use)
 * Can be used with linear-gradient on web or libraries like expo-linear-gradient
 */
export const gradients = {
  primary: [semantic.primary, semantic.primaryDark],
  success: [semantic.success, semantic.successDark],
  warning: [semantic.warning, semantic.warningDark],
};

/**
 * EXAMPLE USAGE:
 * import { semantic, neutral, Colors } from '@/constants/colors';
 *
 * // Use semantic colors for meaningful elements
 * backgroundColor: semantic.success, // For completed items
 * backgroundColor: semantic.error, // For delete button
 *
 * // Use neutral colors for text, backgrounds
 * color: neutral.dark, // Primary text
 * color: neutral.medium, // Secondary text
 * backgroundColor: neutral.white, // Card background
 *
 * // Use theme-aware colors
 * color: Colors[colorScheme].text, // Adapts to dark/light mode
 */
