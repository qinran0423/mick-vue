import { isObject } from "../shared/index"
import { mutableHandler, readonlyHandler, shallowReadonlyHandlers } from "./baseHandlers"

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
  RAW = '__v_raw'
}



export function reactive(raw) {
  return createReactiveObject(raw, mutableHandler)
}

export function readonly(raw) {
  return createReactiveObject(raw, readonlyHandler)
}

export function shallowReadonly(raw) {
  return createReactiveObject(raw, shallowReadonlyHandlers)
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


function createReactiveObject(target, baseHandlers) {
  if (!isObject(target)) {
    console.warn(`target ${target}必须是一个对象`);
    return target
  }
  return new Proxy(target, baseHandlers)
}