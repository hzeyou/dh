import { Request, Response } from 'express';
const { createCRUD } = require('./_utils_/util');

import Mock from 'mockjs';

const list = Mock.mock({
  'list|20': [{
    // 属性 id 是一个自增数，起始值为 1，每次增 1
    'id|+1': 1,
    'rfq_number': /[1-9][0-9]{5}/,
    'pricing_number': /[1-9][0-9]{5}/,
    'company': '@cname',
    'business_type|1': [1, 2, 3],
    'rfq_title': '@ctitle(5,20)',
    'rfq_status|1': [1, 2, 3],
    'supplier_response_status|1': [1, 2, 3],
    'rfq_type|1': [1, 2, 3, 4],
  }]
});

const CRUD = createCRUD(list.list);


module.exports = {
  name: 'rfq-mock',
  desc: '询报价',
  apis: [
    {
      name: 'list',
      desc: '询报价列表',
      method: 'GET',
      url: '/rfq/list',
      handle: (req: Request, res: Response) => {
        res.status(200);
        res.send({ content: CRUD.getList() });
      },
    },
    {
      name: 'test-mock',
      desc: 'example',
      method: 'GET',
      url: '/test/mock1',
      handle: (req: Request, res: Response) => {
        res.status(200);
        res.send();
      },
    },
  ]


};
