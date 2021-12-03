import { createApp } from '../../lib/mick-vue.esm.js'

import { App } from './app.js'

const rootContainer = document.querySelector('#app')

createApp(App).mount(rootContainer)