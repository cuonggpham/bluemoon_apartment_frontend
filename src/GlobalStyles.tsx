import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
:root {
  /* Apple-inspired Premium Brand Colors */
  --color-brand-50: #f8fafc;
  --color-brand-100: #f1f5f9;
  --color-brand-200: #e2e8f0;
  --color-brand-300: #cbd5e1;
  --color-brand-400: #94a3b8;
  --color-brand-500: #007aff;
  --color-brand-600: #0056cc;
  --color-brand-700: #003d99;
  --color-brand-800: #002966;
  --color-brand-900: #001433;
  
  /* Sophisticated Neutral Grey Scale - Apple-inspired */
  --color-grey-0: #ffffff;
  --color-grey-25: #fdfdfd;
  --color-grey-50: #fafafa;
  --color-grey-100: #f5f5f7;
  --color-grey-200: #e8e8ed;
  --color-grey-300: #d2d2d7;
  --color-grey-400: #aeaeb2;
  --color-grey-500: #8e8e93;
  --color-grey-600: #636366;
  --color-grey-700: #48484a;
  --color-grey-800: #2c2c2e;
  --color-grey-900: #1c1c1e;  
  
  /* Modern Apple-style Blue Palette */
  --color-blue-50: #eff6ff;
  --color-blue-100: #dbeafe;
  --color-blue-200: #bfdbfe;
  --color-blue-300: #93c5fd;
  --color-blue-400: #60a5fa;
  --color-blue-500: #007aff;
  --color-blue-600: #0056cc;
  --color-blue-700: #003d99;
  --color-blue-800: #002966;
  --color-blue-900: #001433;

  /* Success Green - Airbnb-inspired */
  --color-green-50: #ecfdf5;
  --color-green-100: #d1fae5;
  --color-green-200: #a7f3d0;
  --color-green-300: #6ee7b7;
  --color-green-400: #34d399;
  --color-green-500: #10b981;
  --color-green-600: #059669;
  --color-green-700: #047857;
  --color-green-800: #065f46;
  --color-green-900: #064e3b;

  /* Premium Warning Orange */
  --color-orange-50: #fff7ed;
  --color-orange-100: #ffedd5;
  --color-orange-200: #fed7aa;
  --color-orange-300: #fdba74;
  --color-orange-400: #fb923c;
  --color-orange-500: #f97316;
  --color-orange-600: #ea580c;
  --color-orange-700: #c2410c;
  --color-orange-800: #9a3412;
  --color-orange-900: #7c2d12;

  /* Error Red */
  --color-red-50: #fef2f2;
  --color-red-100: #fee2e2;
  --color-red-200: #fecaca;
  --color-red-300: #fca5a5;
  --color-red-400: #f87171;
  --color-red-500: #ef4444;
  --color-red-600: #dc2626;
  --color-red-700: #b91c1c;
  --color-red-800: #991b1b;
  --color-red-900: #7f1d1d;

  /* Premium Purple/Indigo Accent */
  --color-purple-50: #faf5ff;
  --color-purple-100: #f3e8ff;
  --color-purple-200: #e9d5ff;
  --color-purple-300: #d8b4fe;
  --color-purple-400: #c084fc;
  --color-purple-500: #a855f7;
  --color-purple-600: #9333ea;
  --color-purple-700: #7e22ce;
  --color-purple-800: #6b21a8;
  --color-purple-900: #581c87;
  
  /* Modern Backdrop */
  --backdrop-color: rgba(15, 23, 42, 0.8);
  --backdrop-blur: blur(8px);

  /* Enhanced Shadows for Depth - Apple-inspired */
  --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  --shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
  
  /* Premium glass-morphism shadows */
  --shadow-glass: 0 8px 32px rgba(31, 38, 135, 0.37);
  --shadow-elevated: 0 20px 40px rgba(0, 0, 0, 0.1);
  --shadow-floating: 0 12px 28px rgba(0, 0, 0, 0.08);

  /* Modern Border Radius - Apple-inspired */
  --border-radius-none: 0px;
  --border-radius-sm: 0.125rem;
  --border-radius-md: 0.375rem;
  --border-radius-lg: 0.5rem;
  --border-radius-xl: 0.75rem;
  --border-radius-2xl: 1rem;
  --border-radius-3xl: 1.5rem;
  --border-radius-4xl: 2rem;
  --border-radius-full: 9999px;  /* Typography Scale - Enhanced for better readability */
  --font-size-xs: 1.2rem;
  --font-size-sm: 1.35rem;
  --font-size-base: 1.5rem;
  --font-size-lg: 1.8rem;
  --font-size-xl: 2.1rem;
  --font-size-2xl: 2.4rem;
  --font-size-3xl: 2.8rem;
  --font-size-4xl: 3.2rem;
  --font-size-5xl: 4rem;
  --font-size-6xl: 5rem;
  --font-size-7xl: 6rem;
  --font-size-8xl: 8rem;

  /* Line Heights - Optimized for reading */
  --line-height-none: 1;
  --line-height-tight: 1.25;
  --line-height-snug: 1.375;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.625;
  --line-height-loose: 2;

  /* Enhanced Spacing Scale */
  --space-0: 0px;
  --space-0-5: 0.125rem;
  --space-1: 0.25rem;
  --space-1-5: 0.375rem;
  --space-2: 0.5rem;
  --space-2-5: 0.625rem;
  --space-3: 0.75rem;
  --space-3-5: 0.875rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-7: 1.75rem;
  --space-8: 2rem;
  --space-9: 2.25rem;
  --space-10: 2.5rem;
  --space-11: 2.75rem;
  --space-12: 3rem;
  --space-14: 3.5rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;
  --space-28: 7rem;
  --space-32: 8rem;
  --space-36: 9rem;
  --space-40: 10rem;
  --space-44: 11rem;
  --space-48: 12rem;
  --space-52: 13rem;
  --space-56: 14rem;
  --space-60: 15rem;
  --space-64: 16rem;
  --space-72: 18rem;
  --space-80: 20rem;
  --space-96: 24rem;

  /* Premium Transitions - Apple-inspired */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 500ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-bounce: 350ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --transition-elastic: 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94);

  /* Enhanced z-index scale */
  --z-index-dropdown: 1000;
  --z-index-sticky: 1020;
  --z-index-fixed: 1030;
  --z-index-modal-backdrop: 1040;
  --z-index-modal: 1050;
  --z-index-popover: 1060;
  --z-index-tooltip: 1070;
  --z-index-toast: 1080;

  /* Additional premium colors for diversity */
  --color-yellow-100: #fef9c3;
  --color-yellow-300: #fde047;
  --color-yellow-400: #facc15;
  --color-yellow-500: #eab308;
  --color-yellow-600: #ca8a04;
  --color-yellow-700: #a16207;

  --color-cyan-100: #cffafe;
  --color-cyan-500: #06b6d4;
  --color-cyan-700: #0e7490;

  --color-emerald-100: #d1fae5;
  --color-emerald-500: #10b981;
  --color-emerald-700: #047857;

  --color-pink-100: #fce7f3;
  --color-pink-500: #ec4899;
  --color-pink-700: #be185d;

  --color-silver-100: #e5e7eb;
  --color-silver-700: #374151;

  --color-indigo-100: #e0e7ff;
  --color-indigo-500: #6366f1;
  --color-indigo-700: #4338ca;

  /* Image filters */
  --image-grayscale: 0;
  --image-opacity: 100%;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  transition: background-color var(--transition-normal), 
              border-color var(--transition-normal),
              color var(--transition-normal),
              box-shadow var(--transition-normal),
              transform var(--transition-fast);
}

html {
  font-size: 62.5%;
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: "Inter", "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "SF Pro Display", sans-serif;
  font-weight: 400;
  color: var(--color-grey-800);
  background-color: var(--color-grey-25);
  line-height: var(--line-height-normal);
  font-size: 2.4rem;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  font-feature-settings: "kern" 1, "liga" 1, "calt" 1;
}

input,
button,
textarea,
select {
  font: inherit;
  color: inherit;
  border: none;
  background: none;
}

button {
  cursor: pointer;
  border: none;
  background: none;
  padding: 0;
  font-family: inherit;
  transition: all var(--transition-fast);
}

button:disabled,
input:disabled,
select:disabled,
textarea:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

select:disabled,
input:disabled {
  background-color: var(--color-grey-100);
  color: var(--color-grey-500);
}

/* Enhanced focus styles - Apple-inspired */
input:focus,
button:focus,
textarea:focus,
select:focus {
  outline: none;
  box-shadow: 0 0 0 3px var(--color-brand-200);
  border-color: var(--color-brand-500);
}

input:focus-visible,
button:focus-visible,
textarea:focus-visible,
select:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px var(--color-brand-200);
  border-color: var(--color-brand-500);
}

/* Remove focus outline for mouse users */
input:focus:not(:focus-visible),
button:focus:not(:focus-visible),
textarea:focus:not(:focus-visible),
select:focus:not(:focus-visible) {
  outline: none;
  box-shadow: none;
}

button:has(svg) {
  line-height: 0;
}

a {
  color: var(--color-brand-600);
  text-decoration: none;
  transition: color var(--transition-fast);
}

a:hover {
  color: var(--color-brand-700);
  text-decoration: underline;
}

ul {
  list-style: none;
}

p,
h1,
h2,
h3,
h4,
h5,
h6 {
  overflow-wrap: break-word;
  hyphens: auto;
  color: var(--color-grey-900);
}

/* Enhanced typography - Apple-inspired */
h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
  line-height: var(--line-height-tight);
  letter-spacing: -0.025em;
  margin-bottom: var(--space-4);
  font-feature-settings: "kern" 1, "liga" 1;
}

h1 {
  font-size: var(--font-size-4xl);
  font-weight: 700;
  letter-spacing: -0.05em;
}

h2 {
  font-size: var(--font-size-3xl);
  font-weight: 600;
  letter-spacing: -0.04em;
}

h3 {
  font-size: var(--font-size-2xl);
  font-weight: 600;
  letter-spacing: -0.03em;
}

h4 {
  font-size: var(--font-size-xl);
  font-weight: 600;
  letter-spacing: -0.02em;
}

h5 {
  font-size: var(--font-size-lg);
  font-weight: 500;
}

h6 {
  font-size: var(--font-size-base);
  font-weight: 500;
}

p {
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--space-4);
  color: var(--color-grey-700);
}

img {
  max-width: 100%;
  height: auto;
  display: block;
  filter: grayscale(var(--image-grayscale)) opacity(var(--image-opacity));
}

/* Enhanced Scrollbar Styling - Apple-inspired */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-grey-50);
  border-radius: var(--border-radius-full);
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, var(--color-grey-300), var(--color-grey-400));
  border-radius: var(--border-radius-full);
  border: 2px solid transparent;
  background-clip: content-box;
  transition: all var(--transition-fast);
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, var(--color-brand-400), var(--color-brand-500));
  transform: scaleY(1.1);
}

/* Firefox scrollbar */
* {
  scrollbar-width: thin;
  scrollbar-color: var(--color-grey-300) var(--color-grey-50);
}

/* Enhanced Selection styles */
::selection {
  background-color: var(--color-brand-100);
  color: var(--color-brand-900);
}

::-moz-selection {
  background-color: var(--color-brand-100);
  color: var(--color-brand-900);
}
`;
