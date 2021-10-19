export function isObject(val) {
  return typeof val === 'object' && val !== null
}

export const extend = Object.assign

export const hasChanged = (val, newval) => {
  return !Object.is(val, newval)
}

export const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key);