
import { h, ref } from '../../lib/mick-vue.esm.js'

window.self = null
export const App = {
  name: "App",
  setup() {
    const count = ref(0);

    const onClick = () => {
      console.log('sss');
      count.value++;
    };

    return {
      count,
      onClick,
    };
  },
  render() {
    window.self = this
    console.log(this.count);
    return h(
      "div",
      {
        id: "root",
      },
      [
        h("div", {}, "count:" + this.count), // 依赖收集
        h(
          "button",
          {
            onClick: this.onClick,
          },
          "click"
        ),
      ]
    );
  },
};