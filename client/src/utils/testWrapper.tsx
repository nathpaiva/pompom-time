import { ChakraProvider } from '@chakra-ui/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { render, RenderOptions } from '@testing-library/react'
import React, { ReactElement } from 'react'
import { BrowserRouter } from 'react-router-dom'

import { queryClient } from '../config'

const WrapTestWithProviders = ({
  children,
  initialEntries = '/',
}: {
  children: React.ReactNode
  initialEntries?: string
}) => {
  window.history.pushState({}, 'Test page', initialEntries)

  return (
    <BrowserRouter window={window}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>{children}</ChakraProvider>
      </QueryClientProvider>
    </BrowserRouter>
  )
}

const _render = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { initialEntries?: string },
) =>
  render(ui, {
    wrapper: ({ children }) => (
      <WrapTestWithProviders
        initialEntries={options ? options.initialEntries : undefined}
      >
        {children}
      </WrapTestWithProviders>
    ),
    ...options,
  })

export function createFetchResponse<T>(data: T, status = 200) {
  return {
    status,
    statusText: status === 200 ? 'Success' : 'Error on request',
    json: () =>
      new Promise((resolve, reject) => {
        if (status !== 200) {
          return reject(data)
        }

        return resolve(data)
      }),
  }
}

const { _hoisted_useIdentityContext } = vi.hoisted(() => {
  return { _hoisted_useIdentityContext: vi.fn() }
})

vi.mock('react-netlify-identity', () => ({
  useIdentityContext: _hoisted_useIdentityContext,
}))

export * from '@testing-library/react'
export { _render as render, _hoisted_useIdentityContext }
