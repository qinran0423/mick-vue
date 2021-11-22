import { createAppAPI } from "./createApp";
import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component"
import { Fragment, Text } from "./vnode";
import { effect } from "../reactivity/effect";


export function createRenderer(options) {
  const { createElement: hostCreateElement, patchProp: hostpatchProp, insert: hostinsert } = options
  function render(vnode, container) {
    // patch
    // 以便后续进行递归处理
    patch(vnode, container, null)
  }


  function patch(vnode, container, parentComponent) {
    // 处理组件
    // TODO判断是不是一个element类型
    // 如果是element
    const { shapeFlags, type } = vnode

    // Fragment -> 只渲染children 
    switch (type) {
      case Fragment:
        processFragment(vnode, container, parentComponent)
        break;
      case Text:
        processText(vnode, container)
        break;
      default:
        if (shapeFlags & ShapeFlags.ELEMENT) {
          processElement(vnode, container, parentComponent)
        } else if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(vnode, container, parentComponent)
        }
        break;
    }

  }


  function processText(vnode: any, container: any) {
    const { children } = vnode;
    const textNode = (vnode.el = document.createTextNode(children))
    container.append(textNode)
  }

  function processFragment(vnode: any, container: any, parentComponent) {
    mountChildren(vnode, container, parentComponent)
  }



  function processElement(vnode: any, container: any, parentComponent) {
    mountElement(vnode, container, parentComponent)
  }

  function mountElement(vnode, container, parentComponent) {

    const { type, props, children, shapeFlags } = vnode

    const el = (vnode.el = hostCreateElement(type))

    // children => string, array
    if (shapeFlags & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children

    } else if (shapeFlags & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode, el, parentComponent)
    }

    for (const key in props) {
      const val = props[key]


      hostpatchProp(el, key, val)
    }

    hostinsert(el, container)
    // container.append(el)
  }


  function mountChildren(vnode, container, parentComponent) {
    vnode.children.forEach(v => patch(v, container, parentComponent))
  }

  function processComponent(vnode, container, parentComponent) {
    mountComponent(vnode, container, parentComponent)
  }

  function mountComponent(initialVnode: any, container: any, parentComponent) {
    const instance = createComponentInstance(initialVnode, parentComponent)

    setupComponent(instance)

    setupRenderEffect(instance, initialVnode, container)
  }

  function setupRenderEffect(instance: any, initialVnode, container: any) {
    effect(() => {
      debugger
      const { proxy } = instance
      const subTree = instance.render.call(proxy)
      console.log(subTree);

      // vnode -> patch
      // vnode -> element -> mountElement

      patch(subTree, container, instance)
      initialVnode.el = subTree.el
    })

  }


  return {
    createApp: createAppAPI(render)
  }
}

