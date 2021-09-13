import { mutableHandler, readonlyHandler } from "./baseHandlers"

export function reactive(raw) {
  return createActiveOject(raw, mutableHandler)
}

export function readonly(raw) {
  return createActiveOject(raw, readonlyHandler)
}

function createActiveOject(raw, baseHandlers) {
  return new Proxy(raw, baseHandlers)
}