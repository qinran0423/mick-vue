import { mutableHandler, readonlyHandler } from "./baseHandlers"

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

export function isReactive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE]
}


export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY]
}


function createReactiveOject(raw, baseHandlers) {
  return new Proxy(raw, baseHandlers)
}