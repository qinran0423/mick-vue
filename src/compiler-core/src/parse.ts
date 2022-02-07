import { NodeTypes } from "./ast"

export function baseParse(content: string) {

  const context = createParserContext(content)

  return createRoot(parseChildren(context))
}


function parseChildren(context) {
  const nodes: any = []

  let node
  if (context.source.startsWith("{{")) {
    node = parseInterpolation(context)
  }
  nodes.push(node)
  return nodes
}


function parseInterpolation(context) {

  const openDelimiter = '{{'
  const closeDelimiter = '}}'

  const closeIndex = context.source.indexOf(closeDelimiter, openDelimiter.length)

  advanceBy(context, openDelimiter.length)

  const rawContentLength = closeIndex - openDelimiter.length
  const rawContent = context.source.slice(0, rawContentLength)
  const content = rawContent.trim()
  advanceBy(context, rawContentLength + closeDelimiter.length)

  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content
    }
  }
}

function advanceBy(context: any, length: number) {
  context.source = context.source.slice(length)
}

function createRoot(children) {
  return {
    children
  }
}

function createParserContext(content: string) {
  return {
    source: content
  }
}
