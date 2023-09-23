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
  useToast,
} from '@chakra-ui/react'
import { useState, type ChangeEvent, type FormEvent, Dispatch } from 'react'
import { useIdentityContext } from 'react-netlify-identity'

import { IWorkout, workoutType } from '../../types'

interface IAddWorkout {
  setWorkouts: Dispatch<React.SetStateAction<IWorkout[]>>
}

export const AddWorkout = ({ setWorkouts }: IAddWorkout) => {
  const toast = useToast()
  const { user } = useIdentityContext()
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

    const _copy = { ...addWorkoutFormData }

    // delete the not required field
    if (addWorkoutFormData.type !== 'resistance') {
      delete _copy.interval
    }

    const isInvalidForm = Object.values(_copy).some(
      (item) => typeof item === 'undefined',
    )

    const _fetchData = async () => {
      try {
        if (isInvalidForm) {
          throw new Error('All fields should be filled')
        }

        const _response = await fetch(
          '/.netlify/functions/add-workout-by-user',
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${user?.token.access_token}` },
            body: JSON.stringify(addWorkoutFormData),
          },
        )

        const response = (await _response.json()) as IWorkout & {
          error?: string
        }

        if (_response.status !== 200) {
          throw new Error(response.error)
        }

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

  // TODO: create a form validation
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
      <Heading size="md">Create a new workout:</Heading>

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
          colorScheme="purple"
          width="max-content"
          type="submit"
        >
          Add new workout
        </Button>
      </CardFooter>
    </Card>
  )
}
