import { AddIcon } from '@chakra-ui/icons'
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightAddon,
  Select,
  Stack,
  Switch,
  Text,
  useToast,
} from '@chakra-ui/react'
import { useState, type ChangeEvent, type FormEvent, useEffect } from 'react'
import { useIdentityContext } from 'react-netlify-identity'

const workoutType = {
  strength: 'strength',
  pulse: 'pulse',
  intensity: 'intensity',
  resistance: 'resistance',
} as const

interface IWorkout {
  created_at: Date // no
  updated_at: Date // no
  id: string // no
  user_id: string // no
  name: string
  type: keyof typeof workoutType
  repeat: boolean
  goal_per_day: number
  interval: number
  rest: number
  squeeze: number
  stop_after: number
}

export const AddWorkout = () => {
  const toast = useToast()
  const { authedFetch } = useIdentityContext()
  // Workouts should come from context or somewhere else, redux?
  const [workouts, setWorkouts] = useState<IWorkout[]>([])
  const [addWorkoutFormData, setAddWorkoutFormData] = useState<
    Partial<
      Omit<
        IWorkout,
        'created_at' | 'updated_at' | 'id' | 'user_id' | 'stop_after'
      >
    >
  >({
    name: undefined,
    type: workoutType.pulse,
    repeat: false,
    goal_per_day: undefined,
    interval: undefined,
    rest: undefined,
    squeeze: undefined,
  })

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

  const handleOnChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target

    setAddWorkoutFormData((prev) => ({
      ...prev,
      [name]:
        event.target.type === 'checkbox'
          ? (event.target as HTMLInputElement).checked
          : value,
    }))
  }

  return (
    <Card
      variant="unstyled"
      p="1rem"
      minHeight="500px"
      rowGap="15px"
      as="form"
      onSubmit={(event) =>
        handleOnSubmit(event as unknown as FormEvent<HTMLFormElement>)
      }
    >
      <Heading size="md">Create your new workout</Heading>

      <CardBody>
        <Stack spacing={5}>
          {/* workout name */}
          <FormControl as="fieldset" display="grid" variant="floating">
            <Input
              onChange={handleOnChange}
              type="name"
              name="name"
              placeholder=" "
            />
            <FormLabel>Name</FormLabel>
          </FormControl>

          {/* Squeeze */}
          <FormControl as="fieldset" display="grid" variant="floating">
            <InputGroup>
              <Input
                onChange={handleOnChange}
                type="number"
                name="squeeze"
                placeholder=" "
              />
              <InputRightAddon>x</InputRightAddon>
              <FormLabel>Squeeze</FormLabel>
            </InputGroup>
          </FormControl>

          {/* workout type */}
          <FormControl
            as="fieldset"
            display="grid"
            variant="floating"
            sx={{
              'option[value=""]': {
                display: 'none',
              },
            }}
          >
            <Select
              placeholder=" "
              onChange={handleOnChange}
              name="type"
              defaultValue={workoutType.pulse}
            >
              {Object.keys(workoutType).map((wType) => (
                <option key={wType} value={wType}>
                  {wType}
                </option>
              ))}
            </Select>
            <FormLabel>Workout type</FormLabel>
          </FormControl>
          {/* interval = should show only if is resistance */}
          <FormControl
            as="fieldset"
            display="grid"
            variant="floating"
            sx={{
              display:
                addWorkoutFormData.type === 'resistance' ? 'grid' : 'none',
            }}
          >
            <Input
              onChange={handleOnChange}
              type="number"
              name="interval"
              placeholder=" "
            />
            <FormLabel>hold up to</FormLabel>
          </FormControl>
          {/* goal per day = numero de series */}
          <FormControl as="fieldset" display="grid" variant="floating">
            <Input
              onChange={handleOnChange}
              type="number"
              name="goal_per_day"
              placeholder=" "
            />
            <FormLabel># of Sets</FormLabel>
          </FormControl>
          {/* rest */}
          <FormControl as="fieldset" display="grid" variant="floating">
            <InputGroup>
              <Input
                onChange={handleOnChange}
                type="number"
                name="rest"
                placeholder=" "
              />
              <InputRightAddon>s</InputRightAddon>
              <FormLabel>Rest</FormLabel>
            </InputGroup>
          </FormControl>

          {/* Repeat */}
          <FormControl
            as="fieldset"
            display="grid"
            id="repeat"
            gridTemplateColumns="max-content max-content"
            columnGap="2"
            alignItems="center"
          >
            <FormLabel m="0" w="max-content">
              Start next set automatically
            </FormLabel>
            <Switch
              colorScheme="pink"
              onChange={handleOnChange}
              name="repeat"
            />
          </FormControl>
        </Stack>
      </CardBody>

      <Divider />

      <CardFooter>
        <Button
          rightIcon={<AddIcon />}
          colorScheme="pink"
          width="max-content"
          type="submit"
        >
          Add new workout
        </Button>
      </CardFooter>
    </Card>
  )
}
