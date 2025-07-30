/**
 * Design System Constants
 * 
 * Este arquivo contém as constantes e utilitários do design system
 * para garantir consistência em toda a aplicação.
 */

// Spacing Scale
export const SPACING = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '0.75rem',    // 12px
  lg: '1rem',       // 16px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '2rem',    // 32px
  '4xl': '2.5rem',  // 40px
} as const;

// Typography Scale
export const TYPOGRAPHY = {
  sizes: {
    xs: '0.75rem',   // 12px
    sm: '0.875rem',  // 14px
    base: '1rem',    // 16px
    lg: '1.125rem',  // 18px
    xl: '1.25rem',   // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

// Border Radius Scale
export const BORDER_RADIUS = {
  sm: '0.375rem',   // 6px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.5rem',  // 24px
} as const;

// Shadow Scale
export const SHADOWS = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
} as const;

// Component Variants
export const COMPONENT_VARIANTS = {
  card: {
    compact: 'card-compact',
    standard: 'card-standard',
    spacious: 'card-spacious',
    elevated: 'card-elevated',
  },
  button: {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    outline: 'btn-outline',
  },
  text: {
    heading: 'text-heading',
    body: 'text-body',
    caption: 'text-caption',
    label: 'text-label',
  },
  spacing: {
    xs: 'space-xs',
    sm: 'space-sm',
    md: 'space-md',
    lg: 'space-lg',
    xl: 'space-xl',
    '2xl': 'space-2xl',
  },
  padding: {
    xs: 'p-xs',
    sm: 'p-sm',
    md: 'p-md',
    lg: 'p-lg',
    xl: 'p-xl',
    '2xl': 'p-2xl',
  },
  margin: {
    xs: 'm-xs',
    sm: 'm-sm',
    md: 'm-md',
    lg: 'm-lg',
    xl: 'm-xl',
    '2xl': 'm-2xl',
  },
} as const;

// Layout Components
export const LAYOUT = {
  container: 'container-mobile',
  section: 'section-spacing',
  sectionLg: 'section-spacing-lg',
} as const;

// Interactive Elements
export const INTERACTIVE = {
  card: 'interactive-card',
  button: 'interactive-button',
} as const;

// Utility Functions
export const createSpacingClass = (type: 'space' | 'p' | 'm', size: keyof typeof SPACING) => {
  return `${type}-${size}`;
};

export const createCardClass = (variant: keyof typeof COMPONENT_VARIANTS.card) => {
  return COMPONENT_VARIANTS.card[variant];
};

export const createButtonClass = (variant: keyof typeof COMPONENT_VARIANTS.button) => {
  return COMPONENT_VARIANTS.button[variant];
};

export const createTextClass = (variant: keyof typeof COMPONENT_VARIANTS.text) => {
  return COMPONENT_VARIANTS.text[variant];
};

// Common Class Combinations
export const COMMON_CLASSES = {
  // Card layouts
  cardList: `${COMPONENT_VARIANTS.spacing.lg}`,
  cardGrid: 'grid grid-cols-1 gap-4',
  cardGrid2: 'grid grid-cols-2 gap-3',
  
  // Form layouts
  formSection: `${COMPONENT_VARIANTS.spacing.lg}`,
  formField: `${COMPONENT_VARIANTS.spacing.md}`,
  formActions: 'flex justify-end space-x-2 pt-4',
  
  // Header layouts
  pageHeader: 'flex items-center justify-between mb-6',
  sectionHeader: 'flex items-center space-x-2 mb-4',
  
  // List layouts
  listItem: 'flex items-center space-x-3 p-3',
  listItemCompact: 'flex items-center space-x-2 p-2',
  
  // Navigation layouts
  navItem: 'flex items-center space-x-2 p-2 rounded-md hover:bg-accent',
  navItemActive: 'flex items-center space-x-2 p-2 rounded-md bg-accent text-accent-foreground',
} as const;

// Animation Durations
export const ANIMATION = {
  fast: '150ms',
  normal: '200ms',
  slow: '300ms',
} as const;

// Z-Index Scale
export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const; 