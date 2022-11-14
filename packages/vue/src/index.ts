// mick-vue的出口
export * from "@mick-vue/runtime-dom"
import { baseCompile } from "@mick-vue/compiler-core"
import * as runtimeDom from "@mick-vue/runtime-dom"
import { registerRuntimeCompiler } from "@mick-vue/runtime-dom"

function compileToFunction(template) {
  const { code } = baseCompile(template)

  const render = new Function("Vue", code)(runtimeDom)

  return render
}

registerRuntimeCompiler(compileToFunction)
