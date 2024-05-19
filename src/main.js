import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import axios from 'axios'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/assets/iconfont'
import { createPinia } from "pinia";

axios.defaults.baseURL = 'http://localhost:8081'

const app = createApp(App)

app.use(router).use(createPinia()).mount('#app')
