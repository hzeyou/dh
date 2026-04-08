import { extendParentConfig } from '@hzerojs/plugin-micro';

export default extendParentConfig({
  webpack5: {},
  fastRefresh: {},
  define: {
    'process.env': {
      // 这里修改成网关服务器后端地址
      SRM_DEV_HOST: '',
    },
  },
  routes: [
    {
      path: '/srm/supplier', // 供应商
      component: './Supplier',
      authorized: true,
    },
    {
      path: '/public/demo', // 供应商
      component: './Demo/Public',
      authorized: true,
      priority: 1,
    },
    {
      path: '/srm/purchase-order', // 供应商
      routes: [
        {
          path: '/srm/purchase-order/list',
          component: './PurchaseOrder/List',
          authorized: true,
        },
        {
          path: '/srm/purchase-order/detail/:purchaseId',
          component: './PurchaseOrder/Detail',
        },
      ],
    },
    {
      path: '/srm/demo', // 供应商
      routes: [
        {
          path: '/srm/demo/page',
          component: './Demo/Page',
          authorized: true,
        },
        {
          path: '/srm/demo/list',
          component: './Demo/Index',
          authorized: true,
        },
        {
          path: '/srm/demo/detail/:id?',
          component: './Demo/Detail',
          authorized: true,
        },
        {
          path: '/srm/demo/tree',
          component: './Demo/Tree',
          authorized: true,
        },
        {
          path: '/srm/demo/select',
          component: './Demo/Select',
          authorized: true,
        },
        {
          path: '/srm/demo/lov',
          component: './Demo/Lov',
          authorized: true,
        },
      ],
    },
  ],
  hash: true,
  hzeroMicro: {
    microConfig: {
      registerRegex: '\\/.*',
    },
  },
});
