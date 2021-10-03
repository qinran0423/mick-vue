
import { h } from '../../lib/mick-vue.esm.js'
export const App = {
  render() {
    return h('div', 'hi,' + this.msg)
  },
  setup() {
    return {
      msg: 'mick-vue3'
    }
  }
}