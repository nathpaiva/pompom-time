import type { TWorkoutAnimation } from './types'

export const animationByWorkoutType: TWorkoutAnimation = {
  strength: {
    animation: '750ms infinite alternate bounce',
    keyframes: {
      '@keyframes bounce': {
        '0%': {
          transform: 'translateY(0%)',
        },
        '20%': {
          transform: 'translateY(0%)',
        },
        '50%': {
          transform: 'translateY(-100%)',
        },
        '100%': {
          transform: 'translateY(-100%)',
        },
      },
    },
  },
  pulse: {
    animation: '250ms infinite alternate-reverse pulse .3s',
    keyframes: {
      '@keyframes pulse': {
        '0%': {
          width: '20%',
        },
        '100%': {
          width: '150px',
        },
      },
    },
  },
  intensity: {
    animation: '',
    keyframes: {},
  },
  resistance: {
    animation: '',
    keyframes: {},
  },
}
