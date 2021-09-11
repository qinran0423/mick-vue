import { isObject } from "../shared"
import { track, trigger } from "./effect"

export function reactive(raw) {
  return new Proxy(raw, {
    get(target, key) {
      const res = Reflect.get(target, key)
      // 如果是嵌套对象 则需遍历执行reactive
      if (isObject(res)) {
        return reactive(res)
      }
      track(target, key)
      return res
    },
    set(target, key, val) {

      const res = Reflect.set(target, key, val)
      trigger(target, key)
      return res
    }
  })
}