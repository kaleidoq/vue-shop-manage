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
            },
            {
                path: '/rights',
                name: 'rights',
                component: () =>
                    import ('../views/power/Rights.vue'),
            },
            {
                path: '/roles',
                name: 'roles',
                component: () =>
                    import ('../views/power/Roles.vue'),
            },
            {
                path: '/categories',
                name: 'categories',
                component: () =>
                    import ('../views/goods/Cate.vue'),
            },
            {
                path: '/params',
                name: 'params',
                component: () =>
                    import ('../views/goods/Params.vue'),
            },
            {
                path: '/goods',
                name: 'goods',
                component: () =>
                    import ('../views/goods/List.vue'),
            },
            {
                path: '/goods/addGoods',
                name: 'goods/addGoods',
                component: () =>
                    import ('../views/goods/Add.vue'),
            },
            {
                path: '/orders',
                name: 'orders',
                component: () =>
                    import ('../views/orders/Order.vue'),
            },
            {
                path: '/reports',
                name: 'reports',
                component: () =>
                    import ('../views/report/Reports.vue'),
            },
        ]
    },
    {
        path: '/home',
        name: 'home',
        component: () =>
            import ('../views/Home.vue'),

    },
    {
        // ????????????
        path: '/login',
        name: 'login',
        component: () =>
            import ('../views/Login.vue')
    }
]

const router = new VueRouter({
    routes
})

// ????????????
router.beforeEach((to, from, next) => {
    // ???????????????????????????
    if (to.path === '/login') return next()
    const token = sessionStorage.getItem('token')
        // ??????????????????token????????????????????????
    if (!token) return next('/login')
    next()
})

// ??????????????????????????????????????????????????????
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
const originalReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace(location) {
    return originalReplace.call(this, location).catch(err => err)
}

export default router