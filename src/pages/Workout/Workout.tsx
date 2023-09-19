import { AddIcon, DeleteIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Switch,
  useToast,
} from '@chakra-ui/react'
import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react'
import { useIdentityContext } from 'react-netlify-identity'

interface IWorkout {
  created_at: Date // no
  updated_at: Date // no
  id: string // no
  user_id: string // no
  name: string
  type: string
  repeat: boolean
  goal_per_day: number
  interval: number
  rest: number
  squeeze: number
  stop_after: number
}

export function Workout() {
  const [addWorkoutFormData, setAddWorkoutFormData] = useState<
    Partial<Omit<IWorkout, 'created_at' | 'updated_at' | 'id' | 'user_id'>>
  >({
    name: undefined,
    type: undefined,
    repeat: false,
    goal_per_day: undefined,
    interval: undefined,
    rest: undefined,
    squeeze: undefined,
    stop_after: undefined,
  })
  const toast = useToast()
  const { authedFetch } = useIdentityContext()

  const [workouts, setWorkouts] = useState<IWorkout[]>([])

  const getWorkouts = useCallback(() => {
    const _fetchData = async () => {
      try {
        const response = (await authedFetch.get(
          '/.netlify/functions/list-workouts-by-user-id',
        )) as IWorkout[]

        setWorkouts(response)
      } catch (error) {
        toast({
          status: 'error',
          title: (error as Error).message,
        })
      }
    }

    _fetchData()
  }, [authedFetch, toast])

  // create workout
  const handleOnSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const isInvalidForm = Object.values(addWorkoutFormData).some(
      (item) => typeof item === 'undefined',
    )

    const _fetchData = async () => {
      try {
        if (isInvalidForm) {
          throw new Error('All fields should be filled')
        }

        const response = (await authedFetch.post(
          '/.netlify/functions/add-workout-by-user',
          {
            body: JSON.stringify(addWorkoutFormData),
          },
        )) as IWorkout

        setWorkouts((prev) => [...prev, response])
        toast({
          status: 'success',
          title: `Added workout: ${addWorkoutFormData.name}`,
        })
      } catch (error) {
        toast({
          status: 'error',
          title: (error as Error).message,
        })
      }
    }

    _fetchData()
  }

  // delete workout
  const handleDelete = async (id: string) => {
    try {
      const response = (await authedFetch.delete(
        '/.netlify/functions/delete-workout-by-id',
        {
          body: JSON.stringify({
            id,
          }),
        },
      )) as IWorkout

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
    }
  }

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = event.target

    setAddWorkoutFormData((prev) => ({
      ...prev,
      [name]: name === 'repeat' ? checked : value,
    }))
  }

  useEffect(() => {
    getWorkouts()
  }, [getWorkouts])

  return (
    <Box as="ul">
      <Box
        as="li"
        display="grid"
        gridTemplateColumns="repeat(4, 1fr)"
        p="2"
        borderRadius="sm"
        color="purple.800"
        fontWeight="600"
        bgColor="purple.200"
      >
        <span>Name</span>
        <span>Type</span>
        <span>Should repeat?</span>
        <span>Action</span>
      </Box>

      {workouts.map((workout) => {
        return (
          <Box
            as="li"
            key={workout.id}
            display="grid"
            p="2"
            gridTemplateColumns="repeat(4, 1fr)"
          >
            <span>{workout.name}</span>

            <span>{workout.type}</span>

            <Switch
              isReadOnly
              isChecked={workout.repeat}
              colorScheme="purple"
            />

            <div>
              <Button size="sm" colorScheme="pink" width="max-content">
                Start workout!
              </Button>

              <IconButton
                size="sm"
                colorScheme="pink"
                width="max-content"
                variant="outline"
                aria-label="Add new workout"
                icon={<DeleteIcon />}
                onClick={(event) => {
                  console.log('delete this workout', workout.id, event)
                  handleDelete(workout.id)
                }}
              />
            </div>
          </Box>
        )
      })}

      <Box as="li">
        <Box gridTemplateColumns="repeat(9, 1fr)" display="grid">
          <span>name</span>
          <span>type</span>
          <span>repeat</span>
          <span>goal_per_day</span>
          <span>interval</span>
          <span>rest</span>
          <span>squeeze</span>
          <span>stop_after</span>
          <span></span>
        </Box>
        <Box
          as="form"
          onSubmit={handleOnSubmit}
          display="grid"
          p="2"
          gridTemplateColumns="repeat(9, 1fr)"
        >
          <FormControl as="fieldset" display="grid" variant="floating">
            <Input
              onChange={handleOnChange}
              type="name"
              name="name"
              placeholder=" "
            />
            <FormLabel>Name</FormLabel>
          </FormControl>

          <FormControl as="fieldset" display="grid" variant="floating">
            <Input
              onChange={handleOnChange}
              type="text"
              name="type"
              placeholder=" "
            />
            <FormLabel>Type</FormLabel>
          </FormControl>

          <Switch
            colorScheme="purple"
            onChange={handleOnChange}
            name="repeat"
          />

          <FormControl as="fieldset" display="grid" variant="floating">
            <Input
              onChange={handleOnChange}
              type="number"
              name="goal_per_day"
              placeholder=" "
            />
            <FormLabel>goal_per_day</FormLabel>
          </FormControl>
          <FormControl as="fieldset" display="grid" variant="floating">
            <Input
              onChange={handleOnChange}
              type="number"
              name="interval"
              placeholder=" "
            />
            <FormLabel>interval</FormLabel>
          </FormControl>
          <FormControl as="fieldset" display="grid" variant="floating">
            <Input
              onChange={handleOnChange}
              type="number"
              name="rest"
              placeholder=" "
            />
            <FormLabel>rest</FormLabel>
          </FormControl>
          <FormControl as="fieldset" display="grid" variant="floating">
            <Input
              onChange={handleOnChange}
              type="number"
              name="squeeze"
              placeholder=" "
            />
            <FormLabel>squeeze</FormLabel>
          </FormControl>
          <FormControl as="fieldset" display="grid" variant="floating">
            <Input
              onChange={handleOnChange}
              type="number"
              name="stop_after"
              placeholder=" "
            />
            <FormLabel>stop_after</FormLabel>
          </FormControl>

          <IconButton
            size="sm"
            colorScheme="pink"
            width="max-content"
            variant="outline"
            aria-label="Add new workout"
            type="submit"
            icon={<AddIcon />}
          />
        </Box>
      </Box>
    </Box>
  )
}
