import { effect } from "../effect"
import { isReactive, reactive } from "../reactive"



describe('reactive/Array', () => {
  it('should make Array reactive', () => {
    const original = [{ foo: 1 }]
    const observed = reactive(original)
    expect(observed).not.toBe(original)
    expect(isReactive(observed)).toBe(true)
    expect(isReactive(original)).toBe(false)
    expect(isReactive(observed[0])).toBe(true)
    // get
    expect(observed[0].foo).toBe(1)
    // has
    expect(0 in observed).toBe(true)
    // ownKeys
    expect(Object.keys(observed)).toEqual(['0'])
  })

  // it('cloned reactive Array should point to observed values', () => {
  //   const original = [{ foo: 1 }]
  //   const observed = reactive(original)
  //   const clone = observed.slice()
  //   expect(isReactive(clone[0])).toBe(true)
  //   expect(clone[0]).not.toBe(original[0])
  //   expect(clone[0]).toBe(observed[0])
  // })

  it('Array identity methods should work with raw values', () => {

    const raw = {}
    const arr = reactive([{}, {}])
    arr.push(raw)
    expect(arr.includes(arr[0])).toBe(true)
    expect(arr.includes(raw)).toBe(true)
  })

  test('track length on for ... in iteration', () => {
    const array = reactive([1])
    let length = ''
    effect(() => {
      length = ''
      for (const key in array) {
        length += key
      }
    })
    expect(length).toBe('0')
    array.push(1)
    expect(length).toBe('01')
  })
})