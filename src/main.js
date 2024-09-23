import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import App from './App.vue'
import router from './router'
import './assets/all.scss'

const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)
app.component('Loading', Loading);
app.mount('#app')
