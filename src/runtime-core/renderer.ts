import { createAppAPI } from "./createApp";
import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component"
import { Fragment, Text } from "./vnode";
import { effect } from "../reactivity/effect";
import { shouldUpdateComponent } from "./componentUpdateUtils";
import { queueJobs } from "./scheduler";


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
    patch(null, vnode, container, null, null)
  }


  function patch(n1, n2, container, parentComponent, anchor) {
    // 处理组件
    // TODO判断是不是一个element类型
    // 如果是element
    const { shapeFlags, type } = n2

    // Fragment -> 只渲染children 
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent, anchor)
        break;
      case Text:
        processText(n1, n2, container)
        break;
      default:
        if (shapeFlags & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent, anchor)
        } else if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, parentComponent, anchor)
        }
        break;
    }

  }


  function processText(n1, n2: any, container: any) {
    const { children } = n2;
    const textNode = (n2.el = document.createTextNode(children))
    container.append(textNode)
  }

  function processFragment(n1, n2: any, container: any, parentComponent, anchor) {
    mountChildren(n2.children, container, parentComponent, anchor)
  }



  function processElement(n1, n2: any, container: any, parentComponent, anchor) {
    if (!n1) {
      mountElement(n2, container, parentComponent, anchor)
    } else {
      patchElement(n1, n2, container, parentComponent, anchor)
    }

  }


  function patchElement(n1, n2, container, parentComponent, anchor) {
    console.log('patch');
    console.log('n1', n1);
    console.log('n2', n2);

    const oldProps = n1.props || {}
    const newprops = n2.props || {}

    const el = (n2.el = n1.el)

    patchChildren(n1, n2, el, parentComponent, anchor)
    patchProps(el, oldProps, newprops)

  }

  function patchChildren(n1, n2, container, parentComponent, anchor) {
    const prevShapeFlags = n1.shapeFlags
    const c1 = n1.children
    const { shapeFlags } = n2
    const c2 = n2.children
    // 判断新的值是否是文本节点
    if (shapeFlags & ShapeFlags.TEXT_CHILDREN) {
      // 老的是数组节点 需要删除所有的子节点
      if (prevShapeFlags & ShapeFlags.ARRAY_CHILDREN) {
        unmountChildren(n1.children)
      }
      // 重新设置text
      if (c1 !== c2) {
        hostSetElementText(container, c2)
      }
    } else {
      if (prevShapeFlags & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText(container, '')
        mountChildren(c2, container, parentComponent, anchor)
      } else {
        // array diff array
        patchKeyChildren(c1, c2, container, parentComponent, anchor)
      }
    }

  }


  function patchKeyChildren(c1, c2, container, parentComponent, parentAnchor) {
    const l2 = c2.length
    let i = 0,
      e1 = c1.length - 1,
      e2 = l2 - 1

    function isSomeVNodeType(n1, n2,) {
      // type   key
      return n1.type === n2.type && n1.key === n2.key
    }
    // 左侧
    while (i <= e1 && i <= e2) {
      const n1 = c1[i]
      const n2 = c2[i]

      if (isSomeVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, parentAnchor)
      } else {
        break;
      }

      i++
    }


    // 右侧
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1]
      const n2 = c2[e2]

      if (isSomeVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, parentAnchor)
      } else {
        break;
      }

      e1--;
      e2--;
    }

    // 3.新的比老的多  创建
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1;
        const anchor = nextPos < l2 ? c2[nextPos].el : null
        while (i <= e2) {
          patch(null, c2[i], container, parentComponent, anchor)
          i++
        }
      }
    }
    // 老的比新的多  移除
    else if (i > e2) {
      while (i <= e1) {
        hostRemove(c1[i].el)
        i++
      }
    } else {
      // 乱序
      // 对比中间
      let s1 = i;
      let s2 = i;

      // 需要处理新节点的数量
      const toBePatched = e2 - s2 + 1
      let patched = 0

      // 新节点key和索引的映射表
      const keyToNewIndexMap = new Map()
      // 遍历新节点 设置映射表
      for (let i = s2; i <= e2; i++) {
        const nextChild = c2[i]
        keyToNewIndexMap.set(nextChild.key, i)
      }
      // 遍历老节点
      for (let i = s1; i <= e1; i++) {
        const prevChild = c1[i]
        // 如果老的节点大于新节点的数量的话，那么这里在处理老节点的时候就直接删除即可
        if (patched >= toBePatched) {
          hostRemove(prevChild.el)
          continue
        }

        let newIndex


        if (prevChild.key !== null) {
          // 如果老节点的key存在， 则看下这个key是否在映射表中能够找到， 拿到新节点对应的索引
          newIndex = keyToNewIndexMap.get(prevChild.key)
        } else {
          // key不存在，则遍历新节点 查找
          for (let j = s2; j < e2; j++) {
            if (isSomeVNodeType(prevChild, c2[j])) {
              newIndex = j
              break
            }
          }
        }

        if (newIndex === undefined) {
          // 如果没找到对应的节点  则移除旧节点
          hostRemove(prevChild.el)
        } else {
          // 找到了则新老节点打补丁
          patch(prevChild, c2[newIndex], container, parentComponent, null)
          patched++
        }
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

  function mountElement(vnode, container, parentComponent, anchor) {

    const { type, props, children, shapeFlags } = vnode

    const el = (vnode.el = hostCreateElement(type))

    // children => string, array
    if (shapeFlags & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children

    } else if (shapeFlags & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode.children, el, parentComponent, anchor)
    }

    for (const key in props) {
      const val = props[key]


      hostpatchProp(el, key, null, val)
    }

    hostinsert(el, container, anchor)
    // container.append(el)
  }


  function mountChildren(children, container, parentComponent, anchor) {
    children.forEach(v => patch(null, v, container, parentComponent, anchor))
  }

  function processComponent(n1, n2, container, parentComponent, anchor) {
    if (!n1) {
      mountComponent(n2, container, parentComponent, anchor)
    } else {
      updateComponent(n1, n2)
    }
  }

  function updateComponent(n1, n2) {
    const instance = (n2.component = n1.component)
    if (shouldUpdateComponent(n1, n2)) {
      instance.next = n2
      instance.update()
    } else {
      n2.el = n1.el
      n2.vnode = n2
    }

  }



  function mountComponent(initialVnode: any, container: any, parentComponent, anchor) {
    const instance = (initialVnode.component = createComponentInstance(initialVnode, parentComponent))

    setupComponent(instance)

    setupRenderEffect(instance, initialVnode, container, anchor)
  }

  function setupRenderEffect(instance: any, initialVnode, container: any, anchor) {
    instance.update = effect(() => {
      if (!instance.isMounted) {
        console.log('init');

        const { proxy } = instance
        const subTree = (instance.subTree = instance.render.call(proxy))
        console.log(subTree);

        // vnode -> patch
        // vnode -> element -> mountElement

        patch(null, subTree, container, instance, anchor)
        initialVnode.el = subTree.el


        instance.isMounted = true
      } else {
        console.log('update');

        const { next, vnode } = instance
        if (next) {
          next.el = vnode.el

          updateComponentPreRender(instance, next)
        }

        const { proxy } = instance
        const subTree = instance.render.call(proxy);
        const prevSubTree = instance.subTree;
        instance.subTree = subTree;

        patch(prevSubTree, subTree, container, instance, anchor)

      }

    }, {
      scheduler() {
        console.log('update scheduler');
        queueJobs(instance.update)
      }
    })

  }


  return {
    createApp: createAppAPI(render)
  }
}

function updateComponentPreRender(instance, nextVnode) {

  instance.vnode = nextVnode
  instance.next = null

  instance.props = nextVnode.props




}


