const productionRouter = [
    {
<<<<<<< HEAD
        path: '/',
        name: 'dashboard',
        component: () => import('@/views/uikit/ChartDoc.vue')
=======
        path: '/production',
        children: [
            {
                path: 'productionplan',
                name: 'productionPlan',
                component: () => import('@/views/production/productionPlan.vue')
            },
            {
                path: 'productionplandetail',
                name: 'productionPlanDetail',
                component: () => import('@/views/production/productionPlanDetail.vue')
            }
        ]
>>>>>>> 47f92ed80f3da1a8c97293394ec92fe4d379ff2a
    }
];

export default productionRouter;
