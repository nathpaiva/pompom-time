import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { IdentityContextProvider } from 'react-netlify-identity'
import { RouterProvider } from 'react-router-dom'

import { queryClient } from './config'
import { router } from './routes'
import { customVariant } from './utils'

// This app is light-only (see client/src/utils/theme.ts). Chakra normally
// reads the color mode from localStorage, so anyone who used the old
// dark-mode build keeps rendering dark forever. This manager always reports
// "light" and ignores writes, so a stale value can never take effect. See
// issue #113.
const lightOnlyColorModeManager = {
  type: 'localStorage' as const,
  ssr: false,
  get: () => 'light' as const,
  // eslint-disable-next-line @typescript-eslint/no-empty-function -- ignore writes on purpose, mode is pinned
  set: () => {},
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ColorModeScript initialColorMode="light" />
    <IdentityContextProvider url={import.meta.env.VITE_IDENTITY_URL}>
      <ChakraProvider
        theme={customVariant}
        colorModeManager={lightOnlyColorModeManager}
      >
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <ReactQueryDevtools />
        </QueryClientProvider>
      </ChakraProvider>
    </IdentityContextProvider>
  </StrictMode>,
)
