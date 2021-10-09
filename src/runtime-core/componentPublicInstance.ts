const publicPropertiesMap = {
  $el: (i) => i.vnode.el
}


export const PublicInstanceProxyHandler = {
  get({ _: instance }, key) {
    // setupState
    const { setupState } = instance
    if (key in setupState) {
      return setupState[key]
    }

    const publicGetter = publicPropertiesMap[key]
    if (publicGetter) {
      return publicGetter(instance)
    }
  }
}