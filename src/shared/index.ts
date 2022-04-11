
export const isMap = (val: unknown): val is Map<any, any> =>
  toTypeString(val) === '[object Map]'
export const isSet = (val: unknown): val is Set<any> =>
  toTypeString(val) === '[object Set]'

export const objectToString = Object.prototype.toString
export const toTypeString = (value: unknown): string =>
  objectToString.call(value)

export const isPlainObject = (val: unknown): val is object =>
  toTypeString(val) === '[object Object]'

export function isObject(val) {
  return typeof val === 'object' && val !== null
}

export const isString = (value) => typeof value === "string"

export const extend = Object.assign

export const hasChanged = (val, newval) => {
  return !Object.is(val, newval)
}

export const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key);


export const isArray = Array.isArray

export const camelize = (str: string) => {
  return str.replace(/-(\w)/g, (_, c: string) => {
    return c ? c.toUpperCase() : ''
  })
}

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const toHandlerKey = (str: string) => {
  return str ? "on" + capitalize(str) : ""
}


export const NOOP = () => { }
export const isSymbol = (val) => typeof val === 'symbol'