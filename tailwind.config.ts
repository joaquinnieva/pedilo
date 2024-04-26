import { nextui } from '@nextui-org/react';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      primary: '#00dba1',
      secondary: '#4281ff',
      accent: '#00cdb8',
      neutral: '#2a323c',
      card: '#313a49',
      gray: '#dbdbdb',
    },
  },
  plugins: [
    nextui({
      prefix: 'nextui', // prefix for themes variables
      addCommonColors: false, // override common colors (e.g. "blue", "green", "pink").
      defaultTheme: 'dark', // default theme from the themes object
      defaultExtendTheme: 'dark', // default theme to extend on custom themes
      layout: {}, // common layout tokens (applied to all themes)
      themes: {
        light: {
          layout: {}, // light theme layout tokens
          colors: {
            primary: '#f88c17',
            secondary: '#e7d50d',
          }, // light theme colors
        },
        dark: {
          extend: 'dark', // <- inherit default values from dark theme
          colors: {
            background: '#994313',
            foreground: '#431b07',
            primary: {
              50: '#fff9ed',
              100: '#fff2d5',
              200: '#fee0aa',
              300: '#fcc975',
              400: '#faa73d',
              500: '#f88c17',
              600: '#e7700d',
              700: '#c1550d',
              800: '#994313',
              900: '#7b3913',
              DEFAULT: '#f88c17',
              foreground: '#431b07',
            },
            secondary: '##e7d50d',
            focus: '#fcc975',
          },
          layout: {
            disabledOpacity: '0.3',
            radius: {
              small: '4px',
              medium: '6px',
              large: '8px',
            },
            borderWidth: {
              small: '1px',
              medium: '2px',
              large: '3px',
            },
          },
        },
        // ... custom themes
      },
    }),
  ],
};
export default config;
