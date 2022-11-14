export function shouldUpdateComponent(preVnode, nextVnode) {
  const { props: prevProps } = preVnode
  const { props: nextProps } = nextVnode

  for (const key in nextProps) {
    if (nextVnode[key] !== prevProps[key]) {
      return true
    }

    return false
  }
}
