export function isObject(val) {
  return typeof val === 'object' && val !== null
}

export const extend = Object.assign