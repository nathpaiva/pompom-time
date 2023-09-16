import { AddIcon } from '@chakra-ui/icons'
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
    repeat: undefined,
    goal_per_day: undefined,
    interval: undefined,
    rest: undefined,
    squeeze: undefined,
    stop_after: undefined,
  })
  const toast = useToast()
  const { user } = useIdentityContext()
  const [workouts, setWorkouts] = useState<IWorkout[]>([])

  const fetchData = useCallback(() => {
    const _fetchData = async () => {
      try {
        if (!user?.token) {
          throw new Error('You should be authenticated')
        }

        const response = await fetch('/.netlify/functions/listUserWorkouts', {
          headers: { Authorization: `Bearer ${user.token.access_token}` },
        })

        const data = (await response.json()) as IWorkout[]

        setWorkouts(data)
        return Promise.resolve(true)
      } catch (error) {
        console.log('error', error)
        toast({
          status: 'error',
          title: (error as Error).message,
        })

        return Promise.reject()
      }
    }

    _fetchData()
  }, [toast, user?.token])

  const handleOnSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const isInvalidForm = Object.values(addWorkoutFormData).some(
      (item) => typeof item === 'undefined',
    )

    const _fetchData = async () => {
      try {
        if (!user?.token) {
          throw new Error('You should be authenticated')
        }
        if (isInvalidForm) {
          throw new Error('All fields should be filled')
        }

        console.log('veio', user)
        const response = await fetch('/.netlify/functions/addWorkoutByUser', {
          method: 'POST',
          headers: { Authorization: `Bearer ${user.token.access_token}` },
          body: JSON.stringify(addWorkoutFormData),
        })

        const data = (await response.json()) as IWorkout

        setWorkouts((prev) => [...prev, data])
      } catch (error) {
        console.log('error', (error as Error).message)
      }
    }

    _fetchData()
  }

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = event.target

    setAddWorkoutFormData((prev) => ({
      ...prev,
      [name]: name === 'repeat' ? checked : value,
    }))
  }

  useEffect(() => {
    console.log('addWorkoutFormData', addWorkoutFormData)
  }, [addWorkoutFormData])

  useEffect(() => {
    fetchData()
  }, [fetchData])

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

            <Button size="sm" colorScheme="pink" width="max-content">
              Start workout!
            </Button>
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
