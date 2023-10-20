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
import { Workouts, Workouts_Aggregate } from '@graph/types'
import { debounce } from 'lodash'
import { ChangeEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import { useDeleteWorkoutById, useListByUserId } from '../../../../hooks'
import { updatesWorkoutList } from '../../../../hooks/helpers'
import { Dialog, useDialog } from './components/Dialog'

export const ListWorkouts = () => {
  const [workoutName, setWorkoutName] = useSearchParams()
  const workoutNameSearch = [...workoutName].flat()[workoutName.size]
  const { isOpen, onClose, onOpen, dataOnFocus, setDataOnFocus } =
    useDialog<Workouts>()
  const toast = useToast()

  // Query
  const { isLoading, error, data } =
    useListByUserId<Workouts_Aggregate>(workoutNameSearch)
  // Mutation
  const { mutate, isLoading: isDeleting } = useDeleteWorkoutById<
    Workouts,
    { id: Workouts['id'] }
  >({
    onSettled() {
      setDataOnFocus(null)
    },
    onSuccess(response, { id }) {
      updatesWorkoutList(id, workoutNameSearch)

      toast({
        status: 'success',
        title: `Delete workout: ${response.name}`,
      })
    },
  })

  const title = data?.nodes?.length
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
      setWorkoutName({ name: e.target.value })
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
            data?.nodes?.map((workout) => {
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
          {typeof workoutNameSearch !== 'undefined' &&
            !data?.nodes.length &&
            !isLoading && (
              <Heading size="sm" as="p">
                Workout {workoutNameSearch} not found
              </Heading>
            )}
        </Stack>
      </Card>
    </>
  )
}
