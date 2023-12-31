import { AddIcon } from '@chakra-ui/icons'
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  FormControl,
  FormErrorMessage,
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
import { Workouts } from '@graph/types'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'

import { TAddWorkoutVariable, useAddWorkoutByUserId } from '../../../../hooks'
import { updatesWorkoutList } from '../../../../hooks/helpers'
import { Variety_Enum } from '../../../WorkoutTime/types'

type IFormInput = TAddWorkoutVariable

export const AddWorkout = () => {
  const [searchParams] = useSearchParams()
  const workoutNameSearch = [...searchParams].flat()[searchParams.size]
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IFormInput>()
  const isResistance = watch('variety') === Variety_Enum.Resistance

  const toast = useToast()

  const { mutate } = useAddWorkoutByUserId<Workouts, TAddWorkoutVariable>({
    onSettled(data) {
      /* c8 ignore next */
      if (!data) return

      updatesWorkoutList(data, workoutNameSearch)

      toast({
        status: 'success',
        title: `Added workout: ${data.name}`,
      })

      reset()
    },
  })

  const onSubmit: SubmitHandler<TAddWorkoutVariable> = (formInputData) => {
    /* c8 ignore next */
    if (!formInputData) return

    // TODO: change on BE to accept the interval as null
    mutate({
      ...formInputData,
      interval: isResistance ? formInputData.interval : undefined,
    })
  }

  const onInvalid = () => {
    toast({
      status: 'error',
      title: 'All fields must be filled',
    })
  }

  return (
    <Card
      variant="unstyled"
      p="1rem"
      minHeight="500px"
      rowGap="15px"
      as="form"
      onSubmit={(event) => {
        handleSubmit(onSubmit, onInvalid)(event)
      }}
    >
      <Heading size="md">Create a new workout:</Heading>

      <CardBody>
        <Stack spacing={5}>
          {/* workout name */}
          <FormControl
            as="fieldset"
            display="grid"
            variant="floating"
            isInvalid={!!errors.name}
          >
            <Input
              type="name"
              placeholder=" "
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...register('name', {
                required: 'Workout name is required',
                minLength: {
                  value: 4,
                  message: 'Minimum length should be 4',
                },
              })}
            />
            <FormLabel>Name</FormLabel>
            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
          </FormControl>

          {/* workout variety */}
          <FormControl
            isInvalid={!!errors.variety}
            as="fieldset"
            display="grid"
            variant="floating"
          >
            <Select
              placeholder="Select workout variety"
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...register('variety', {
                required: 'Workout variety is required',
              })}
            >
              {Object.keys(Variety_Enum).map((wType) => (
                <option key={wType} value={Variety_Enum[wType]}>
                  {wType}
                </option>
              ))}
            </Select>
            <FormLabel>Select workout variety</FormLabel>
            <FormErrorMessage>{errors.variety?.message}</FormErrorMessage>
          </FormControl>

          {/* goal per day = numero de series */}
          <FormControl
            as="fieldset"
            display="grid"
            variant="floating"
            isInvalid={!!errors.goal_per_day}
          >
            <Input
              type="number"
              placeholder=" "
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...register('goal_per_day', {
                required: '# of sets is required',
                valueAsNumber: true,
              })}
            />
            <FormLabel># of Sets</FormLabel>
            <FormErrorMessage>{errors.goal_per_day?.message}</FormErrorMessage>
          </FormControl>

          {/* Squeeze */}
          <FormControl
            as="fieldset"
            display="grid"
            variant="floating"
            isInvalid={!!errors.squeeze}
          >
            <InputGroup>
              <Input
                type="number"
                placeholder=" "
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...register('squeeze', {
                  required: 'Squeeze is required',
                  valueAsNumber: true,
                })}
              />
              <InputRightAddon>x</InputRightAddon>
              <FormLabel>Squeeze</FormLabel>
            </InputGroup>
            <FormErrorMessage>{errors.squeeze?.message}</FormErrorMessage>
          </FormControl>

          {/* interval = should show only if is resistance */}
          <FormControl
            isInvalid={!!errors.interval}
            as="fieldset"
            display="grid"
            variant="floating"
            sx={{
              display: isResistance ? 'grid' : 'none',
            }}
          >
            <Input
              type="number"
              placeholder=" "
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...register('interval', {
                required: isResistance
                  ? 'interval is required if is resistance'
                  : undefined,
                deps: 'type',
                valueAsNumber: true,
              })}
            />
            <FormLabel>hold up to</FormLabel>
            <FormErrorMessage>{errors.interval?.message}</FormErrorMessage>
          </FormControl>

          {/* rest */}
          <FormControl
            as="fieldset"
            display="grid"
            variant="floating"
            isInvalid={!!errors.rest}
          >
            <InputGroup>
              <Input
                type="number"
                placeholder=" "
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...register('rest', {
                  required: 'Rest time is required',
                  valueAsNumber: true,
                })}
              />
              {/* TODO: change label to be sec */}
              <InputRightAddon>s</InputRightAddon>
              <FormLabel>Rest</FormLabel>
            </InputGroup>
            <FormErrorMessage>{errors.rest?.message}</FormErrorMessage>
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
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...register('repeat')}
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
          isLoading={isSubmitting}
        >
          Add new workout
        </Button>
      </CardFooter>
    </Card>
  )
}
