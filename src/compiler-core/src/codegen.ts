

export function generate(ast) {
  const context = createCodegenContext()
  const { push } = context
  push("return ")

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

function genNode(node: any, context) {
  const { push } = context
  push(`'${node.content}'`)
}
function createCodegenContext() {
  const context = {
    code: '',
    push(source) {
      context.code += source
    }
  }
  return context
}

