import { extend, hasChanged, hasOwn, isArray, isObject } from "../shared"
import { ITERATE_KEY, track, trigger } from "./effect"
import { TriggerOpTyes } from "./operations"
import { reactive, ReactiveFlags, readonly, toRaw } from "./reactive"

const get = createGetter()
const set = createSetter()

const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)


const arrayInstrumentations = {}

  ;['includes', 'indexOf', 'lastIndexOf'].forEach(method => {
    const originMethods = Array.prototype[method]
    arrayInstrumentations[method] = function (...args) {
      //this 是代理对象， 先在代理对象中查找  结果存在res中 
      let res = originMethods.apply(this, args)

      if (res === false) {
        res = originMethods.apply(toRaw(this), args)
      }

      return res
    }
  })


function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key) {
    const res = Reflect.get(target, key)

    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    } else if (key === ReactiveFlags.RAW) {
      return target
    }

    if (isArray(target) && hasOwn(arrayInstrumentations, key)) {
      return Reflect.get(arrayInstrumentations, key)
    }

    if (shallow) {
      return res
    }

    if (!isReadonly) {
      // 如果是嵌套对象 则需遍历执行reactive
      track(target, key)
    }

    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }
    return res
  }
}


function createSetter() {
  return function set(target, key, val, recevier) {
    const oldValue = target[key]
    const hadKey = isArray(target) ? Number(key) < target.length : hasOwn(target, key)
    const res = Reflect.set(target, key, val)

    if (target === toRaw(recevier)) {
      if (!hadKey) {
        trigger(target, TriggerOpTyes.ADD, key)
      } else if (hasChanged(val, oldValue)) {
        trigger(target, TriggerOpTyes.SET, key)
      }
    }


    return res
  }
}

function deleteProperty(target, key) {
  const hadKey = hasOwn(target, key)

  const result = Reflect.deleteProperty(target, key)

  if (result && hadKey) {
    trigger(target, TriggerOpTyes.DELETE, key)
  }

  return result
}


function has(target, key) {

  const result = Reflect.has(target, key)
  track(target, key)
  return result
}


function ownKeys(target) {
  track(target, isArray(target) ? 'length' : ITERATE_KEY)
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