import { isObject } from "../shared"
import { track, trigger } from "./effect"
import { reactive } from "./reactive"

const get = createGetter()
const set = createSetter()

const readonlyGet = createGetter(true)


function createGetter(isReadonly = false) {
  return function get(target, key) {
    const res = Reflect.get(target, key)
    if (!isReadonly) {
      // 如果是嵌套对象 则需遍历执行reactive
      if (isObject(res)) {
        return reactive(res)
      }
      track(target, key)

    }
    return res
  }
}


function createSetter() {
  return function set(target, key, val) {

    const res = Reflect.set(target, key, val)
    trigger(target, key)
    return res
  }
}



export const mutableHandler = {
  get,
  set
}

export const readonlyHandler = {
  get: readonlyGet,
  set(target, key, val) {
    console.warn(`key: ${key} set 失败  因为target是readonly`, target);

    return true
  }
}