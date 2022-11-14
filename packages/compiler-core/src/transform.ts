import { NodeTypes } from "./ast"
import { TO_DISPLAT_STRING } from "./transforms/runtimeHelpers"

export function transform(root, options = {}) {
  const context = createTransformsContext(root, options)

  traverseNode(root, context)

  createRootCodegen(root)

  root.helpers = [...context.helpers.keys()]
}

function traverseNode(node: any, context) {
  // 节点转换函数
  const nodeTransforms = context.nodeTransforms
  const exitFns: any = []
  for (let i = 0; i < nodeTransforms.length; i++) {
    const transform = nodeTransforms[i]
    // 有些转换函数会设计一个退出函数，在处理完子节点后执行
    const onExit = transform(node, context)
    if (onExit) exitFns.push(onExit)
  }

  switch (node.type) {
    case NodeTypes.INTERPOLATION:
      // 需要导入toString辅助函数
      context.helper(TO_DISPLAT_STRING)
      break
    case NodeTypes.ROOT:
    case NodeTypes.ELEMENT:
      // 遍历子节点
      traverseChildren(node, context)
      break
    default:
      break
  }

  // 执行转换函数返回的退出函数
  let i = exitFns.length
  while (i--) {
    exitFns[i]()
  }
}

function traverseChildren(node: any, context: any) {
  const children = node.children

  for (let i = 0; i < children.length; i++) {
    const node = children[i]
    traverseNode(node, context)
  }
}

function createTransformsContext(root, options) {
  const context = {
    root,
    nodeTransforms: options.nodeTransforms || [],
    helpers: new Map(),
    helper(key) {
      context.helpers.set(key, 1)
    }
  }

  return context
}

function createRootCodegen(root: any) {
  const child = root.children[0]
  if (child.type === NodeTypes.ELEMENT) {
    root.codegenNode = child.codegenNode
  } else {
    root.codegenNode = root.children[0]
  }
}
