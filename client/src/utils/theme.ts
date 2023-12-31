import { extendTheme } from '@chakra-ui/react'

const activeLabelStyles = {
  transform: 'scale(0.85) translateY(-24px)',
}

export const customVariant = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
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
        maxWidth: '1400px',
        margin: 'auto',
      },
      ul: {
        listStyleType: 'none',
      },
    },
  },
})
