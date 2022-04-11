

import { ref } from "../../lib/mick-vue.esm.js";

export const App = {
  name: "App",
  template: `<div>hi,{{count}}</div>`,
  setup() {
    const count = window.count = ref(1)

    return {
      count
    };
  },
};