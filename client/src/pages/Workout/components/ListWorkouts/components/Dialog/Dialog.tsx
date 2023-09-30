import { DeleteIcon } from '@chakra-ui/icons'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react'
import { useRef } from 'react'

export function Dialog<T>({
  dialogAction: { isOpen, onClose },
  labels: { confirmAction, cancelAction },
  title,
  description,
  dataOnFocus,
}: {
  dialogAction: {
    isOpen: boolean
    onClose: (isConfirm: boolean) => void
  }
  title: string
  description: string
  labels: {
    confirmAction: string
    cancelAction: string
  }
  dataOnFocus: T | null
}) {
  const cancelRef = useRef(null)
  if (!dataOnFocus) return null

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={() => onClose(false)}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {title}
          </AlertDialogHeader>

          <AlertDialogBody>{description}</AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={() => onClose(false)}>
              {cancelAction}
            </Button>
            <Button
              rightIcon={<DeleteIcon />}
              colorScheme="red"
              onClick={() => onClose(true)}
              ml={3}
            >
              {confirmAction}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}
