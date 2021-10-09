
import { h } from '../../lib/mick-vue.esm.js'

window.self = null
export const App = {
  render() {
    window.self = this
    return h('div', {
      id: 'root',
      class: ['red', 'hard']
    },
      // this.$el => 返回 root element
      "hi," + this.msg
      // [h('p', { class: 'red' }, 'hi'), h('p', { class: 'blue' }, 'mick-vue')]
    )
  },
  setup() {
    return {
      msg: 'mick-vue3-hahh'
    }
  }
}