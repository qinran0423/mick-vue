import { ref } from "../../reactivity"
import { reactive } from "../../reactivity/reactive"
import { watch } from "../apiWatch"


describe('api: watch', () => {
  it('watching single source: ref', async () => {
    const count = ref(0)
    let dummy
    watch(
      count,
      (count, prevCount) => {
        dummy = [count, prevCount]

        count + 1
        if (prevCount) {
          prevCount + 1
        }
      }
    )

    count.value++

    expect(dummy).toMatchObject([1, 0])
  })

  it('watching primitive with deep: true', () => {
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

  it('directly watching reative object (with automatic deep: true)', () => {
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


})