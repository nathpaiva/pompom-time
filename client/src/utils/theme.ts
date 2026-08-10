import { extendTheme } from '@chakra-ui/react'

const activeLabelStyles = {
  transform: 'scale(0.85) translateY(-24px)',
}

export const customVariant = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  fonts: {
    heading: `'Quicksand', sans-serif`,
    body: `'Nunito', sans-serif`,
  },
  colors: {
    pompom: {
      primary: '#655D8A',
      secondary: '#7897AB',
      tertiary: '#D885A3',
      quaternary: '#F2C6B6',
      bg: '#F3ECE7',
      screen: '#FFFFFF',
      inset: '#FBF7F4',
      searchBg: '#F5EEEA',
      text: '#2E2438',
      textMuted: '#8D8096',
      border: '#E7DFE6',
      divider: '#F0EAEE',
    },
  },
  radii: {
    pompomInput: '14px',
    pompomCard: '20px',
    pompomPill: '999px',
    pompomPhoneFrame: '48px',
  },
  components: {
    Form: {
      variants: {
        floating: {
          container: {
            _focusWithin: {
              label: {
                ...activeLabelStyles,
              },
            },
            'input:not(:placeholder-shown) + label, .chakra-select__wrapper:has(select option:checked:not([value=""])) + label, textarea:not(:placeholder-shown) ~ label, input:not(:placeholder-shown) + div + label':
              {
                ...activeLabelStyles,
              },
            label: {
              top: 0,
              left: 0,
              zIndex: 2,
              position: 'absolute',
              backgroundColor: 'var(--chakra-colors-chakra-body-bg)',
              pointerEvents: 'none',
              mx: 3,
              px: 1,
              my: 2,
              transformOrigin: 'left top',
            },
          },
        },
      },
    },
  },
  styles: {
    global: {
      main: {
        maxWidth: 'xl',
        margin: 'auto',
        minHeight: '600px',
      },
      ul: {
        listStyleType: 'none',
      },
    },
  },
})

export const pompomGlowShadow = (hexColor: string) =>
  `0 10px 24px ${hexColor}66`
