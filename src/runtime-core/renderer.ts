import { isObject } from "../shared/index";
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
  console.log(vnode.type);
  if (typeof vnode.type === 'string') {
    processElement(vnode, container)
  } else if (isObject(vnode.type)) {
    processComponent(vnode, container)
  }
}

function processElement(vnode: any, container: any) {
  mountElement(vnode, container)
}

function mountElement(vnode, container) {

  const { type, props, children } = vnode

  const el = document.createElement(type)

  // children => string, array
  if (typeof children === 'string') {
    el.textContent = children
    for (const key in props) {
      const val = props[key]
      el.setAttribute(key, val)
    }
  } else if (Array.isArray(children)) {
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

function mountComponent(vnode: any, container: any) {
  const instance = createComponentInstance(vnode)

  setupComponent(instance)

  setupRenderEffect(instance, container)
}

function setupRenderEffect(instance: any, container: any) {
  const subTree = instance.render()

  // vnode -> patch
  // vnode -> element -> mountElement

  patch(subTree, container)
}



