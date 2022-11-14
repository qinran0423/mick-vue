import { isObject } from "@mick-vue/shared"
import { mutableHandler, readonlyHandler, shallowReadonlyHandlers } from "./baseHandlers"


export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
  RAW = '__v_raw'
}

const reactiveMap = new WeakMap()
const readonlyMap = new WeakMap()
const shallowReadonlyMap = new WeakMap()

export function reactive(raw) {
  return createReactiveObject(raw, mutableHandler, reactiveMap)
}

export function readonly(raw) {
  return createReactiveObject(raw, readonlyHandler, readonlyMap)
}

export function shallowReadonly(raw) {
  return createReactiveObject(raw, shallowReadonlyHandlers, shallowReadonlyMap)
}

export function isReactive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY]
}

export function isProxy(value) {
  return isReactive(value) || isReadonly(value)
}

export function toRaw(observed) {
  const raw = observed && observed[ReactiveFlags.RAW]
  return raw ? toRaw(raw) : observed
}


function createReactiveObject(target, baseHandlers, proxyMap) {
  if (!isObject(target)) {
    console.warn(`target ${target}必须是一个对象`);
    return target
  }

  // 优先通过原始对象Obj寻找之前创建的代理对象， 如果找到了，直接返回已有的代理对象
  const existingProxy = proxyMap.get(target)
  if (existingProxy) {
    return existingProxy
  }


  const proxy = new Proxy(target, baseHandlers)
  // 存储到Map中，从而避免重复创建
  proxyMap.set(target, proxy)

  return proxy
}