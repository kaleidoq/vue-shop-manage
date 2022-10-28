import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入axios
import axios from 'axios'
// 全局样式
import "@/assets/css/global.less"

import './plugins/element.js'

Vue.config.productionTip = false

// 挂载axios
Vue.prototype.$axios = axios
    // 设置axios的基本路径
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')