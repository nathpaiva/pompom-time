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
  Skeleton,
  Stack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { Dispatch, useEffect, useRef, useState } from 'react'
import { useIdentityContext } from 'react-netlify-identity'

import { useListByUserId } from '../../../../hooks'
import { headersCommonSetup } from '../../../../utils'
import { IWorkout } from '../../types'

interface IListWorkouts {
  workouts: IWorkout[]
  setWorkouts: Dispatch<React.SetStateAction<IWorkout[]>>
}

// TODO: change those components are using workouts in the state to use redux or context
export const ListWorkouts = ({
  workouts: _workouts,
  setWorkouts,
}: IListWorkouts) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [workoutOnFocus, setWorkoutOnFocus] = useState<IWorkout | null>(null)

  const cancelRef = useRef(null)
  const toast = useToast()
  const { user } = useIdentityContext()

  const { isLoading, error } = useListByUserId(
    _workouts,
    setWorkouts,
    user?.token.access_token,
  )

  const title = _workouts?.length
    ? 'Select workout:'
    : `Oh no! You don't have any workout yet :(`

  const handleDelete = async (id: string) => {
    try {
      if (!user?.token) {
        throw new Error('You are not authenticated')
      }

      const _response = await fetch(
        '/.netlify/functions/delete-workout-by-id',
        {
          method: 'DELETE',
          ...headersCommonSetup(user.token.access_token),
          body: JSON.stringify({
            id,
          }),
        },
      )

      if (_response.status !== 200) {
        throw new Error('Error')
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

  return (
    <Card variant="unstyled" p="1rem" minHeight="500px" rowGap="15px">
      <Skeleton isLoaded={!isLoading}>
        <Heading size="md">
          {!error ? title : "Sorry we could't load your workouts"}
        </Heading>
      </Skeleton>
      <Stack spacing={5}>
        {/* TODO: add the input search */}
        {/* If the list is bigger then 5 */}
        {!isLoading &&
          _workouts?.map((workout) => {
            return (
              <Card
                key={workout.id}
                display="grid"
                p="2"
                gridTemplateColumns="50% 1fr 90px"
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
                Are you sure you want to delete{' '}
                <strong>{workoutOnFocus.name}</strong>?
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef as any} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  rightIcon={<DeleteIcon />}
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
