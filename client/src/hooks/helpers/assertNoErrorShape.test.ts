import { assertNoErrorShape } from './assertNoErrorShape'

describe('assertNoErrorShape', () => {
  it('should return the response when there is no error', () => {
    const response = { id: '1', name: 'Workout' }

    expect(assertNoErrorShape(response)).toEqual(response)
  })

  it('should return the response when error is falsy', () => {
    const response = { id: '1', error: undefined }

    expect(assertNoErrorShape(response)).toEqual(response)
  })

  it('should throw with the error message when error is a string', () => {
    expect(() => assertNoErrorShape({ error: 'Workout not found' })).toThrow(
      'Workout not found',
    )
  })

  it('should throw with a fallback message when error is not a string', () => {
    expect(() => assertNoErrorShape({ error: { code: 500 } })).toThrow(
      'Unexpected error response',
    )
  })
})
