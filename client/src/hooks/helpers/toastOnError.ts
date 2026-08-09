import { useToast } from '@chakra-ui/react'

/**
 * Shows an error toast for the given `Error`, using its message as the
 * toast title.
 *
 * @param toast the `useToast()` instance from the calling hook
 * @param error the error to show
 */
export function toastOnError(toast: ReturnType<typeof useToast>, error: Error) {
  toast({
    status: 'error',
    title: error.message,
  })
}
