import { createApp } from '../../lib/mick-vue.esm.js'

import { App } from './App.js'

const rootContainer = document.querySelector('#app')

createApp(App).mount(rootContainer)