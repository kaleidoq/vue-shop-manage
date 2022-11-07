import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';

// 导入自定义主题颜色
import '@/assets/css/theme/index.css'

// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入axios
import axios from 'axios'
// 全局样式
import "@/assets/css/global.less"
// 导入tree-grid
import treeTable from 'vue-table-with-tree-grid'

Vue.use(ElementUI);
Vue.config.productionTip = false

// 挂载axios
Vue.prototype.$axios = axios
    // 设置axios的基本路径
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
    // 添加请求拦截器
axios.interceptors.request.use(function(config) {
    // 在发送请求之前做些什么
    const token = sessionStorage.getItem('token')
    config.headers.Authorization = token
        // console.log(config)
    return config;
});

Vue.component('tree-table', treeTable)

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')