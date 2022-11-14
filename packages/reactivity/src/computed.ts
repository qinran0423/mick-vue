
import { ReactiveEffect} from './effect'
import { trackRefValue, triggerRefValue } from './ref'

class ComputedRefTmpl {
  private _getter: any
  private _dirty: boolean = true
  private _value: any
  private _effect: any
  private dep: any = new Set()
  constructor(getter) {
    this._getter = getter

    this._effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true
        triggerRefValue(this)
      }
    })
  }

  get value() {
    // get
    // get value -> dirty true
    // 当依赖的响应式对象的值发生改变的时候 effect收集
    trackRefValue(this)
    if (this._dirty) {
      this._dirty = false
      this._value = this._effect.run()
    }
    return this._value
  }

}

export function computed(getter) {
  return new ComputedRefTmpl(getter)
}