
import { h, ref, getCurrentInstance, nextTick } from '../../lib/mick-vue.esm.js'

window.self = null
export const App = {
  name: 'App',
  setup() {
    const count = ref(1)
    const instance = getCurrentInstance()
    function onClick() {
      for (let i = 0; i < 100; i++) {
        console.log('update');
        count.value = i
      }

      nextTick(() => {
        console.log(instance);
      });

      console.log(instance);
    }

    return {
      onClick,
      count
    }
  },
  render() {
    const button = h('button', { onClick: this.onClick }, 'update')
    const p = h('p', {}, 'count:' + this.count)

    return h('div', {}, [button, p])
  },
}