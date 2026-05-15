/**
 * RESPONSIVE DESIGN UTILITIES
 *
 * Why do we need responsive design?
 * Different devices have different screen sizes:
 * - iPhone SE (small): ~375px wide
 * - iPhone 14 (medium): ~390px wide
 * - iPhone 14 Pro Max (large): ~430px wide
 * - iPad (very large): ~1024px wide
 *
 * Using Dimensions helps us create layouts that adapt to any screen size
 */

import { Dimensions, PixelRatio } from 'react-native';

// Get current screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

/**
 * What is PixelRatio?
 * Different phones have different pixel densities (DPI).
 * PixelRatio helps us understand device scaling:
 * - iPhone 12: PixelRatio = 3 (each CSS pixel = 3 physical pixels)
 * - iPhone SE: PixelRatio = 2
 * - Android varies widely
 *
 * Why use it for fonts?
 * Phones with higher PixelRatio might have smaller fonts, so we scale them.
 */
const fontScale = PixelRatio.getFontScale();

export const responsive = {
  // Screen dimensions
  screenWidth,
  screenHeight,

  /**
   * Responsive width calculation
   * Usage: const width = responsive.width(80);
   * This gives 80% of screen width
   *
   * Why percentage-based width?
   * - Works on any phone size
   * - More natural than hardcoded pixels for dynamic layouts
   * - Common pattern in web design (flexbox)
   */
  width: (percentage: number) => (screenWidth * percentage) / 100,

  /**
   * Responsive height calculation
   * Usage: const height = responsive.height(20);
   * This gives 20% of screen height
   *
   * Why percentage-based height?
   * - Accounts for different phone heights (some taller, some shorter)
   * - Prevents hardcoded values that break on some devices
   */
  height: (percentage: number) => (screenHeight * percentage) / 100,

  /**
   * Responsive font size
   * Usage: fontSize: responsive.fontSize(16);
   *
   * Why scale font sizes?
   * Users with accessibility settings or high DPI phones need proper scaling
   * PixelRatio accounts for device-specific scaling
   *
   * Example:
   * - On regular phone (PixelRatio=2): fontSize(16) = 16
   * - On high-DPI phone (PixelRatio=3): fontSize(16) might be auto-scaled by OS
   * Using fontScale helps maintain readability across devices
   */
  fontSize: (size: number) => size * fontScale,

  /**
   * Is small screen?
   * Returns true if screen width < 375px (small phones like iPhone SE)
   *
   * Why check screen size?
   * Helps apply special styling for cramped screens:
   * - Reduce padding on very small phones
   * - Stack buttons vertically instead of horizontally
   * - Use smaller fonts
   */
  isSmallScreen: screenWidth < 375,

  /**
   * Is medium screen?
   * Returns true if screen width between 375px and 600px
   */
  isMediumScreen: screenWidth >= 375 && screenWidth < 600,

  /**
   * Is large screen?
   * Returns true if screen width >= 600px (tablets, large phones)
   */
  isLargeScreen: screenWidth >= 600,

  /**
   * Get responsive padding based on screen size
   *
   * Why adaptive padding?
   * - Small phones (iPhone SE): Less padding = more content visible
   * - Large phones: More padding = better spacing
   * - Creates comfortable, usable layouts on all devices
   */
  responsivePadding: () => {
    if (responsive.isSmallScreen) return 12; // Small phones: 12px
    if (responsive.isLargeScreen) return 24; // Tablets: 24px
    return 16; // Default phones: 16px
  },

  /**
   * Calculate number of columns for grid
   * Based on screen width
   *
   * Why dynamic columns?
   * - Phone: 1 column
   * - Tablet: 2-3 columns
   * Uses available space efficiently
   */
  getGridColumns: () => {
    if (responsive.isLargeScreen) return 2;
    return 1;
  },
};

/**
 * EXAMPLE USAGE IN COMPONENTS:
 *
 * import { responsive } from '@/constants/responsive';
 *
 * // Use responsive width
 * width: responsive.width(90), // 90% of screen
 *
 * // Use responsive font size
 * fontSize: responsive.fontSize(16),
 *
 * // Conditional styling
 * paddingHorizontal: responsive.responsivePadding(),
 *
 * // Check device size
 * if (responsive.isSmallScreen) {
 *   // Apply special styling for small phones
 * }
 */
