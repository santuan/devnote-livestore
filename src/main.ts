import { createApp } from 'vue'

import App from './App.vue'
import { i18n } from './i18n'
import './assets/main.css'
import './assets/tiptap.css'
import 'katex/dist/katex.min.css'

const app = createApp(App)
app.use(i18n)
app.mount('#app')
