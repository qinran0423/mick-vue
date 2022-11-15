import { ref } from "@mick-vue/reactivity"
import { reactive } from "@mick-vue/reactivity"
import { watch } from "../apiWatch"

describe("api: watch", () => {
  it("watching single source: ref", async () => {
    const count = ref(0)
    let dummy
    watch(count, (count, prevCount) => {
      dummy = [count, prevCount]

      count + 1
      if (prevCount) {
        prevCount + 1
      }
    })

    count.value++

    expect(dummy).toMatchObject([1, 0])
  })

  it("watching primitive with deep: true", () => {
    const count = ref(0)
    let dummy
    watch(
      count,
      (c, prevCount) => {
        dummy = [c, prevCount]
      },
      {
        deep: true
      }
    )
    count.value++
    expect(dummy).toMatchObject([1, 0])
  })

  it("directly watching reative object (with automatic deep: true)", () => {
    const src = reactive({
      count: 0
    })

    let dummy
    watch(src, ({ count }) => {
      dummy = count
    })
    src.count++
    expect(dummy).toBe(1)
  })

  it("immedidate", () => {
    const count = ref(0)
    const cb = jest.fn()
    watch(count, cb, { immediate: true })
    expect(cb).toHaveBeenCalledTimes(1)
    count.value++
    expect(cb).toHaveBeenCalledTimes(2)
  })
})
