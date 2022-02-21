import { extend } from "../shared"

let activeEffect
let shouldTrack
export function effect(fn, options: any = {}) {
  // 每一个副作用函数会基于ReactiveEffect类生成实例
  const _effect = new ReactiveEffect(fn, options.scheduler)

  // 将 stop  scheduler合并到_effect上
  extend(_effect, options)

  if (!options || !options.lazy) {
    _effect.run()
  }
  const runner: any = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
}

// 创建一个副作用的类
export class ReactiveEffect {
  private _fn: any
  deps = []
  active = true
  onStop?: () => void
  constructor(fn, public scheduler?) {
    this._fn = fn
  }
  run() {
    // 1. 会收集依赖 
    if (!this.active) {
      return this._fn()
    }
    shouldTrack = true
    activeEffect = this

    const result = this._fn()

    shouldTrack = false

    return result
  }
  stop() {
    if (this.active) {
      cleanupEffect(this)
      this.onStop && this.onStop()
      this.active = false
    }
  }
}

// 清楚副作用
function cleanupEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect)
  });
  effect.deps.length = 0
}

// 创建一个依赖收集的集合
const targetMap = new Map()
export function track(target, key) {
  // if (!activeEffect) return
  // if (!shouldTrack) return

  if (!isTracking()) return
  // target -> key -> dep
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }
  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }

  trackEffects(dep)

}

export function isTracking() {
  return shouldTrack && activeEffect !== undefined
}

export function trackEffects(dep) {
  // 看看dep之前有没有添加过，添加过的话 那么就不添加了
  if (dep.has(activeEffect)) return
  dep.add(activeEffect)
  activeEffect.deps.push(dep)
}

export function trigger(target, key) {
  let depsMap = targetMap.get(target)
  let dep = depsMap.get(key)
  triggerEffects(dep)
}


export function triggerEffects(dep) {
  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}


export function stop(runner) {
  runner.effect.stop()
}