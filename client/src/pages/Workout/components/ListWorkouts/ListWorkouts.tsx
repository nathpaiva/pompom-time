import { DeleteIcon } from '@chakra-ui/icons'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  ButtonGroup,
  Card,
  Heading,
  IconButton,
  Stack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { Dispatch, useCallback, useEffect, useRef, useState } from 'react'
import { useIdentityContext } from 'react-netlify-identity'

import { IWorkout } from '../../types'

interface IListWorkouts {
  workouts: IWorkout[]
  setWorkouts: Dispatch<React.SetStateAction<IWorkout[]>>
}

export const ListWorkouts = ({ workouts, setWorkouts }: IListWorkouts) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [workoutOnFocus, setWorkoutOnFocus] = useState<IWorkout | null>(null)

  const cancelRef = useRef(null)
  const toast = useToast()
  const { user } = useIdentityContext()
  const title = workouts.length
    ? 'Select workout:'
    : `Oh no! You don't have  any workout yet :(`

  const getWorkouts = useCallback(() => {
    const _fetchData = async () => {
      try {
        const _response = await fetch(
          '/.netlify/functions/list-workouts-by-user-id',
          {
            headers: {
              Authorization: `Bearer ${user?.token.access_token}`,
              'Content-Type': 'application/json',
            },
          },
        )

        if (_response.status !== 200) {
          throw new Error('Error')
        }

        const response = (await _response.json()) as IWorkout[]

        setWorkouts(response)
      } catch (error) {
        toast({
          status: 'error',
          title: (error as Error).message,
        })
      }
    }

    _fetchData()
  }, [setWorkouts, toast, user?.token.access_token])

  const handleDelete = async (id: string) => {
    console.log('id', id)
    try {
      const _response = await fetch(
        '/.netlify/functions/delete-workout-by-id',
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${user?.token.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id,
          }),
        },
      )

      if (_response.status !== 200) {
        throw new Error('erro')
      }

      const response = (await _response.json()) as IWorkout

      setWorkouts((prev) => {
        return prev.filter((_workout) => _workout.id !== id)
      })
      toast({
        status: 'success',
        title: `Delete workout: ${response.name}`,
      })
    } catch (error) {
      toast({
        status: 'error',
        title: (error as Error).message,
      })
    } finally {
      onClose()
    }
  }

  useEffect(() => {
    if (!isOpen) {
      setWorkoutOnFocus(null)
    }
  }, [isOpen])

  useEffect(() => {
    getWorkouts()
  }, [getWorkouts])

  return (
    <Card variant="unstyled" p="1rem" minHeight="500px" rowGap="15px">
      <Heading size="md">{title}</Heading>
      <Stack spacing={5}>
        {/* TODO: add the input search */}
        {/* If the list is bigger then 5 */}
        {workouts.map((workout) => {
          return (
            <Card
              key={workout.id}
              display="grid"
              p="2"
              gridTemplateColumns="50% 1fr 90px"
              // justifyContent="center"
              alignItems="center"
              alignContent="center"
            >
              <span>{workout.name}</span>

              {/* TODO: change text to use icon */}
              <span>{workout.type}</span>

              <ButtonGroup>
                <Button size="sm" colorScheme="purple" width="max-content">
                  Start
                </Button>

                <IconButton
                  size="sm"
                  colorScheme="red"
                  width="max-content"
                  variant="outline"
                  aria-label="Add new workout"
                  icon={<DeleteIcon />}
                  data-workout={JSON.stringify(workout)}
                  onClick={() => {
                    // TODO: change this to open de modal and send the workout info
                    onOpen()
                    setWorkoutOnFocus(workout)
                  }}
                />
              </ButtonGroup>
            </Card>
          )
        })}
      </Stack>

      {/* TODO: change this dialog to get the workout info */}
      {workoutOnFocus && (
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef as any}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete workout
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure you want to delete {workoutOnFocus.name}?
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef as any} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => {
                    const { id } = workoutOnFocus

                    handleDelete(id)
                  }}
                  ml={3}
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      )}
    </Card>
  )
}
