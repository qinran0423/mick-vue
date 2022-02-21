import { ReactiveEffect } from "../reactivity/effect"
import { isReactive } from "../reactivity/reactive"
import { isRef } from "../reactivity/ref"
import { isMap, isPlainObject, isSet, NOOP } from "../shared";

interface WatchOptions {
  immediate?: boolean;
  deep?: boolean;
}

export function watch(source, cb, options?: WatchOptions) {
  return doWatch(source, cb, options);
}


function doWatch(source: any, cb: any, { immediate, deep }: WatchOptions = { deep: false }) {
  let getter: () => any;
  if (isRef(source)) {
    getter = () => source.value;
  } else if (isReactive(source)) {
    getter = () => source;
    deep = true;
  } else {
    getter = NOOP;
  }

  if (cb && deep) {
    const baseGetter = getter;
    getter = () => traverse(baseGetter());
  }

  let newValue, oldValue
  const job = () => {
    newValue = effect.run();
    cb(newValue, oldValue);
    oldValue = newValue;
  }
  const effect = new ReactiveEffect(getter,
    job
  );

  if (immediate) {
    job()
  } else {
    oldValue = effect.run();
  }

}

function traverse(value, seen = new Set()) {
  // 如果读取的数据是原始值，或者已经被读取过了，那么什么都不做
  if (typeof value !== 'object' || value === null || seen.has(value)) return value

  seen.add(value)

  if (isRef(value)) {
    traverse(value.value, seen)
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v: any) => {
      traverse(v, seen)
    })
  } else if (isPlainObject(value)) {
    for (const key in value) {
      traverse(value[key], seen)
    }
  }
  return value

}