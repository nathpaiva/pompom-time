import { QueryClient } from '@tanstack/react-query'

/**
 * set queries retry to false to test easily errors
 * we can change it to be dynamically
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: process.env.NODE_ENV === 'test' ? false : true,
    },
  },
})
