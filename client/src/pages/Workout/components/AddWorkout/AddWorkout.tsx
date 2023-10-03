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

import { TAddWorkoutVariable, useAddWorkoutByUserId } from '../../../../hooks'
import { IWorkout, workoutType } from '../../types'

interface IAddWorkout {
  setWorkouts: Dispatch<React.SetStateAction<IWorkout[]>>
}

const formInitialData = {
  name: undefined,
  type: workoutType.pulse,
  repeat: false,
  goal_per_day: undefined,
  interval: undefined,
  rest: undefined,
  squeeze: undefined,
}

export const AddWorkout = ({ setWorkouts }: IAddWorkout) => {
  const toast = useToast()
  const { user } = useIdentityContext()

  const [addWorkoutFormData, setAddWorkoutFormData] =
    useState<TAddWorkoutVariable>(formInitialData)

  const { mutate } = useAddWorkoutByUserId<IWorkout, TAddWorkoutVariable>({
    access_token: user?.token.access_token,
    onSettled(data, _) {
      console.log(data, _)
      if (!data) return

      setWorkouts((prev) => [...prev, data])
      toast({
        status: 'success',
        title: `Added workout: ${data.name}`,
      })

      setAddWorkoutFormData(formInitialData)
    },
  })

  // create workout
  const handleOnSubmit = (event: FormEvent<HTMLDivElement>) => {
    event.preventDefault()

    const _copy = { ...addWorkoutFormData }

    // delete the not required field
    if (addWorkoutFormData.type !== 'resistance') {
      delete _copy.interval
    }

    const isInvalidForm = Object.values(_copy).some(
      (item) => typeof item === 'undefined',
    )

    if (isInvalidForm) {
      toast({
        status: 'error',
        title: 'All fields must be filled',
      })
      return
    }

    mutate(_copy)
  }

  const handleOnChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target

    setAddWorkoutFormData((prev) => {
      const objToReturn = {
        [name]:
          event.target.type === 'checkbox'
            ? (event.target as HTMLInputElement).checked
            : value,
      }

      if (name === 'type' && value !== 'resistance') {
        return {
          ...prev,
          ...objToReturn,
          interval: undefined,
        }
      }

      return {
        ...prev,
        ...objToReturn,
      }
    })
  }

  // TODO: create a form validation
  return (
    <Card
      variant="unstyled"
      p="1rem"
      minHeight="500px"
      rowGap="15px"
      as="form"
      onSubmit={handleOnSubmit}
    >
      <Heading size="md">Create a new workout:</Heading>

      <CardBody>
        <Stack spacing={5}>
          {/* workout name */}
          <FormControl
            isRequired
            as="fieldset"
            display="grid"
            variant="floating"
          >
            <Input
              onChange={handleOnChange}
              type="name"
              name="name"
              placeholder=" "
              defaultValue={addWorkoutFormData.name}
            />
            <FormLabel>Name</FormLabel>
          </FormControl>

          {/* Squeeze */}
          <FormControl
            isRequired
            as="fieldset"
            display="grid"
            variant="floating"
          >
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
            isRequired
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
            isRequired={addWorkoutFormData.type === 'resistance'}
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
          <FormControl
            isRequired
            as="fieldset"
            display="grid"
            variant="floating"
          >
            <Input
              onChange={handleOnChange}
              type="number"
              name="goal_per_day"
              placeholder=" "
            />
            <FormLabel># of Sets</FormLabel>
          </FormControl>
          {/* rest */}
          <FormControl
            isRequired
            as="fieldset"
            display="grid"
            variant="floating"
          >
            <InputGroup>
              <Input
                onChange={handleOnChange}
                type="number"
                name="rest"
                placeholder=" "
              />
              {/* TODO: change label to be sec */}
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
        {/* TODO: disable button if is adding a new data */}
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
