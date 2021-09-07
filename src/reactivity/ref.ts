import { isObject } from "../shared"
import { trackEffects, triggerEffects } from "./effect"
import { reactive } from "./reactive"


class RefTmpl {
  private _value: any
  private dep: any
  constructor(value) {
    // 如果value 是对象 则需要用reactive进行响应式处理
    this._value = convert(value)
    this.dep = new Set()
  }

  get value() {
    trackRefValue(this)
    return this._value
  }

  set value(newval) {
    this._value = newval
    triggerRefValue(this)

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