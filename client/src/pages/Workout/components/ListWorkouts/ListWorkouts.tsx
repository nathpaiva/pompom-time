import { DeleteIcon } from '@chakra-ui/icons'
import { Link as ChakraLink } from '@chakra-ui/react'
import {
  ButtonGroup,
  Card,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Skeleton,
  Stack,
  useToast,
} from '@chakra-ui/react'
import { debounce } from 'lodash'
import { ChangeEvent, Dispatch, useState } from 'react'
import { Link } from 'react-router-dom'

import { WorkoutsByUserIdQuery } from '../../../../../../serverless/functions/list-workouts-by-user-id/__generated__/list-workouts-by-user-id.graphql.generated'
import { Workouts } from '../../../../../../serverless/generated/graphql/GraphQLSchema'
import { useDeleteWorkoutById, useListByUserId } from '../../../../hooks'
import { Dialog, useDialog } from './components/Dialog'

interface IListWorkouts {
  workouts: Workouts[]
  setWorkouts: Dispatch<React.SetStateAction<Workouts[]>>
}

// TODO: change those components are using workouts in the state to use redux or context
export const ListWorkouts = ({
  workouts: _workouts,
  setWorkouts,
}: IListWorkouts) => {
  const [workoutName, setWorkoutName] = useState<string>()
  const { isOpen, onClose, onOpen, dataOnFocus, setDataOnFocus } =
    useDialog<Workouts>()

  const toast = useToast()

  const updateWorkoutState = (
    data: WorkoutsByUserIdQuery['workouts_aggregate'],
  ) => {
    if (data.nodes) {
      setWorkouts(data.nodes)
    }
  }

  // Query
  const { isLoading, error } = useListByUserId(updateWorkoutState, workoutName)
  // Mutation
  const { mutate, isLoading: isDeleting } = useDeleteWorkoutById<
    Workouts,
    { id: Workouts['id'] }
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

  const title =
    _workouts?.length || typeof workoutName !== 'undefined'
      ? 'Select workout:'
      : `Oh no! You don't have any workout yet :(`

  const handleDeleteOpenModal = (workout: Workouts) => {
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

  // TODO: handle with pagination
  const handleOnChangeSearchByWorkoutName = debounce(
    (e: ChangeEvent<HTMLInputElement>) => {
      setWorkoutName(e.target.value)
    },
    500,
  )

  const _isLoading = typeof workoutName === 'undefined' ? isLoading : false

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
        <Skeleton isLoaded={!_isLoading}>
          <Heading size="md">
            {!error ? title : "Sorry we could't load your workouts"}
          </Heading>
        </Skeleton>

        <FormControl as="fieldset" display="grid" variant="floating">
          <Input
            type="name"
            placeholder=" "
            onChange={handleOnChangeSearchByWorkoutName}
          />
          <FormLabel>Search</FormLabel>
        </FormControl>

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
                    <span>{workout.variety}</span>

                    <ButtonGroup>
                      <ChakraLink
                        as={Link}
                        to={`start/${workout.id}`}
                        alignSelf="center"
                      >
                        Start
                      </ChakraLink>

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
          {typeof workoutName !== 'undefined' &&
            !_workouts.length &&
            !isLoading && (
              <Heading size="sm" as="p">
                Workout {workoutName} not found
              </Heading>
            )}
        </Stack>
      </Card>
    </>
  )
}
