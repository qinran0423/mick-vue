export function isObject(val) {
  return typeof val === 'object' && val !== null
}

export const extend = Object.assign

export const hasChanged = (val, newval) => {
  return !Object.is(val, newval)
}

export const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key);

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