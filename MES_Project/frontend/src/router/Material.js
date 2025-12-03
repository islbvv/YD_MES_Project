export default [
    {
        path: '/',
        name: 'dashboard',
        component: () => import('@/views/Dashboard.vue')
    },
    {
        path: '/po',
        name: 'purchaseOrder',
        component: () => import('@/views/po/PurchaseOrder.vue')
    },
    {
        path: '/poList',
        name: 'purchaseOrderList',
        component: () => import('@/views/po/PurchaseOrderList.vue')
    }
];
