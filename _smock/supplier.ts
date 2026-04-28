import { Request, Response } from 'express';
const { createCRUD } = require('./_utils_/util');

import Mock from 'mockjs';

const list = Mock.mock({
  'list|15': [{
    'id|+1': 1,
    'supplier_code': /SUP-[A-Z]{2}[0-9]{5}/,
    'supplier_name': '@pick(["深圳华强电子", "东莞精密五金", "苏州新材料科技", "宁波海天塑机", "上海宝钢集团", "杭州中策橡胶", "青岛海尔配件", "佛山陶瓷建材", "无锡威孚精密", "天津钢管集团", "广州金发科技", "重庆长安零部件", "武汉光谷电子", "成都航天模塑", "厦门钨业股份"])',
    'supplier_status|1': ['合格', '待审核', '黑名单', '试用中'],
    'buyer': '@cname',
    'payment_terms|1': ['月结30天', '月结60天', '月结90天', '货到付款', '预付50%'],
    'payment_method|1': ['银行转账', '商业承兑汇票', '银行承兑汇票', '信用证'],
  }]
});

const supplierCRUD = createCRUD(list.list);

module.exports = {
  name: 'supplier-mock',
  desc: '供应商信息',
  apis: [
    {
      name: '列表',
      desc: '供应商列表',
      method: 'GET',
      url: '/rfq/supplier',
      handle: (req: Request, res: Response) => {
        res.status(200);
        res.send({ content: supplierCRUD.getList() });
      },
    },
    {
      name: '删除',
      desc: '供应商删除',
      method: 'DELETE',
      url: '/rfq/supplier',
      handle: (req: Request, res: Response) => {
        const { ids } = req.body;
        const delList = supplierCRUD.delete(ids.map((id: string) => parseInt(id)));
        res.status(200);
        res.send({ success: true, data: delList });
      },
    },
  ]
};
