import { computed } from "../src/computed"
import { effect } from "../src/effect"
import { reactive } from "../src/reactive"

describe("computed", () => {
  it("happy path", () => {
    // ref
    // value
    // 1. 缓存
    const user = reactive({
      age: 1
    })

    const age = computed(() => {
      return user.age
    })

    expect(age.value).toBe(1)
  })

  it("should computed lazily", () => {
    const value = reactive({
      foo: 1
    })
    const getter = jest.fn(() => {
      return value.foo
    })
    const cValue = computed(getter)

    // lazy
    expect(getter).not.toHaveBeenCalled()

    expect(cValue.value).toBe(1)
    expect(getter).toHaveBeenCalledTimes(1)

    // // should not compute again
    cValue.value
    expect(getter).toHaveBeenCalledTimes(1)

    // // should not computed until needed
    value.foo = 2
    expect(getter).toHaveBeenCalledTimes(1)

    // now it should compute
    expect(cValue.value).toBe(2)
    expect(getter).toHaveBeenCalledTimes(2)

    // should not compute again
    cValue.value
    expect(getter).toHaveBeenCalledTimes(2)
  })

  it("should trigger effect", () => {
    const value = reactive({
      foo: 1
    })

    const cValue = computed(() => value.foo)

    let dummy
    effect(() => {
      dummy = cValue.value
    })
    expect(dummy).toBe(1)
    value.foo = 2
    expect(dummy).toBe(2)
  })
})
