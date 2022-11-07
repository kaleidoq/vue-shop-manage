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
        children: [{
            path: '/users',
            name: 'users',
            component: () =>
                import ('../views/user/Users.vue'),
        }, {
            path: '/rights',
            name: 'rights',
            component: () =>
                import ('../views/power/Rights.vue'),
        }, {
            path: '/roles',
            name: 'roles',
            component: () =>
                import ('../views/power/Roles.vue'),
        }, {
            path: '/categories',
            name: 'categories',
            component: () =>
                import ('../views/goods/Cate.vue'),
        }, ]
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

// 重写这两个方法解决重复路由导向的问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
const originalReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace(location) {
    return originalReplace.call(this, location).catch(err => err)
}

export default router