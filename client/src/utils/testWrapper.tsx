import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, RenderOptions } from '@testing-library/react'
import React, { ReactElement } from 'react'
import { BrowserRouter } from 'react-router-dom'

const queryClient = new QueryClient()

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
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>{children}</ChakraProvider>
      </QueryClientProvider>
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

function createFetchResponse<T>(data: T, status = 200) {
  return {
    status,
    json: () => new Promise((resolve) => resolve(data)),
  }
}

export function FetchApi() {
  return {
    mockedFetch: (data: any, status = 200) => {
      global.fetch = vi
        .fn()
        .mockResolvedValue(createFetchResponse(data, status))
    },
  }
}

const { _hoisted_useIdentityContext } = vi.hoisted(() => {
  return { _hoisted_useIdentityContext: vi.fn() }
})

vi.mock('react-netlify-identity', () => ({
  useIdentityContext: _hoisted_useIdentityContext,
}))

export * from '@testing-library/react'
export { customRender as render, _hoisted_useIdentityContext }
