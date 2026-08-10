import { AddIcon, CloseIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Card,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Skeleton,
  Stack,
  Tag,
  Text,
  useToast,
} from '@chakra-ui/react'
import { Workouts, Workouts_Aggregate } from '@graph/types'
import { debounce } from 'lodash'
import { ChangeEvent } from 'react'
import { useIdentityContext } from 'react-netlify-identity'
import { Link, useSearchParams } from 'react-router-dom'

import { useDeleteWorkoutById, useListByUserId } from '../../../../hooks'
import { updatesWorkoutList } from '../../../../hooks/helpers'
import { pompomGlowShadow, varietyColorMap } from '../../../../utils'
import { Dialog, useDialog } from './components/Dialog'

export const ListWorkouts = () => {
  const [workoutName, setWorkoutName] = useSearchParams()
  const workoutNameSearch = [...workoutName].flat()[workoutName.size]
  const { isOpen, onClose, onOpen, dataOnFocus, setDataOnFocus } =
    useDialog<Workouts>()
  const toast = useToast()
  const { user } = useIdentityContext()

  // Query
  const { isLoading, error, data } =
    useListByUserId<Workouts_Aggregate>(workoutNameSearch)
  // Mutation
  const { mutate, isPending: isDeleting } = useDeleteWorkoutById<
    Workouts,
    { id: Workouts['id'] }
  >({
    onSettled() {
      setDataOnFocus(null)
    },
    onSuccess(response, { id }) {
      updatesWorkoutList(id, workoutNameSearch, user?.token.expires_at)

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
  const isSearching = typeof workoutNameSearch !== 'undefined'
  const savedWorkoutsCount = data?.nodes?.length ?? 0

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
          <Heading
            fontFamily="heading"
            fontWeight="700"
            fontSize="22px"
            color="pompom.text"
          >
            {!error ? title : "Sorry we could't load your workouts"}
          </Heading>
          {!error && !isSearching && (
            <Text fontFamily="body" fontSize="13px" color="pompom.textMuted">
              {savedWorkoutsCount} saved workouts
            </Text>
          )}
        </Skeleton>

        <FormControl as="fieldset" display="grid" variant="floating">
          <Input
            type="name"
            placeholder="Search workout"
            border="none"
            borderRadius="pompomPill"
            bg="pompom.searchBg"
            px="16px"
            py="14px"
            fontFamily="body"
            onChange={handleOnChangeSearchByWorkoutName}
          />
          <FormLabel srOnly>Search</FormLabel>
        </FormControl>

        <Stack spacing={5}>
          {!isLoading &&
            data?.nodes?.map((workout) => {
              const _isDeleting = workout.id === dataOnFocus?.id && isDeleting
              const varietyColor = varietyColorMap[workout.variety]

              return (
                <Skeleton isLoaded={!_isDeleting} key={workout.id}>
                  <Card
                    display="grid"
                    p="4"
                    gap="2"
                    bg="pompom.inset"
                    borderRadius="pompomCard"
                    boxShadow="none"
                  >
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Text
                        fontFamily="heading"
                        fontWeight="700"
                        fontSize="15px"
                        color="pompom.text"
                      >
                        {workout.name}
                      </Text>

                      <Tag
                        borderRadius="pompomPill"
                        bg={varietyColor.background}
                        color={varietyColor.text}
                        fontFamily="heading"
                        fontWeight="700"
                        fontSize="11px"
                        textTransform="uppercase"
                        px="3"
                      >
                        {workout.variety}
                      </Tag>
                    </Box>

                    <Text
                      fontFamily="body"
                      fontSize="12px"
                      color="pompom.textMuted"
                    >
                      {workout.goal_per_day} sets · {workout.squeeze}x
                    </Text>

                    <Box display="flex" gap="2" mt="2">
                      <Button
                        as={Link}
                        to={`start/${workout.id}`}
                        borderRadius="pompomPill"
                        bg="pompom.primary"
                        color="white"
                        fontFamily="heading"
                        fontWeight="700"
                        _hover={{ bg: 'pompom.primary' }}
                      >
                        Start
                      </Button>

                      <IconButton
                        borderRadius="full"
                        variant="outline"
                        borderColor="pompom.border"
                        aria-label={`Delete ${workout.name} workout`}
                        icon={<CloseIcon boxSize="3" />}
                        onClick={() => handleDeleteOpenModal(workout)}
                      />
                    </Box>
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

      <IconButton
        as={Link}
        to="/admin/workout/new"
        aria-label="Add new workout"
        icon={<AddIcon />}
        position="fixed"
        bottom="6"
        right="6"
        borderRadius="full"
        boxSize="56px"
        bg="pompom.primary"
        color="white"
        boxShadow={pompomGlowShadow('#655D8A')}
        _hover={{ bg: 'pompom.primary' }}
      />
    </>
  )
}
