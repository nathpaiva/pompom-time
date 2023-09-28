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
          type: {
            type: 'string',
            pattern: '^resistance$',
          },
          interval: { type: 'integer' },
        },
      },
      then: {
        required: ['interval'],
        errorMessage: {
          required: 'Interval is required for ${/body/type} workout type.',
          _: 'You should provide the workout data',
        },
      },
      else: {
        properties: {
          type: {
            type: 'string',
            pattern: '(^pulse$)|(^strength$)|(^intensity$)',
          },
          interval: false,
        },
        errorMessage: {
          properties: {
            interval: 'Interval is not valid for ${/body/type} workout type.',
          },
        },
      },
      required: ['name', 'type', 'repeat', 'goal_per_day', 'rest', 'squeeze'],
    },
  },
  required: ['body'],
  errorMessage: {
    _: 'You should provide the workout data',
  },
}
