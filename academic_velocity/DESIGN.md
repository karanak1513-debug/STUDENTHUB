---
name: Academic Velocity
colors:
  surface: '#fcf8ff'
  surface-dim: '#dcd8e5'
  surface-bright: '#fcf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f2ff'
  surface-container: '#f0ecf9'
  surface-container-high: '#eae6f4'
  surface-container-highest: '#e4e1ee'
  on-surface: '#1b1b24'
  on-surface-variant: '#464555'
  inverse-surface: '#302f39'
  inverse-on-surface: '#f3effc'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#ae2f34'
  on-secondary: '#ffffff'
  secondary-container: '#ff6b6b'
  on-secondary-container: '#6d0010'
  tertiary: '#7e3000'
  on-tertiary: '#ffffff'
  tertiary-container: '#a44100'
  on-tertiary-container: '#ffd2be'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#ffdad8'
  secondary-fixed-dim: '#ffb3b0'
  on-secondary-fixed: '#410006'
  on-secondary-fixed-variant: '#8c1520'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb695'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#7b2f00'
  background: '#fcf8ff'
  on-background: '#1b1b24'
  surface-variant: '#e4e1ee'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style

This design system is engineered for a Student Productivity Application, balancing the high energy of academic ambition with the structured calm required for deep focus. The aesthetic follows a **Corporate / Modern** movement with a "Soft-Tech" influence—utilizing crisp card-based layouts, meaningful motion, and high-legibility typography to manage complex information density.

The interface prioritizes clarity and momentum. It uses whitespace not just for aesthetics, but as a cognitive breathing room between dense data sets like course schedules, grade trackers, and task lists. The emotional goal is to move the student from a state of "overwhelmed" to "in control."

## Colors

The palette uses **Deep Indigo** as the primary driver for navigation and primary actions, establishing a sense of authority and stability. **Energetic Coral** is reserved for high-impact accents, such as "Start Study Session" buttons or deadline alerts, providing a necessary spark of urgency.

Functional colors (Emerald and Amber) are utilized for status tracking—grades, completion rates, and upcoming deadlines. The background remains a **Cool Slate** to reduce eye strain during long nights of study, while the **Pure White** surface cards provide clear containment for content.

## Typography

The design system utilizes **Plus Jakarta Sans** across all levels. Its open counters and modern geometric build ensure high legibility even at smaller sizes within data-heavy tables or calendars. 

Heavy weights (700-800) are used for "Display" and "Headline" roles to create a strong visual hierarchy, while "Body" copy maintains a standard 400 weight for optimal reading flow. "Labels" use increased letter spacing and semi-bold weights to distinguish metadata from primary content.

## Layout & Spacing

This design system employs a **Fluid Grid** model built on a 4px baseline rhythm. 
- **Desktop:** 12-column grid with 24px gutters and 40px side margins. 
- **Tablet:** 8-column grid with 16px gutters and 24px side margins.
- **Mobile:** 4-column grid with 16px gutters and 16px side margins.

Content is organized into logical containers (cards). Spacing between cards is typically `lg` (24px) to emphasize modularity, while internal padding within cards follows `md` (16px) to maintain information density without feeling cramped.

## Elevation & Depth

Visual hierarchy is conveyed through **Tonal Layers** and **Ambient Shadows**. The background sits at the lowest level (Z-0). Cards and primary containers sit at Z-1, using a soft, diffused shadow to indicate interactivity.

Shadow properties:
- **Low (Z-1):** 4px blur, 2px Y-offset, 4% opacity black. Used for standard content cards.
- **Medium (Z-2):** 12px blur, 6px Y-offset, 8% opacity Indigo-tinted shadow. Used for hovered states and active task items.
- **High (Z-3):** 24px blur, 12px Y-offset, 12% opacity black. Reserved for modals and pop-overs.

Surfaces should use subtle 1px inner strokes in a slightly darker neutral shade to maintain crisp edges against the slate background.

## Shapes

The shape language is **Rounded**, reflecting a friendly and accessible academic environment. 
- **Standard Cards:** 12px (`rounded-lg`) is the default for all major containers.
- **Buttons & Inputs:** 8px (`rounded-md`) provides a sturdy, actionable feel.
- **Status Chips:** Full pill-shape (`rounded-full`) is used to distinguish categorical labels from interactive elements.
- **Selection Indicators:** 4px (`rounded-sm`) for very small elements like checkbox internals or focus rings.

## Components

### Buttons
Primary buttons use a solid Indigo background with white text. Secondary buttons use a transparent background with an Indigo border. The "Coral" button is used exclusively for time-sensitive or high-reward actions (e.g., "Complete Quiz").

### Cards
Cards are the primary layout unit. Every card must have a white surface, a 12px corner radius, and a Z-1 shadow. Header sections within cards should be separated by a subtle `1px` horizontal rule in Cool Slate 100.

### Input Fields
Inputs use a 1px border (#E2E8F0) and an 8px radius. On focus, the border shifts to Primary Indigo with a 2px outer glow. Labels sit above the field in `label-md` style.

### Progress Bars
Used extensively for course completion. The track is a light Cool Slate, and the filler is Success Emerald. For "at-risk" subjects, the filler shifts to Warning Amber.

### Chips & Tags
Used for course codes (e.g., "CS101") or priorities. They utilize a light tinted background of the respective color (e.g., 10% opacity Indigo) with high-contrast text.

### Lists
Task lists utilize a "Ghost-State" for completed items: text opacity drops to 40% and a subtle strikethrough is applied. Checklist icons use the `rounded-sm` shape.