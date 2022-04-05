import { generate } from "../src/codegen";
import { baseParse } from "../src/parse"
import { transform } from "../src/transform";

describe('codegen', () => {
  it('string', () => {
    const ast = baseParse('hi')
    console.log(ast);
    transform(ast)
    const { code } = generate(ast)

    // 快照
    expect(code).toMatchSnapshot()
  })
})