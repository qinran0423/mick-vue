import { effect } from "../effect"
import { ref } from "../ref"


describe('ref', () => {
  it('should be reactive', () => {
    const num = ref(1)

    let dummy, calls = 0
    effect(() => {
      calls++
      dummy = num.value
    })

    expect(dummy).toBe(1)
    expect(calls).toBe(1)
    num.value++
    expect(dummy).toBe(2)
    expect(calls).toBe(2)
    // 同样的值不会触发依赖更新
    num.value = 2
    expect(dummy).toBe(2)
    expect(calls).toBe(2)

  })
})