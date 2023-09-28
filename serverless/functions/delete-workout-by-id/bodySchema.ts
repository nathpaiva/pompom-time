export const bodySchema = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        id: { type: 'string' },
      },
      required: ['id'],
    },
  },
  required: ['body'],
  errorMessage: {
    _: 'You should provide the workout id.',
  },
}
