import { hasChanged, isObject } from "../shared"
import { isTracking, trackEffects, triggerEffects } from "./effect"
import { reactive } from "./reactive"


class RefTmpl {
  private _rawValue: any
  private _value: any
  private dep: any
  private __v_isRef = true
  constructor(value) {
    this._rawValue = value
    // 如果value 是对象 则需要用reactive进行响应式处理
    this._value = convert(value)
    this.dep = new Set()
  }

  get value() {
    if (isTracking()) {
      trackRefValue(this)
    }
    return this._value
  }

  set value(newval) {
    // hasCh  anged
    if (hasChanged(this._rawValue, newval)) {
      this._rawValue = newval
      this._value = convert(newval)
      triggerRefValue(this)
    }

  }
}

export function ref(value) {
  const refTmpl = new RefTmpl(value)
  return refTmpl
}


function convert(value) {
  return isObject(value) ? reactive(value) : value
}


export function trackRefValue(ref) {
  if (isTracking()) {
    trackEffects(ref.dep)
  }
}

export function triggerRefValue(ref) {
  triggerEffects(ref.dep)
}


export function isRef(ref) {
  return !!ref.__v_isRef
}

export function unRef(ref) {
  return isRef(ref) ? ref.value : ref
}

export function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs, {
    get(target, key) {
      return unRef(Reflect.get(target, key))
    },
    set(target, key, value) {
      if (isRef(target[key]) && !isRef(value)) {
        return target[key].value = value
      } else {
        return Reflect.set(target, key, value)
      }
    }
  })
}