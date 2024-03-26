import { unAuthorized } from '@/api';
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'Welcome',
            component: () => import('@/views/WelcomeView.vue'),
            children: [
                {
                    path: '',
                    name: 'welcome-login',
                    component: () => import('@/views/welcome/LoginPage.vue')
                },{
                    path: '/register',
                    name: 'welcome-register',
                    component: () => import('@/views/welcome/RegisterPage.vue')
                }
            ]
        }, {
            path: '/index',
            name: 'index',
            component: () => import('@/views/IndexView.vue'),
        }
    ]
})

// router.beforeEach((to, from, next) => {
//     const isUnauthorized = unAuthorized()
//     if (isUnauthorized && to.name !== 'welcome-login') {
//         next({ name: 'welcome-login' })
//     } else if (!isUnauthorized && to.name === 'welcome-login') {
//         next({ name: 'index' })
//     } else {
//         next()
//     }
// })

export default router