import { ChakraProvider } from '@chakra-ui/react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { IdentityContextProvider } from 'react-netlify-identity'
import { RouterProvider } from 'react-router-dom'

import { router } from './routes'
import { customVariant } from './utils'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <IdentityContextProvider url={import.meta.env.VITE_IDENTITY_URL}>
      <ChakraProvider theme={customVariant}>
        <RouterProvider router={router} />
      </ChakraProvider>
    </IdentityContextProvider>
  </React.StrictMode>,
)
