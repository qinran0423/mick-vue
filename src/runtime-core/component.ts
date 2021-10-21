import { shallowReadonly } from "../reactivity/reactive"
import { emit } from "./componentEmit"
import { initProps } from "./componentProps"
import { PublicInstanceProxyHandler } from "./componentPublicInstance"

export function createComponentInstance(vnode) {

  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    emit: () => { }
  }

  component.emit = emit.bind(null, component) as any
  return component

}

export function setupComponent(instance) {
  // TODO
  initProps(instance, instance.vnode.props)
  // initSlots

  // 初始化一个有状态的component
  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance: any) {
  const Component = instance.type

  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandler)

  const { setup } = Component
  if (setup) {
    // return function / Object
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit
    })

    handleSetupResult(instance, setupResult)
  }
}

function handleSetupResult(instance, setupResult: any) {
  // function  object
  // TODO
  // function

  if (typeof setupResult === 'object') {
    instance.setupState = setupResult
  }

  finishComponentSetup(instance)
}

function finishComponentSetup(instance: any) {
  const Component = instance.type

  if (Component.render) {
    instance.render = Component.render
  }
}

