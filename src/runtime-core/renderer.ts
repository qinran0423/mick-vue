import { isObject } from "../shared/index";
import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component"

export function render(vnode, container) {
  // patch
  // 以便后续进行递归处理
  patch(vnode, container)
}

function patch(vnode, container) {
  // 处理组件
  // TODO判断是不是一个element类型
  // 如果是element
  const { shapeFlags } = vnode
  if (shapeFlags & ShapeFlags.ELEMENT) {
    processElement(vnode, container)
  } else if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
    processComponent(vnode, container)
  }
}

function processElement(vnode: any, container: any) {
  mountElement(vnode, container)
}

function mountElement(vnode, container) {

  const { type, props, children, shapeFlags } = vnode

  const el = (vnode.el = document.createElement(type))

  // children => string, array
  if (shapeFlags & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children
    for (const key in props) {
      const val = props[key]

      const isOn = (key: string) => /^on[A-Z]/.test(key)
      if (isOn(key)) {
        const event = key.slice(2).toLowerCase()
        el.addEventListener(event, val)
      } else {
        el.setAttribute(key, val)
      }

    }
  } else if (shapeFlags & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(vnode, container)
  }

  container.append(el)
}


function mountChildren(vnode, container) {
  vnode.children.forEach(v => patch(v, container))
}

function processComponent(vnode, container) {
  mountComponent(vnode, container)
}

function mountComponent(initialVnode: any, container: any) {
  const instance = createComponentInstance(initialVnode)

  setupComponent(instance)

  setupRenderEffect(instance, initialVnode, container)
}

function setupRenderEffect(instance: any, initialVnode, container: any) {
  const { proxy } = instance
  const subTree = instance.render.call(proxy)

  // vnode -> patch
  // vnode -> element -> mountElement

  patch(subTree, container)
  initialVnode.el = subTree.el
}



