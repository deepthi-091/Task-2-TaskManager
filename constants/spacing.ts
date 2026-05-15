/**
 * SPACING CONSTANTS
 *
 * Why use centralized spacing?
 * - Consistency: All components use the same spacing scale
 * - Maintainability: Change spacing in one place affects entire app
 * - Rhythm: Creates visual harmony across the UI
 * - DRY Principle: Don't Repeat Yourself - no magic numbers scattered in components
 */

export const spacing = {
  // Extra small spacing (4px)
  xs: 4,

  // Small spacing (8px)
  sm: 8,

  // Medium spacing (12px)
  md: 12,

  // Large spacing (16px)
  lg: 16,

  // Extra large spacing (20px)
  xl: 20,

  // Extra extra large spacing (24px)
  xxl: 24,

  // Extra extra extra large spacing (32px)
  xxxl: 32,
};

/**
 * Common spacing patterns used in the app:
 *
 * Horizontal padding: spacing.lg (16px) - comfortable margins on sides
 * Vertical padding: spacing.md (12px) - breathing room above/below content
 * Gap between items: spacing.sm (8px) to spacing.md (12px) - separation without crowding
 * Margin bottom: spacing.lg (16px) - section spacing
 */
