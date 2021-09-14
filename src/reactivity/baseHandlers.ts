import { extend, isObject } from "../shared"
import { track, trigger } from "./effect"
import { reactive, ReactiveFlags, readonly } from "./reactive"

const get = createGetter()
const set = createSetter()

const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key) {
    const res = Reflect.get(target, key)

    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }

    if (shallow) {
      return res
    }

    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }

    if (!isReadonly) {
      // 如果是嵌套对象 则需遍历执行reactive
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

export const shallowReadonlyHandlers = extend({}, readonlyHandler, {
  get: shallowReadonlyGet
})