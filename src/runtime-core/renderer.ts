import { createAppAPI } from "./createApp";
import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component"
import { Fragment, Text } from "./vnode";
import { effect } from "../reactivity/effect";


export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    patchProp: hostpatchProp,
    insert: hostinsert,
    remove: hostRemove,
    setElementText: hostSetElementText
  } = options
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
    mountChildren(n2.children, container, parentComponent)
  }



  function processElement(n1, n2: any, container: any, parentComponent) {
    if (!n1) {
      mountElement(n2, container, parentComponent)
    } else {
      patchElement(n1, n2, container, parentComponent)
    }

  }


  function patchElement(n1, n2, container, parentComponent) {
    console.log('patch');
    console.log('n1', n1);
    console.log('n2', n2);

    const oldProps = n1.props || {}
    const newprops = n2.props || {}

    const el = (n2.el = n1.el)

    patchChildren(n1, n2, el, parentComponent)
    patchProps(el, oldProps, newprops)

  }

  function patchChildren(n1, n2, container, parentComponent) {
    const prevShapeFlags = n1.shapeFlags
    const c1 = n1.children
    const { shapeFlags } = n2
    const c2 = n2.children
    if (shapeFlags & ShapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlags & ShapeFlags.ARRAY_CHILDREN) {
        unmountChildren(n1.children)
      }
      if (c1 !== c2) {
        hostSetElementText(container, c2)
      }
    } else {
      if (prevShapeFlags & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText(container, '')
        mountChildren(c2, container, parentComponent)
      }
    }

  }

  function unmountChildren(children) {
    for (let i = 0; i < children.length; i++) {
      const el = children[i].el;
      // remove删除
      hostRemove(el)
    }
  }


  function patchProps(el, oldProps, newProps) {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        const prevProp = oldProps[key]
        const nextProp = newProps[key]
        if (prevProp !== nextProp) {
          hostpatchProp(el, key, prevProp, nextProp)
        }

        if (oldProps !== {}) {
          for (const key in oldProps) {
            if (!(key in newProps)) {
              hostpatchProp(el, key, oldProps[key], null)
            }
          }
        }

      }
    }

  }

  function mountElement(vnode, container, parentComponent) {

    const { type, props, children, shapeFlags } = vnode

    const el = (vnode.el = hostCreateElement(type))

    // children => string, array
    if (shapeFlags & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children

    } else if (shapeFlags & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode.children, el, parentComponent)
    }

    for (const key in props) {
      const val = props[key]


      hostpatchProp(el, key, null, val)
    }

    hostinsert(el, container)
    // container.append(el)
  }


  function mountChildren(children, container, parentComponent) {
    children.forEach(v => patch(null, v, container, parentComponent))
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

