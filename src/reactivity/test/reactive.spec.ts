import { isProxy, isReactive, reactive } from '../reactive';

describe('reactive', () => {
  it('happy path', () => {
    const original = { foo: 1 }
    const observaed = reactive(original)
    expect(observaed).not.toBe(original)
    expect(observaed.foo).toBe(1)
    expect(isReactive(observaed)).toBe(true)
    expect(isReactive(original)).toBe(false)
    expect(isProxy(observaed)).toBe(true)
  })

  it('nested reactive', () => {
    const original = {
      nested: {
        foo: 1
      },
      array: [{ bar: 2 }]
    }
    const observed = reactive(original)
    expect(isReactive(observed.nested)).toBe(true)
    expect(isReactive(observed.array)).toBe(true)
    expect(isReactive(observed.array[0])).toBe(true)
  })
})