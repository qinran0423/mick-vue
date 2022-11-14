
import { h } from '../../dist/mick-vue.esm.js'
import { Foo } from './Foo.js'

window.self = null
export const App = {
  name: 'App',
  render() {
    window.self = this
    return h('div', {
      id: 'root',
      class: ['red', 'hard'],
      onClick() {
        console.log('click');
      }
    },
      [h('div', {}, "hi," + this.msg), h(Foo, {
        count: 1
      })]
      // this.$el => 返回 root element
      // "hi," + this.msg
      // [h('p', { class: 'red' }, 'hi'), h('p', { class: 'blue' }, 'mick-vue')]
    )
  },
  setup() {
    return {
      msg: 'mick-vue3-hahh'
    }
  }
}