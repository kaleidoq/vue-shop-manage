import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        redirect: '/main'
    },
    {
        path: '/main',
        name: 'main',
        component: () =>
            import ('../views/Main.vue'),
    },
    {
        path: '/home',
        name: 'home',
        component: () =>
            import ('../views/Home.vue'),
    },
    {
        // 登录页面
        path: '/login',
        name: 'login',
        component: () =>
            import ('../views/Login.vue')
    }
]

const router = new VueRouter({
    routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
    // 如果去登录页，放行
    if (to.path === '/login') return next()
    const token = sessionStorage.getItem('token')
        // 查看是否存在token，不存在就跳登录
    if (!token) return next('/login')
    next()
})

export default router