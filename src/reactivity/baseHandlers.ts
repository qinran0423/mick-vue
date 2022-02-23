import { extend, hasChanged, hasOwn, isObject } from "../shared"
import { ITERATE_KEY, track, trigger } from "./effect"
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
    const oldValue = target[key]
    const res = Reflect.set(target, key, val)
    if (hasChanged(val, oldValue)) {
      trigger(target, key)
    }
    return res
  }
}

function deleteProperty(target, key) {
  const hadKey = hasOwn(target, key)

  const result = Reflect.deleteProperty(target, key)

  if (result && hadKey) {
    trigger(target, key)
  }

  return result
}


function has(target, key) {

  const result = Reflect.has(target, key)
  track(target, key)
  return result
}


function ownKeys(target) {
  track(target, ITERATE_KEY)
  return Reflect.ownKeys(target)
}
export const mutableHandler = {
  get,
  set,
  deleteProperty,
  has,
  ownKeys
}

export const readonlyHandler = {
  get: readonlyGet,
  set(target, key, val) {
    console.warn(`key: ${key} set 失败  因为target是readonly`, target);

    return true
  },
  deleteProperty(target, key) {
    console.warn(`key: ${key} del 失败  因为target是readonly`, target);

    return true
  }
}

export const shallowReadonlyHandlers = extend({}, readonlyHandler, {
  get: shallowReadonlyGet
})