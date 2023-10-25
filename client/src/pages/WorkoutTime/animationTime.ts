import type { TWorkoutAnimation } from './types'

export const animationByWorkoutType: TWorkoutAnimation = {
  strength: {
    animation: '750ms infinite alternate bounce',
    keyframes: {
      '@keyframes bounce': {
        '0%': {
          backgroundColor: 'yellow',
          transform: 'translateY(0%)',
        },
        '20%': {
          transform: 'translateY(0%)',
        },
        '50%': {
          transform: 'translateY(-100%)',
        },
        '100%': {
          backgroundColor: 'pink',
          transform: 'translateY(-100%)',
        },
      },
    },
  },
  pulse: {
    animation: '250ms infinite alternate-reverse pulse .3s',
    keyframes: {
      '@keyframes pulse': {
        from: {
          width: '20%',
        },
        to: {
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
    animation: 'bounce 14s infinite alternate',
    keyframes: {
      '@keyframes bounce': {
        // 7.142
        from: {
          transform: 'translateY(0%)',
        },
        '7.142%': {
          transform: 'translateY(-100%)',
        },
        '90%': {
          transform: 'translateY(-100%)',
        },
        '99%': {
          transform: 'translateY(-10%)',
        },
        to: {
          transform: 'translateY(0%)',
        },
        // '0%': {
        //   transform: 'translateY(0%)',
        // },
        // '10%': {
        //   transform: 'translateY(-100%)',
        // },
        // '50%': {
        //   transform: 'translateY(-100%)',
        // },
        // '80%': {
        //   transform: 'translateY(-100%)',
        // },
        // '90%': {
        //   transform: 'translateY(-10%)',
        // },
        // '100%': {
        //   transform: 'translateY(0%)',
        // },
      },
      // '@keyframes pause': {
      //   '0%': {
      //     transform: 'translateY(-100%)',
      //   },

      //   '100%': {
      //     transform: 'translateY(-100%)',
      //   },
      // },
    },
  },
}
// , pause 10s infinite
