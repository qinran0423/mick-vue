import { isProxy, isReadonly, readonly } from "../src/reactive"

describe('readonly', () => {
  it('happy path', () => {
    const original = { foo: 1, bar: { baz: 2 } }
    const wrapped = readonly(original)
    expect(wrapped).not.toBe(original)
    expect(isReadonly(wrapped)).toBe(true)
    expect(isReadonly(original)).toBe(false)
    expect(isReadonly(wrapped.bar)).toBe(true)
    expect(isReadonly(original.bar)).toBe(false)
    expect(isProxy(wrapped)).toBe(true)
    expect(wrapped.foo).toBe(1)

  })

  it('warn then call set', () => {
    console.warn = jest.fn()
    const user = readonly({
      age: 10
    })
    user.age = 11
    expect(console.warn).toBeCalled()
  })


  it('warn then call del', () => {
    console.warn = jest.fn()
    const user = readonly({
      age: 10
    })

    delete user.age
    expect(console.warn).toBeCalled()

  })
})