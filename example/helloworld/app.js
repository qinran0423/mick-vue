
import { h } from '../../lib/mick-vue.esm.js'
export const App = {
  render() {
    return h('div', {
      id: 'root',
      class: ['red', 'hard']
    },
      [h('p', { class: 'red' }, 'hi'), h('p', { class: 'blue' }, 'mick-vue')]
    )
  },
  setup() {
    return {
      msg: 'mick-vue3'
    }
  }
}