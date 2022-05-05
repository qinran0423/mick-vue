# mick-vue

基于 vue3 源码实现一个 TDD mini 版的 vue

### reactivity

- [x] reactive 的实现
- [x] track 依赖收集
- [x] trigger 触发依赖
- [x] 支持 effect.scheduler
- [x] 支持 effect.stop
- [x] readonly 的实现
- [x] 支持 isReactive
- [x] 支持 isReadonly
- [x] 支持嵌套 reactive
- [x] 支持嵌套 readonly
- [x] 支持 shallowReadonly
- [x] 支持 isProxy
- [x] ref 的实现
- [x] 支持 isRef
- [x] 支持 unref
- [x] 支持 proxyRefs
- [x] computed 的实现
- [x] watch 的实现

### runtime-core

- [x] 支持 element 类型
- [x] 支持 proxy
- [x] 初始化 props
- [x] 支持 component emit
- [x] 可以在 render 函数中获取 setup 返回的对象
- [x] setup 可获取 props 和 context
- [x] 支持 $el api
- [x] 支持最基础的 slots
- [x] 支持 Fragment
- [x] 支持 Text 类型节点
- [x] 支持 getCurrentInstance
- [x] 支持 provide/inject
- [x] 支持组件类型
- [x] nextTick 的实现

### compiler-core

- [x] 解析插值
- [x] 解析 element
- [x] 解析 text

### runtime-dom

- [x] 支持 custom renderer

基于 mini-vue 的实现，再阅读 vue3 源码我的[思考](https://github.com/qinran0423/vue3-source-study)
