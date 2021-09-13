import { isReactive, reactive } from '../reactive';

describe('reactive', () => {
  it('happy path', () => {
    const original = { foo: 1 }
    const observaed = reactive(original)
    expect(observaed).not.toBe(original)
    expect(observaed.foo).toBe(1)
    expect(isReactive(observaed)).toBe(true)
    expect(isReactive(original)).toBe(false)
  })
})