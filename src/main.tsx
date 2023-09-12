import { ChakraProvider } from '@chakra-ui/react'
import netlifyIdentity from 'netlify-identity-widget'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { router } from './routes'

netlifyIdentity.init({
  logo: false,
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>,
)
