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
    patch(null, vnode, container, null)
  }


  function patch(n1, n2, container, parentComponent) {
    // 处理组件
    // TODO判断是不是一个element类型
    // 如果是element
    const { shapeFlags, type } = n2

    // Fragment -> 只渲染children 
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent)
        break;
      case Text:
        processText(n1, n2, container)
        break;
      default:
        if (shapeFlags & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent)
        } else if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, parentComponent)
        }
        break;
    }

  }


  function processText(n1, n2: any, container: any) {
    const { children } = n2;
    const textNode = (n2.el = document.createTextNode(children))
    container.append(textNode)
  }

  function processFragment(n1, n2: any, container: any, parentComponent) {
    mountChildren(n1, container, parentComponent)
  }



  function processElement(n1, n2: any, container: any, parentComponent) {
    if (!n1) {
      mountElement(n2, container, parentComponent)
    } else {
      patchElement(n1, n2, container)
    }

  }


  function patchElement(n1, n2, container) {
    console.log('patch');
    console.log('n1', n1);
    console.log('n2', n2);


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
    vnode.children.forEach(v => patch(null, v, container, parentComponent))
  }

  function processComponent(n1, n2, container, parentComponent) {
    mountComponent(n2, container, parentComponent)
  }

  function mountComponent(initialVnode: any, container: any, parentComponent) {
    const instance = createComponentInstance(initialVnode, parentComponent)

    setupComponent(instance)

    setupRenderEffect(instance, initialVnode, container)
  }

  function setupRenderEffect(instance: any, initialVnode, container: any) {
    effect(() => {
      if (!instance.isMounted) {
        console.log('init');

        const { proxy } = instance
        const subTree = (instance.subTree = instance.render.call(proxy))
        console.log(subTree);

        // vnode -> patch
        // vnode -> element -> mountElement

        patch(null, subTree, container, instance)
        initialVnode.el = subTree.el


        instance.isMounted = true
      } else {
        console.log('update');
        const { proxy } = instance
        const subTree = instance.render.call(proxy);
        const prevSubTree = instance.subTree;
        instance.subTree = subTree;

        patch(prevSubTree, subTree, container, instance)

      }

    })

  }


  return {
    createApp: createAppAPI(render)
  }
}

