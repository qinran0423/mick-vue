import { hasChanged, isObject } from "../shared"
import { isTracking, trackEffects, triggerEffects } from "./effect"
import { reactive } from "./reactive"


class RefTmpl {
  private _rawValue: any
  private _value: any
  private dep: any
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
    // hasChanged
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


function trackRefValue(ref) {
  trackEffects(ref.dep)
}

function triggerRefValue(ref) {
  triggerEffects(ref.dep)
}