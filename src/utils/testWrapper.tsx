import { ChakraProvider } from '@chakra-ui/react'
import { render, RenderOptions } from '@testing-library/react'
import netlifyIdentity from 'netlify-identity-widget'
import React, { ReactElement } from 'react'
import { BrowserRouter } from 'react-router-dom'

netlifyIdentity.init({
  logo: false,
})

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <ChakraProvider>{children}</ChakraProvider>
    </BrowserRouter>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }
