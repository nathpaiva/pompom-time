import { ChakraProvider } from '@chakra-ui/react'
import { render, RenderOptions } from '@testing-library/react'
import React, { ReactElement } from 'react'
import { BrowserRouter } from 'react-router-dom'

const AllTheProviders = ({
  children,
  initialEntries = '/',
}: {
  children: React.ReactNode
  initialEntries?: string
}) => {
  window.history.pushState({}, 'Test page', initialEntries)

  return (
    <BrowserRouter>
      <ChakraProvider>{children}</ChakraProvider>
    </BrowserRouter>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { initialEntries?: string },
) =>
  render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders
        initialEntries={options ? options.initialEntries : undefined}
      >
        {children}
      </AllTheProviders>
    ),
    ...options,
  })

export * from '@testing-library/react'
export { customRender as render }

const { _hoisted_useIdentityContext } = vi.hoisted(() => {
  return { _hoisted_useIdentityContext: vi.fn() }
})

vi.mock('react-netlify-identity', () => ({
  useIdentityContext: _hoisted_useIdentityContext,
}))

export { _hoisted_useIdentityContext }
