import { useDisclosure } from '@chakra-ui/react'
import { useState } from 'react'

export function useDialog<T>() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [dataOnFocus, setDataOnFocus] = useState<T | null>(null)

  return {
    isOpen,
    onOpen,
    onClose,
    dataOnFocus,
    setDataOnFocus,
  }
}
