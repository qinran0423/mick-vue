import { mutableHandler, readonlyHandler, shallowReadonlyHandlers } from "./baseHandlers"

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly'
}



export function reactive(raw) {
  return createReactiveOject(raw, mutableHandler)
}

export function readonly(raw) {
  return createReactiveOject(raw, readonlyHandler)
}

export function shallowReadonly(raw) {
  return createReactiveOject(raw, shallowReadonlyHandlers)
}

export function isReactive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY]
}


function createReactiveOject(raw, baseHandlers) {
  return new Proxy(raw, baseHandlers)
}