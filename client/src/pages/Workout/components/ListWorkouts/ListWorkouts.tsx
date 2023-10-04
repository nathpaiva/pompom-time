import { DeleteIcon } from '@chakra-ui/icons'
import {
  Button,
  ButtonGroup,
  Card,
  Heading,
  IconButton,
  Skeleton,
  Stack,
  useToast,
} from '@chakra-ui/react'
import { Dispatch } from 'react'

import { useDeleteWorkoutById, useListByUserId } from '../../../../hooks'
import { IWorkout } from '../../types'
import { Dialog, useDialog } from './components/Dialog'

interface IListWorkouts {
  workouts: IWorkout[]
  setWorkouts: Dispatch<React.SetStateAction<IWorkout[]>>
}

// TODO: change those components are using workouts in the state to use redux or context
export const ListWorkouts = ({
  workouts: _workouts,
  setWorkouts,
}: IListWorkouts) => {
  const { isOpen, onClose, onOpen, dataOnFocus, setDataOnFocus } =
    useDialog<IWorkout>()

  const toast = useToast()

  const { isLoading, error } = useListByUserId(setWorkouts)
  const { mutate, isLoading: isDeleting } = useDeleteWorkoutById<
    IWorkout,
    { id: IWorkout['id'] }
  >({
    onSettled(_, error, { id }) {
      setDataOnFocus(null)

      if (error) return
      setWorkouts((prev) => {
        return prev.filter((_workout) => _workout.id !== id)
      })
    },
    onSuccess(response) {
      toast({
        status: 'success',
        title: `Delete workout: ${response.name}`,
      })
    },
  })

  const title = _workouts?.length
    ? 'Select workout:'
    : `Oh no! You don't have any workout yet :(`

  const handleDeleteOpenModal = (workout: IWorkout) => {
    setDataOnFocus(workout)
    onOpen()
  }

  const dialogHandleActions = (hasDelete: boolean) => {
    /* c8 ignore next */
    if (!dataOnFocus) return

    onClose()

    if (!hasDelete) {
      setDataOnFocus(null)
      return
    }

    mutate({ id: dataOnFocus.id })
  }

  return (
    <>
      <Dialog
        title="Delete workout"
        description={`Are you sure you want to delete ${dataOnFocus?.name}?`}
        labels={{ confirmAction: 'Delete', cancelAction: 'Cancel' }}
        isOpen={isOpen}
        onClose={dialogHandleActions}
        dataOnFocus={dataOnFocus}
      />

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
              const _isDeleting = workout.id === dataOnFocus?.id && isDeleting

              return (
                <Skeleton isLoaded={!_isDeleting} key={workout.id}>
                  <Card
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
                      <Button
                        size="sm"
                        colorScheme="purple"
                        width="max-content"
                      >
                        Start
                      </Button>

                      <IconButton
                        size="sm"
                        colorScheme="red"
                        width="max-content"
                        variant="outline"
                        aria-label={`Delete ${workout.name} workout`}
                        icon={<DeleteIcon />}
                        onClick={() => handleDeleteOpenModal(workout)}
                      />
                    </ButtonGroup>
                  </Card>
                </Skeleton>
              )
            })}
        </Stack>
      </Card>
    </>
  )
}
