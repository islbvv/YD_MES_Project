export default [
    {
        path: '/',
        name: 'dashboard',
        component: () => import('@/views/Dashboard.vue')
    },
    {
        path: '/ForwardingManagement',
        name: 'ForwardingManagement',
        component: () => import('@/views/release/ForwardingManagement.vue')
    },
    {
        path: '/ForwardingCheck',
        name: 'ForwardingCheck',
        component: () => import('@/views/release/ForwardingCheck.vue')
    }
];
