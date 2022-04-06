import { NodeTypes } from "./ast"
import { helperMapName, TO_DISPLAT_STRING } from "./transforms/runtimeHelpers"


export function generate(ast) {
  const context = createCodegenContext()
  const { push } = context

  genFunctionPreambale(ast, context)

  const functionName = "render"
  const args = ["_ctx", "_cache"]
  const signature = args.join(", ")



  push(`function ${functionName}(${signature}){`)
  push(`return`)
  genNode(ast.codegenNode, context)
  push("}")

  return {
    code: context.code
  }
}

function genFunctionPreambale(ast, context) {
  const { push } = context
  const VueBinging = "Vue"
  const aliasHeplers = (s) => `${helperMapName[s]}: _${helperMapName[s]}`

  if (ast.helpers.length > 0) {
    push(`const { ${ast.helpers.map(aliasHeplers).join(", ")} } = ${VueBinging}`)
  }
  push("\n")
  push("return ")
}

function genNode(node: any, context) {

  switch (node.type) {
    case NodeTypes.TEXT:
      genText(node, context)
      break;
    case NodeTypes.INTERPOLATION:
      geninterpolation(node, context)
      break;
    case NodeTypes.SIMPLE_EXPRESSION:
      genExpression(node, context)
      break;
    default:
      break;
  }


}

function createCodegenContext() {
  const context = {
    code: '',
    push(source) {
      context.code += source
    },
    helper(key) {
      return `_${helperMapName[key]}`
    }
  }
  return context
}

function genText(node, context) {
  const { push } = context
  push(` '${node.content}'`)
}


function geninterpolation(node, context) {
  const { push, helper } = context
  push(`${helper(TO_DISPLAT_STRING)}(`)
  genNode(node.content, context)
  push(")")
}

function genExpression(node, context) {
  const { push } = context
  push(`${node.content}`)
}

