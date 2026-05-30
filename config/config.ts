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
      path: '/public/demo', // 供应商
      component: './Demo/Public',
      authorized: true,
      priority: 1,
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

    {
      path: '/srm/purchase-order/list',
      component: './PurchaseOrder/List',
      authorized: true,
    },

    {
      path: '/srm/purchase-order/detail/:purchaseId',
      component: './PurchaseOrder/Detail',
    },


    /** 供应商 start */
    {
      path: '/srm/supplier/list', // 采购端
      component: './Supplier',
      authorized: true,
    },
    {
      path: '/srm/supplier/detail/:id', // 采购端
      component: './Supplier/Detail',
      authorized: true,
    },
    /** 供应商 end */

    /** 供应商注册 start */
    {
      path: '/srm/supplier-register/list', // 采购端
      component: './SupplierRegister',
      authorized: true,
    },
    /** 供应商注册 end */

    /** 供应商业务变更 start */
    {
      path: '/srm/supplier-business-change/list', // 采购端
      component: './SupplierBusinessChange',
      authorized: true,
    },
    {
      path: '/srm/supplier-business-change/:type/:id?', // 采购端
      component: './SupplierBusinessChange/Detail',
      authorized: true,
    },
    /** 供应商业务变更 end */


    /** 供应商变更 start */
    {
      path: '/srm/supplier-change/list', // 采购端
      component: './SupplierChange',
      authorized: true,
    },
    {
      path: '/srm/supplier-change/detail/:id', // 采购端
      component: './SupplierChange/Detail',
      authorized: true,
    },
    /** 供应商变更 end */


    /** 准入及品类扩充 start */
    {
      path: '/srm/supplier-admission/list', // 采购端
      component: './SupplierAdmission',
      authorized: true,
    },
    {
      path: '/srm/supplier-admission/detail/:type/:id?', // 采购端
      component: './SupplierAdmission/Detail',
      authorized: true,
    },
    /** 准入及品类扩充 end */

    /** 供应商类型 start */
    {
      path: '/srm/supplier-type/list',
      component: './SupplierType',
      authorized: true,
    },
    /** 供应商类型 end */



    /** 询报价 start */
    {
      path: '/srm/rfq/list', // 采购端
      component: './RFQ/List',
      authorized: true,
    },
    {
      path: '/srm/rfq/detail', // 采购端
      component: './RFQ/Detail',
      authorized: true,
    },
    /** 询报价 end */


    /** 品类管理 start */
    {
      path: '/srm/category-manage/list',
      component: './CategoryManage',
      authorized: true,
    },
    /** 品类管理 end */

    //
    // {
    //   path: '/srm/business-object/field/create',
    //   component: './BusinessObject/Detail',
    //   authorized: true,
    // },

  ],
  hash: true,
  hzeroMicro: {
    microConfig: {
      registerRegex: '\\/.*',
    },
  },
});
