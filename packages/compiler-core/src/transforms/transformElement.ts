import { createVNodeCall, NodeTypes } from "../ast"

export function transformElement(node, context) {
  if (node.type === NodeTypes.ELEMENT) {
    return () => {
      // 中间处理层

      // tag
      const vnodeTag = `'${node.tag}'`

      // props
      let vnodeProps
      // children
      const children = node.children
      let vnodeChildren = children[0]

      node.codegenNode = createVNodeCall(
        context,
        vnodeTag,
        vnodeProps,
        vnodeChildren
      )
    }
  }
}
