import { hasOwn } from "@mick-vue/shared"

const publicPropertiesMap = {
  $el: (i) => i.vnode.el,
  $slots: (i) => i.slots,
  $props: (i) => i.props
}

export const PublicInstanceProxyHandler = {
  get({ _: instance }, key) {
    // setupState
    const { setupState, props } = instance
    // if (key in setupState) {
    //   return setupState[key]
    // }

    if (hasOwn(setupState, key)) {
      return setupState[key]
    } else if (hasOwn(props, key)) {
      return props[key]
    }
    const publicGetter = publicPropertiesMap[key]
    if (publicGetter) {
      return publicGetter(instance)
    }
  }
}
