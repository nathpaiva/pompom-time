import { hasErrorShape } from './hasErrorShape'

describe('hasErrorShape', () => {
  it('should return true when the response has an error key', () => {
    expect(hasErrorShape({ error: 'Something went wrong' })).toBeTruthy()
  })

  it('should return true when error is a non-string value', () => {
    expect(hasErrorShape({ error: { code: 500 } })).toBeTruthy()
    expect(hasErrorShape({ error: 500 })).toBeTruthy()
  })

  it('should return false when the response has no error key', () => {
    expect(hasErrorShape({ id: '1', name: 'Workout' })).toBeFalsy()
  })

  it('should return false for non-object responses', () => {
    expect(hasErrorShape(null)).toBeFalsy()
    expect(hasErrorShape(undefined)).toBeFalsy()
    expect(hasErrorShape('a string')).toBeFalsy()
    expect(hasErrorShape(42)).toBeFalsy()
  })
})
