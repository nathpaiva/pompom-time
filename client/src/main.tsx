import { ChakraProvider } from '@chakra-ui/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { IdentityContextProvider } from 'react-netlify-identity'
import { RouterProvider } from 'react-router-dom'

import { router } from './routes'
import { customVariant } from './utils'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <IdentityContextProvider url={import.meta.env.VITE_IDENTITY_URL}>
      <ChakraProvider theme={customVariant}>
        <RouterProvider router={router} />
      </ChakraProvider>
    </IdentityContextProvider>
  </StrictMode>,
)
