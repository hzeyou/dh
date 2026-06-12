import { Request, Response } from 'express';


let list1 = [
  {
    label: '姓名',
    name: 'name',
    type: 'string',
  },
  {
    label: '年龄',
    name: 'age',
    type: 'number',
    max: 100,
    step: 1
  },
];

let list2 = [
  {
    name: 'level',
    type: 'string',
    label: '供应商级别',
    lookupCode: 'SRM.SUPPLIER_LEVEL',
  },
  {
    name: 'supplierCode',
    type: 'object',
    label: '供应商编码',
    lovCode: 'SRM.SUPPLIER_LIST',
    textField: 'supplierName',
    valueField: 'supplierCode',
  },
]

module.exports = {
  name: 'dynamic-mock',
  desc: '询报价',
  apis: [
    {
      name: 'list',
      desc: '询报价列表',
      method: 'GET',
      url: '/dynamic/:id?',
      handle: (req: Request, res: Response) => {
        const { id } = req.params;
        res.status(200);
        let list = list1;
        if (Number(id) === 2) {
          list = list2;
        }
        res.send({ list: list });
      },
    },
    {
      name: 'list',
      desc: '询报价列表',
      method: 'GET',
      url: '/dynamic-head/:id?',
      handle: (req: Request, res: Response) => {
        const { id } = req.params;
        res.status(200);
        let list = list1;
        if (Number(id) === 2) {
          list = list2;
        }
        res.send({ list: list });
      },
    },
  ]


};
