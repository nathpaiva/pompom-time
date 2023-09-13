import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { IdentityContextProvider } from 'react-netlify-identity'
import { RouterProvider } from 'react-router-dom'

import { router } from './routes'

// TODO: move it to another file
const _theme = {
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
}

export const theme = extendTheme(_theme)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <IdentityContextProvider url={import.meta.env.VITE_IDENTITY_URL}>
      <ChakraProvider theme={theme}>
        <RouterProvider router={router} />
      </ChakraProvider>
    </IdentityContextProvider>
  </React.StrictMode>,
)
