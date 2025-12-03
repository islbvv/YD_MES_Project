export default [
    {
        path: '/',
        name: 'dashboard',
        component: () => import('@/views/Dashboard.vue')
    },
    {
        path: '/order/list',
        name: 'OrderList',
        component: () => import('@/views/order/OrderList.vue')
    },
    {
        path: '/order/management',
        name: 'OrderManagement',
        component: () => import('@/views/order/OrderManagement.vue')
    }
];
