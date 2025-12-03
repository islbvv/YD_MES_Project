export default [
    {
        path: '/',
        name: 'dashboard',
        component: () => import('@/views/Dashboard.vue')
    },
    {
        path: '/work',
        name: 'work',
        component: () => import('@/views/Production/Productionwork.vue')
    }
];
