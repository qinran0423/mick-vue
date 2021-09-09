let activeEffect
export function effect(fn, options: any = {}) {
  const scheduler = options.scheduler
  const _effect = new ReactiveEffect(fn, scheduler)

  _effect.run()
  const runner: any = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
}
class ReactiveEffect {
  private _fn: any
  deps = [];
  constructor(fn, public scheduler?) {
    this._fn = fn
  }
  run() {
    activeEffect = this
    return this._fn()
  }
  stop() {
    cleanupEffect(this)
  }
}

function cleanupEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect)
  });
}

const targetMap = new Map()
export function track(target, key) {
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


export function trackEffects(dep) {
  dep.add(activeEffect)
  activeEffect && activeEffect.deps.push(dep)
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