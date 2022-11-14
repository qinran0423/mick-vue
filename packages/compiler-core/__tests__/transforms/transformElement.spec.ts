import { NodeTypes } from "../../src/ast"
import { baseParse } from "../../src/parse"
import { transform } from "../../src/transform"
import { transformElement } from "../../src/transforms/transformElement"
import { transformText } from "../../src/transforms/transformText"

describe("transformElement", () => {
  test("children", () => {
    const ast = baseParse("<div><span></span></div>")

    transform(ast, {
      nodeTransforms: [transformElement, transformText]
    })

    console.log(ast)
    const codegenNode = ast.children[0].children[0].codegenNode
    expect(codegenNode.type).toBe(NodeTypes.VNODE_CALL)
  })
})
