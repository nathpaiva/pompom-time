export const bodySchema = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        repeat: { type: 'boolean' },
        name: { type: 'string' },
        goal_per_day: { type: 'integer' },
        rest: { type: 'integer' },
        squeeze: { type: 'integer' },
      },
      if: {
        properties: {
          variety: {
            type: 'string',
            pattern: '^resistance$',
          },
          interval: { type: 'integer' },
        },
      },
      then: {
        required: ['interval'],
        errorMessage: {
          required: 'Interval is required for ${/body/variety} workout type.',
          _: 'You should provide the workout data',
        },
      },
      else: {
        properties: {
          variety: {
            type: 'string',
            pattern: '(^pulse$)|(^strength$)|(^intensity$)',
          },
          interval: false,
        },
        errorMessage: {
          properties: {
            interval:
              'Interval is not valid for ${/body/variety} workout type.',
          },
        },
      },
      required: [
        'name',
        'variety',
        'repeat',
        'goal_per_day',
        'rest',
        'squeeze',
      ],
    },
  },
  required: ['body'],
  errorMessage: {
    _: 'You should provide the workout data',
  },
}
