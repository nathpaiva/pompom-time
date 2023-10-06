import { ChakraProvider } from '@chakra-ui/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { IdentityContextProvider } from 'react-netlify-identity'
import { RouterProvider } from 'react-router-dom'

import { queryClient } from './config'
import { router } from './routes'
import { customVariant } from './utils'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <IdentityContextProvider url={import.meta.env.VITE_IDENTITY_URL}>
      <ChakraProvider theme={customVariant}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <ReactQueryDevtools />
        </QueryClientProvider>
      </ChakraProvider>
    </IdentityContextProvider>
  </StrictMode>,
)
