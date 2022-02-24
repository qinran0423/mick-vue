import { effect } from "../effect"
import { reactive } from "../reactive"
import { isRef, proxyRefs, ref, unRef } from "../ref"


describe('ref', () => {
  it('happy path', () => {
    const a = ref(1)
    expect(a.value).toBe(1)
  })
  it('should be reactive', () => {
    const num = ref(1)

    let dummy, calls = 0
    effect(() => {
      calls++
      dummy = num.value
    })

    expect(dummy).toBe(1)
    expect(calls).toBe(1)
    num.value = 2
    expect(dummy).toBe(2)
    expect(calls).toBe(2)
    // 同样的值不会触发依赖更新
    num.value = 2
    expect(dummy).toBe(2)
    expect(calls).toBe(2)

  })

  it('should make nested properties reactive', () => {
    const a = ref({
      count: 1
    })
    let dummy;
    effect(() => {
      dummy = a.value.count
    })
    expect(dummy).toBe(1)
    a.value.count = 2
    expect(dummy).toBe(2)
  })

  it('should not trigger when the same value', () => {
    const a = ref({
      foo: 1
    })
    let dummy = 0
    effect(() => {
      dummy++
      console.log(a.value.foo);

    })
    expect(dummy).toBe(1)
    a.value = { foo: 1 }
    expect(dummy).toBe(2)

  })

  it('isRef', () => {
    const a = ref(1)
    const user = reactive({
      age: 1
    })
    expect(isRef(a)).toBe(true)
    expect(isRef(1)).toBe(false)
    expect(isRef(user)).toBe(false)
  })

  it('unRef', () => {
    const a = ref(1)
    expect(unRef(a)).toBe(1)
    expect(unRef(1)).toBe(1)
  })

  it('proxyRefs', () => {
    const user = {
      age: ref(10),
      name: 'randy'
    }
    const proxyUser = proxyRefs(user)
    expect(user.age.value).toBe(10)
    expect(proxyUser.age).toBe(10)
    expect(proxyUser.name).toBe('randy')

    proxyUser.age = 20
    expect(proxyUser.age).toBe(20)
    expect(user.age.value).toBe(20)

    proxyUser.age = ref(10)
    expect(proxyUser.age).toBe(10)
    expect(user.age.value).toBe(10)
  })
})