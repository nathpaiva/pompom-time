import { ArrowBackIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightAddon,
  Stack,
  Switch,
  useToast,
} from '@chakra-ui/react'
import { Workouts } from '@graph/types'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useIdentityContext } from 'react-netlify-identity'
import { Link, useSearchParams } from 'react-router-dom'

import { TAddWorkoutVariable, useAddWorkoutByUserId } from '../../hooks'
import { updatesWorkoutList } from '../../hooks/helpers'
import { varietyColorMap } from '../../utils'
import { Variety_Enum } from '../WorkoutTime/types'

type IFormInput = TAddWorkoutVariable

export const AddWorkout = () => {
  const [searchParams] = useSearchParams()
  const workoutNameSearch = [...searchParams].flat()[searchParams.size]
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IFormInput>()
  const isResistance = watch('variety') === Variety_Enum.Resistance
  const selectedVariety = watch('variety')

  const toast = useToast()
  const { user } = useIdentityContext()

  const { mutate } = useAddWorkoutByUserId<Workouts, TAddWorkoutVariable>({
    onSettled(data) {
      /* c8 ignore next */
      if (!data) return

      updatesWorkoutList(data, workoutNameSearch, user?.token.expires_at)

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
      <Box display="flex" alignItems="center" gap="3">
        <IconButton
          as={Link}
          to="/admin/workout"
          aria-label="Back"
          icon={<ArrowBackIcon />}
          variant="ghost"
        />
        <Heading
          fontFamily="heading"
          fontWeight="700"
          fontSize="20px"
          color="pompom.text"
        >
          New workout
        </Heading>
      </Box>

      <CardBody>
        <Stack spacing={5}>
          {/* workout name */}
          <FormControl as="fieldset" display="grid" isInvalid={!!errors.name}>
            <FormLabel
              fontFamily="body"
              fontWeight="700"
              fontSize="13px"
              color="pompom.text"
            >
              Workout name
            </FormLabel>
            <Input
              type="name"
              border="1.5px solid"
              borderColor="pompom.border"
              borderRadius="pompomInput"
              fontFamily="body"
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...register('name', {
                required: 'Workout name is required',
                minLength: {
                  value: 4,
                  message: 'Minimum length should be 4',
                },
              })}
            />
            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
          </FormControl>

          {/* workout variety */}
          <FormControl
            isInvalid={!!errors.variety}
            as="fieldset"
            display="grid"
          >
            <FormLabel
              id="variety-label"
              fontFamily="body"
              fontWeight="700"
              fontSize="13px"
              color="pompom.text"
            >
              Workout type
            </FormLabel>
            <input
              type="hidden"
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...register('variety', {
                required: 'Workout variety is required',
              })}
            />
            <Box
              role="group"
              aria-labelledby="variety-label"
              display="flex"
              flexWrap="wrap"
              gap="2"
            >
              {Object.values(Variety_Enum).map((wType) => {
                const isActive = selectedVariety === wType
                const varietyColor = varietyColorMap[wType]

                return (
                  <Button
                    key={wType}
                    type="button"
                    aria-label={`Select ${wType} workout type`}
                    aria-pressed={isActive}
                    onClick={() =>
                      setValue('variety', wType, { shouldValidate: true })
                    }
                    borderRadius="pompomPill"
                    fontFamily="heading"
                    fontWeight="700"
                    fontSize="13px"
                    textTransform="capitalize"
                    bg={isActive ? varietyColor.background : 'transparent'}
                    color={isActive ? varietyColor.text : 'pompom.text'}
                    border="1.5px solid"
                    borderColor={
                      isActive ? varietyColor.background : 'pompom.border'
                    }
                    _hover={{
                      bg: isActive ? varietyColor.background : 'transparent',
                    }}
                  >
                    {wType}
                  </Button>
                )
              })}
            </Box>
            <FormErrorMessage>{errors.variety?.message}</FormErrorMessage>
          </FormControl>

          {/* goal per day = numero de series */}
          <FormControl
            as="fieldset"
            display="grid"
            isInvalid={!!errors.goal_per_day}
          >
            <FormLabel
              fontFamily="body"
              fontWeight="700"
              fontSize="13px"
              color="pompom.text"
            >
              Number of sets
            </FormLabel>
            <InputGroup>
              <Input
                type="number"
                border="1.5px solid"
                borderColor="pompom.border"
                borderRadius="pompomInput"
                fontFamily="body"
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...register('goal_per_day', {
                  required: '# of sets is required',
                  valueAsNumber: true,
                })}
              />
              <InputRightAddon>sets</InputRightAddon>
            </InputGroup>
            <FormErrorMessage>{errors.goal_per_day?.message}</FormErrorMessage>
          </FormControl>

          {/* Squeeze */}
          <FormControl
            as="fieldset"
            display="grid"
            isInvalid={!!errors.squeeze}
          >
            <FormLabel
              fontFamily="body"
              fontWeight="700"
              fontSize="13px"
              color="pompom.text"
            >
              Contractions per set
            </FormLabel>
            <InputGroup>
              <Input
                type="number"
                border="1.5px solid"
                borderColor="pompom.border"
                borderRadius="pompomInput"
                fontFamily="body"
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...register('squeeze', {
                  required: 'Squeeze is required',
                  valueAsNumber: true,
                })}
              />
              <InputRightAddon>x</InputRightAddon>
            </InputGroup>
            <FormErrorMessage>{errors.squeeze?.message}</FormErrorMessage>
          </FormControl>

          {/* interval = should show only if is resistance */}
          <FormControl
            isInvalid={!!errors.interval}
            as="fieldset"
            display={isResistance ? 'grid' : 'none'}
          >
            <FormLabel
              fontFamily="body"
              fontWeight="700"
              fontSize="13px"
              color="pompom.text"
            >
              Hold for
            </FormLabel>
            <InputGroup>
              <Input
                type="number"
                border="1.5px solid"
                borderColor="pompom.border"
                borderRadius="pompomInput"
                fontFamily="body"
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...register('interval', {
                  required: isResistance
                    ? 'interval is required if is resistance'
                    : undefined,
                  deps: 'variety',
                  valueAsNumber: true,
                })}
              />
              <InputRightAddon>sec</InputRightAddon>
            </InputGroup>
            <FormErrorMessage>{errors.interval?.message}</FormErrorMessage>
          </FormControl>

          {/* rest */}
          <FormControl as="fieldset" display="grid" isInvalid={!!errors.rest}>
            <FormLabel
              fontFamily="body"
              fontWeight="700"
              fontSize="13px"
              color="pompom.text"
            >
              Rest between sets
            </FormLabel>
            <InputGroup>
              <Input
                type="number"
                border="1.5px solid"
                borderColor="pompom.border"
                borderRadius="pompomInput"
                fontFamily="body"
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...register('rest', {
                  required: 'Rest time is required',
                  valueAsNumber: true,
                })}
              />
              <InputRightAddon>sec</InputRightAddon>
            </InputGroup>
            <FormErrorMessage>{errors.rest?.message}</FormErrorMessage>
          </FormControl>

          {/* Repeat */}
          <FormControl
            as="fieldset"
            display="grid"
            id="repeat"
            gridTemplateColumns="1fr max-content"
            columnGap="2"
            alignItems="center"
          >
            <FormLabel
              m="0"
              fontFamily="body"
              fontWeight="700"
              fontSize="14px"
              color="pompom.text"
            >
              Start next set automatically
            </FormLabel>
            <Switch
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...register('repeat')}
              sx={{
                'span.chakra-switch__track[data-checked]': {
                  backgroundColor: 'pompom.tertiary',
                },
              }}
            />
          </FormControl>
        </Stack>
      </CardBody>

      <Divider />

      <CardFooter>
        <Button
          type="submit"
          borderRadius="pompomPill"
          bg="pompom.tertiary"
          color="white"
          fontFamily="heading"
          fontWeight="700"
          w="full"
          isLoading={isSubmitting}
          _hover={{ bg: 'pompom.tertiary' }}
        >
          Create workout
        </Button>
      </CardFooter>
    </Card>
  )
}
