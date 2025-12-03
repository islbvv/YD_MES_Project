export default [
    {
        path: '/madeinfo/process',
        name: 'processFlow',
        component: () => import('@/views/ProcessFlow.vue')
    },
    {
        path: '/example',
        name: 'example',
        component: () => import('@/views/sam.vue')
    }
];
