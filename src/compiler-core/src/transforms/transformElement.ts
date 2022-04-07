import { NodeTypes } from "../ast";
import { CREARE_ELEMENT_VNODE } from "./runtimeHelpers";

export function transformElement(node, context) {
  if (node.type === NodeTypes.ELEMENT) {
    context.helper(CREARE_ELEMENT_VNODE)
  }
}