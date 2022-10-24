import { CREARE_ELEMENT_VNODE } from "./transforms/runtimeHelpers"

export const enum NodeTypes {
  INTERPOLATION,
  SIMPLE_EXPRESSION,
  ELEMENT,
  TEXT,
  ROOT,
  COMPOUND_EXPRESSION,
  // codegen
  VNODE_CALL
}

export function createVNodeCall(context, tag, props, children) {
  context.helper(CREARE_ELEMENT_VNODE)
  return {
    type: NodeTypes.VNODE_CALL,
    tag,
    props,
    children
  }
}
