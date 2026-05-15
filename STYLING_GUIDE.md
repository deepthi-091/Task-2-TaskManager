# React Native Styling Guide - TaskManager App

This guide explains all styling concepts used in the refactored TaskManager app. Your manager can ask about any of these, and this document provides complete explanations.

---

## 📚 Table of Contents

1. [Fundamental Concepts](#fundamental-concepts)
2. [Styling Approaches](#styling-approaches)
3. [Responsive Design](#responsive-design)
4. [Platform-Specific Styling](#platform-specific-styling)
5. [Component-by-Component Breakdown](#component-by-component-breakdown)
6. [Best Practices](#best-practices)

---

## Fundamental Concepts

### 1. **Inline Styles vs StyleSheet**

#### Inline Styles (❌ Generally Avoided)
```javascript
// ❌ BAD - Inline styling
<View style={{ marginTop: 10, padding: 15, backgroundColor: '#fff' }} />
```

**Problems:**
- Creates new objects on every render = performance waste
- Hard to maintain - styles scattered everywhere
- Not reusable
- Difficult to debug

#### StyleSheet (✅ Preferred)
```javascript
// ✅ GOOD - StyleSheet
const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#fff',
  },
});
<View style={styles.container} />
```

**Benefits:**
- StyleSheet object created once and reused
- Validates CSS-like syntax at compile time (catches errors early)
- Easier to read and maintain
- Better performance (optimized by React Native)
- Styles are clearly organized at bottom of component

#### When is inline style OK? (Rare cases)
```javascript
// ✅ OK - Dynamic styles that change frequently
<View style={[styles.box, { width: dynamicWidth }]} />
```

**Still use StyleSheet as base, only dynamic values inline.**

---

### 2. **Flexbox Layout**

React Native uses **Flexbox for all layouts** (like CSS on web).

#### Key Concept: Flexbox Properties

```
┌─────────────────────────────────────────┐
│   Parent Container (flex: 1)            │
│                                         │
│  Child 1        Child 2       Child 3  │
│  (flex: 1)      (flex: 2)      (flex: 1)│
│                                         │
└─────────────────────────────────────────┘
```

#### `flex` Property
```javascript
const styles = StyleSheet.create({
  // flex: 1 means "take remaining space"
  // If parent has 3 children each with flex:1, they split space equally
  container: {
    flex: 1, // Takes all available space
  },
  child: {
    flex: 1, // Takes 1/3 of space (if 3 children)
  },
  expandedChild: {
    flex: 2, // Takes 2/3 of space (twice as much as others)
  },
});
```

**Real Example from TaskManager:**
```javascript
<View style={{ flex: 1 }}>
  <View style={{ flex: 0.2 }}>Header</View>      {/* 20% of space */}
  <View style={{ flex: 0.6 }}>TaskList</View>   {/* 60% of space */}
  <View style={{ flex: 0.2 }}>Footer</View>     {/* 20% of space */}
</View>
```

---

### 3. **flexDirection**

Controls if items stack **horizontally** or **vertically**.

```javascript
// flexDirection: 'row' (DEFAULT) - items go left to right
// ┌──────────┬──────────┬──────────┐
// │  Item 1  │  Item 2  │  Item 3  │
// └──────────┴──────────┴──────────┘

// flexDirection: 'column' - items go top to bottom (DEFAULT in RN)
// ┌──────────┐
// │  Item 1  │
// ├──────────┤
// │  Item 2  │
// ├──────────┤
// │  Item 3  │
// └──────────┘

const styles = StyleSheet.create({
  // Horizontal layout (buttons side-by-side)
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  
  // Vertical layout (list items stacked)
  list: {
    flexDirection: 'column',
    gap: 8,
  },
});
```

---

### 4. **justifyContent** (Distribution along main axis)

Controls spacing along the **direction** items are flowing (row or column).

```
Main axis = direction items flow:
- In flexDirection: 'row' → main axis is HORIZONTAL (→)
- In flexDirection: 'column' → main axis is VERTICAL (↓)
```

#### Visual Examples:

```javascript
// flex-start (DEFAULT) - items packed at start
// ┌────────┬────────┬────────┐          ┐
// │ Item   │ Item   │ Item   │[Empty]  │
// └────────┴────────┴────────┴──────────┘

// center - items centered
// ┌──────┐┌────────┬────────┬────────┐┌──────┐
// │Empty││ Item   │ Item   │ Item   ││Empty │
// └──────┘└────────┴────────┴────────┘└──────┘

// space-between - items at edges, space in middle
// ┌────────┐          ┌────────┐          ┌────────┐
// │ Item   │[  space ]│ Item   │[  space ]│ Item   │
// └────────┘          └────────┘          └────────┘

// space-around - equal space around each item
// ┌──┐┌────────┐┌──┐┌────────┐┌──┐┌────────┐┌──┐
// │sp││ Item   ││sp││ Item   ││sp││ Item   ││sp│
// └──┘└────────┘└──┘└────────┘└──┘└────────┘└──┘

// space-evenly - equal space between everything
// ┌──┐┌────────┐┌──┐┌────────┐┌──┐┌────────┐┌──┐
// │sp││ Item   ││sp││ Item   ││sp││ Item   ││sp│
// └──┘└────────┘└──┘└────────┘└──┘└────────┘└──┘
```

#### When to use each:

```javascript
// flex-start: When you want compact, left-aligned buttons
justifyContent: 'flex-start',

// center: For centered content (title, logo)
justifyContent: 'center',

// space-between: Header with title on left, icon on right
justifyContent: 'space-between',

// space-around: Equal spacing around filter buttons
justifyContent: 'space-around',

// space-evenly: Evenly distributed stats cards
justifyContent: 'space-evenly',
```

---

### 5. **alignItems** (Alignment across cross axis)

Controls alignment **perpendicular** to the direction items flow.

```
If flexDirection: 'row' (items go →)
  alignItems controls vertical positioning ↕

If flexDirection: 'column' (items go ↓)
  alignItems controls horizontal positioning ↔
```

#### Visual Examples:

```javascript
// flex-start - items at top (for row) or left (for column)
// ┌──────────────────────────┐
// │Item1  Item2  Item3       │
// │                          │
// │                          │
// └──────────────────────────┘

// center - items centered vertically (for row) or horizontally (for column)
// ┌──────────────────────────┐
// │                          │
// │  Item1  Item2  Item3     │
// │                          │
// └──────────────────────────┘

// stretch - items stretch to fill (very useful!)
// ┌──────────────────────────┐
// │Item1│Item2│Item3│        │
// │     │     │     │        │
// │     │     │     │        │
// └──────────────────────────┘
```

#### Real TaskManager Example:

```javascript
// Task item container
container: {
  flexDirection: 'row',
  alignItems: 'center',  // ← Vertically center checkbox with title
  // Without this, checkbox would be at top, title below
},

// Filter buttons row
filterRow: {
  flexDirection: 'row',
  alignItems: 'center',  // ← Center filter text + badge vertically
  justifyContent: 'space-between',  // ← Spread filters across width
},
```

---

### 6. **alignSelf**

Allows a **single child** to override parent's `alignItems`.

```javascript
const styles = StyleSheet.create({
  // Parent says: center all children
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // But this one item aligns itself differently
  dragHandle: {
    alignSelf: 'flex-start',  // ← Override parent, go to top
  },
});
```

**Real Example:**
```javascript
// In TaskDetailModal, drag handle should be at top-center
handle: {
  alignSelf: 'center',  // ← Override parent alignment
  width: 40,
  height: 4,
  backgroundColor: '#E5E7EB',
  borderRadius: 2,
}
```

---

### 7. **gap** (Spacing between items)

Instead of adding margin to each item, use `gap` in parent.

```javascript
// ❌ OLD WAY - Add margin to children
child: { marginRight: 8 },

// ✅ NEW WAY - Use gap in parent (cleaner!)
parent: {
  flexDirection: 'row',
  gap: 8,  // ← 8px spacing between all children
}
```

**Why gap is better:**
- Single source of truth for spacing
- Works with flexDirection: 'row' and 'column'
- No need to exclude last item
- More readable

---

### 8. **flexWrap**

What happens when items exceed container width?

```javascript
// flexWrap: 'nowrap' (DEFAULT) - items shrink or overflow
// ┌────────────────────────────────┐
// │Item1 Item2 Item3 Item4 Item5   │ (might overflow)
// └────────────────────────────────┘

// flexWrap: 'wrap' - items wrap to next line
// ┌────────────────────────────────┐
// │Item1 Item2 Item3               │
// │Item4 Item5                     │
// └────────────────────────────────┘
```

**When to use:**
```javascript
// Tag list (can wrap to multiple lines)
tagContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 8,
},

// Button row (NO wrap, use horizontal scroll instead)
buttonRow: {
  flexDirection: 'row',
  flexWrap: 'nowrap',
}
```

---

## Styling Approaches

### Pattern 1: StyleSheet Organization

```javascript
import { StyleSheet } from 'react-native';

export function MyComponent() {
  return <View style={styles.container} />;
}

// All styles at bottom, organized by section
const styles = StyleSheet.create({
  // Container section
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  
  // Header section
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  
  // Content section
  listContent: {
    paddingBottom: 32,
  },
});
```

### Pattern 2: Combining Multiple Styles

```javascript
// ✅ GOOD - Combine base style with conditional style
<View style={[
  styles.item,                    // Base styles
  completed && styles.itemDone,   // Conditional styles
  { marginTop: dynamicValue }     // Only dynamic values inline
]} />
```

### Pattern 3: Reusable Style Combinations

```javascript
const styles = StyleSheet.create({
  // Create combinations for reuse
  buttonBase: {
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  buttonPrimary: {
    ...styles.buttonBase,  // Inherit base styles
    backgroundColor: '#0a7ea4',
  },
  
  buttonSecondary: {
    ...styles.buttonBase,
    backgroundColor: '#F3F4F6',
  },
});
```

---

## Responsive Design

### Problem: Different Screen Sizes
- iPhone SE: 375px wide
- iPhone 14: 390px wide
- iPhone 14 Pro Max: 430px wide
- iPad: 1024px wide

Without responsive design, your app looks cramped on small phones and wasted space on tablets.

### Solution 1: Using `Dimensions`

```javascript
import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Calculate responsive width (percentage-based)
const cardWidth = (screenWidth - 40) * 0.5;  // Half width minus padding

const styles = StyleSheet.create({
  container: {
    width: screenWidth - 40,  // Full width minus padding
    marginHorizontal: 20,
  },
  card: {
    width: cardWidth,
  },
});
```

### Solution 2: Using Responsive Constants

```javascript
// In constants/responsive.ts
export const responsive = {
  screenWidth,
  screenHeight,
  width: (percentage) => (screenWidth * percentage) / 100,
  height: (percentage) => (screenHeight * percentage) / 100,
  isSmallScreen: screenWidth < 375,
  isMediumScreen: screenWidth >= 375 && screenWidth < 600,
  isLargeScreen: screenWidth >= 600,
};

// Usage in component
const styles = StyleSheet.create({
  container: {
    width: responsive.width(90),  // 90% of screen width
    paddingHorizontal: responsive.responsivePadding(),  // Adapts to screen size
  },
});
```

### Solution 3: PixelRatio for Font Scaling

```javascript
import { PixelRatio } from 'react-native';

const fontScale = PixelRatio.getFontScale();

const styles = StyleSheet.create({
  title: {
    fontSize: 24 * fontScale,  // Scales with device's text size setting
  },
});

/**
 * Why PixelRatio matters:
 * - Some devices have higher pixel density (smaller physical pixels)
 * - Users can change text size in Settings
 * - PixelRatio helps text stay readable on all devices
 * - Websites use similar concept with rem units
 */
```

---

## Platform-Specific Styling

### Problem: iOS and Android have different UX conventions
- iOS uses rounded corners and smooth scrolling
- Android uses material design and sharper edges
- Safe areas differ (notch, home indicator)

### Solution: `Platform.OS`

```javascript
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    // Both platforms
    padding: 16,
    // iOS-specific
    paddingTop: Platform.OS === 'ios' ? 20 : 16,
    // Android-specific  
    elevation: Platform.OS === 'android' ? 4 : 0,
    // iOS uses shadowColor, Android uses elevation
    shadowColor: Platform.OS === 'ios' ? '#000' : 'transparent',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

// Or use Platform.select() for larger blocks
const KeyboardBehavior = Platform.select({
  ios: 'padding',
  android: undefined,
});

<KeyboardAvoidingView behavior={KeyboardBehavior} />
```

### Common Platform Differences:

```javascript
// Shadows (iOS) vs Elevation (Android)
{
  // iOS
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  
  // Android
  elevation: 4,
}

// Padding (iOS has notch/home indicator)
{
  paddingTop: Platform.OS === 'ios' ? 20 : 16,
  paddingBottom: Platform.OS === 'ios' ? 20 : 16,
}

// Keyboard behavior
behavior={Platform.OS === 'ios' ? 'padding' : undefined}
```

---

## Component-by-Component Breakdown

### **Screen: app/(tabs)/index.tsx - Task List Screen**

#### Layout Strategy

```
Screen Layout:
┌─────────────────────────────────────┐
│          HEADER                     │  (flexDirection: 'row')
│  [Title]              [Progress]    │  (justifyContent: 'space-between')
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│       PROGRESS BAR                  │  (width: 100%)
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│     STATS CARDS                     │  (flexDirection: 'row')
│  [Total] [Pending] [Done]           │  (justifyContent: 'space-between')
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│    ADD TASK INPUT                   │  (flexDirection: 'row')
│  [TextInput......] [+ Add Button]   │  (gap: 10)
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│     FILTER TABS                     │  (flexDirection: 'row')
│  [All] [Pending] [Done]             │  (justifyContent: 'space-between')
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│                                     │
│     TASK LIST                       │  (flex: 1)
│   - Task 1                          │  (flexDirection: 'column')
│   - Task 2                          │  (gap: 10)
│   - Task 3                          │
│                                     │
└─────────────────────────────────────┘
```

#### Key Styling Decisions

**1. Header (flexDirection: 'row' + justifyContent: 'space-between')**
```javascript
header: {
  flexDirection: 'row',        // Items go left-to-right
  justifyContent: 'space-between',  // Title on left, Progress on right
  alignItems: 'center',        // Vertically centered
  paddingHorizontal: 20,       // Equal padding both sides
  paddingVertical: 20,
},
```
**Why:** Two elements (title + progress) need to be on opposite ends of header.

**2. Stats Cards (flexDirection: 'row' + space-between)**
```javascript
statsRow: {
  flexDirection: 'row',
  gap: 10,  // 10px between cards
  marginBottom: 16,
},
statCard: {
  flex: 1,  // Each takes equal space
  alignItems: 'center',
  justifyContent: 'center',
},
```
**Why:** Three equal-width cards spread across screen with equal gaps.

**3. Task List (flex: 1)**
```javascript
listContent: {
  paddingHorizontal: 20,
  paddingBottom: 32,  // Extra space at bottom so last task isn't cut off
  flexGrow: 1,  // Let list take remaining space
},
```
**Why:** List should take ALL remaining space (not fixed height).

---

### **Component: components/TaskItem.tsx**

#### Layout Strategy

```
Task Item Layout:
┌───┬───────────────────────────┬─────┐
│   │                           │     │
│ ■ │ Task Title Here...        │ 👁 ✏ 🗑 │
│   │                           │     │
└───┴───────────────────────────┴─────┘
 bar checkbox    title            actions
```

#### Key Styling Decisions

**1. Container (flexDirection: 'row' + alignItems: 'center')**
```javascript
container: {
  flexDirection: 'row',      // All parts in one line (→)
  alignItems: 'center',      // Vertically center all items
  paddingHorizontal: 14,
  borderRadius: 14,
},
```
**Why:** Checkbox, title, and action buttons should be on same line and vertically centered.

**2. Title Area (flex: 1)**
```javascript
titleArea: {
  flex: 1,  // Takes all remaining space
  paddingHorizontal: 12,
},
```
**Why:** Title should expand to fill space between checkbox and action buttons.

**3. Action Buttons (flexDirection: 'row' + gap)**
```javascript
actions: {
  flexDirection: 'row',      // Buttons in a row (→)
  alignItems: 'center',      // Center buttons vertically
  gap: 4,  // Small gap between buttons
  paddingRight: 10,
},
```
**Why:** Three small buttons should sit together on the right side.

---

### **Component: components/TaskDetailModal.tsx**

#### Layout Strategy

```
Modal Sheet Layout:
┌────────────────────────────────────┐
│          [Drag Handle]             │  (alignSelf: 'center')
├────────────────────────────────────┤
│  STATUS BADGE                      │  (alignSelf: 'flex-start')
│  Task Title                        │  (fontSize: 22)
├────────────────────────────────────┤
│  Created    Dec 15, 2024           │  (justifyContent: 'space-between')
├────────────────────────────────────┤
│  [Mark Complete] [Edit] [Delete]   │  (gap: 10)
└────────────────────────────────────┘
```

#### Key Styling Decisions

**1. Drag Handle (alignSelf: 'center')**
```javascript
handle: {
  alignSelf: 'center',  // Override parent, position in center
  width: 40,
  height: 4,
},
```
**Why:** Handle should be centered horizontally on sheet, not stretched.

**2. Meta Row (flexDirection: 'row' + space-between)**
```javascript
metaRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',  // Label on left, value on right
  alignItems: 'center',
},
```
**Why:** "Created" label on left, date/time value on right.

**3. Action Buttons (flexDirection: 'row' + gap)**
```javascript
actionRow: {
  flexDirection: 'row',
  gap: 10,
},
actionBtn: {
  flex: 1,  // All get equal space
},
toggleBtn: {
  flex: 2,  // Toggle button gets 2x space (more important)
},
```
**Why:** Three buttons spread across width, toggle button emphasized (flex: 2).

---

## Best Practices

### ✅ DO's

1. **Use StyleSheet.create()** - Organize styles at bottom of component
```javascript
const styles = StyleSheet.create({
  // All styles here
});
```

2. **Use centralized spacing constants**
```javascript
import { spacing } from '@/constants/spacing';
padding: spacing.lg,  // Instead of padding: 16
```

3. **Combine styles for variants**
```javascript
<View style={[styles.container, isActive && styles.containerActive]} />
```

4. **Use responsive utilities**
```javascript
import { responsive } from '@/constants/responsive';
width: responsive.width(90),  // 90% of screen
```

5. **Group related styles**
```javascript
// Group by section
// Header section
header: { ... },
headerTitle: { ... },

// Content section
content: { ... },
```

### ❌ DON'Ts

1. **Don't create inline objects on every render**
```javascript
// ❌ BAD - New object created every render
<View style={{ paddingHorizontal: 16, flex: 1 }} />

// ✅ GOOD - Single reference every render
<View style={styles.container} />
```

2. **Don't hardcode magic numbers**
```javascript
// ❌ BAD
paddingHorizontal: 20,
marginBottom: 15,
fontSize: 18,

// ✅ GOOD
paddingHorizontal: spacing.lg,
marginBottom: spacing.lg,
fontSize: responsive.fontSize(18),
```

3. **Don't mix flex and fixed sizes randomly**
```javascript
// ❌ UNCLEAR - Is this a flex container or fixed?
<View style={{ width: 300, flex: 1 }} />

// ✅ CLEAR - Either flex OR width
<View style={{ flex: 1 }} />
<View style={{ width: 300 }} />
```

4. **Don't forget alignItems when using flexDirection: 'row'**
```javascript
// ❌ BAD - Items not vertically centered
<View style={{ flexDirection: 'row' }}>

// ✅ GOOD - Items are centered
<View style={{ flexDirection: 'row', alignItems: 'center' }}>
```

5. **Don't ignore Platform differences**
```javascript
// ❌ BAD - Looks different on iOS and Android
<View style={{ shadowOpacity: 0.1 }} />

// ✅ GOOD - Works on both platforms
<View style={{
  shadowColor: Platform.OS === 'ios' ? '#000' : 'transparent',
  shadowOpacity: 0.1,
  elevation: Platform.OS === 'android' ? 4 : 0,
}} />
```

---

## Summary Table

| Concept | What | When | Example |
|---------|------|------|---------|
| **Flex** | Proportion of space | Dividing space between elements | `flex: 1` on child = 1/3 space |
| **flexDirection** | Flow direction | Horizontal vs vertical | `'row'` for buttons side-by-side |
| **justifyContent** | Main axis spacing | Distributing along flow direction | `'space-between'` for header ends |
| **alignItems** | Cross axis alignment | Centering perpendicular to flow | `'center'` for vertically centered row |
| **alignSelf** | Single item override | Exceptions to alignItems | `'flex-start'` on drag handle |
| **gap** | Spacing between items | Consistent padding between items | `gap: 10` for 10px between items |
| **flexWrap** | Wrapping behavior | Items overflow handling | `'wrap'` for tag lists |
| **Dimensions** | Screen size | Responsive widths | `width: responsive.width(90)` |
| **PixelRatio** | Font scaling | Device text scaling | `fontSize: 16 * fontScale` |
| **Platform.OS** | Platform check | Platform-specific styling | `elevation: android ? 4 : 0` |

---

## Next Steps

- Review STYLING_GUIDE.md to understand all concepts
- Check constants/ folder for centralized spacing, colors, responsive utilities
- Look at refactored components for practical examples
- Ask questions about any styling decisions!

---

**Created for TaskManager App - Mentee Documentation**
