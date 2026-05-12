import { Request, Response } from 'express';
const { createCRUD } = require('./_utils_/util');

import Mock from 'mockjs';

const list = Mock.mock({
  'list|15': [
    {
      'id|+1': 1,
      vendorCode: /VENDOR-[A-Z]{2}[0-9]{4}/,
      'vendorTypeName|1': [
        '生产供应商',
        '贸易供应商',
        '服务供应商',
        '物流供应商',
      ],
      'vendorStatus|1': ['启用', '禁用'],
      vendorErpCode: /SAP[0-9]{6}/,
      'isRegisterAudit|1': ['是', '否'],
      registerAuditRule: '',
      'isZiZhiAudit|1': ['是', '否'],
      ziZhiAuditRule: '',
      'isXieYi|1': ['是', '否'],
      'isXianChangAudit|1': ['是', '否'],
      'isXianChangAudit1|1': ['OA创建', '采购注册'],
      'isXianChangAudit2|1': ['已同步', '同步失败'],
    },
  ],
});

const supplierCRUD = createCRUD(list.list);

function normalizeSupplier(data = {}) {
  return {
    isRegisterAudit: '否',
    registerAuditRule: '',
    isZiZhiAudit: '否',
    ziZhiAuditRule: '',
    isXieYi: '否',
    isXianChangAudit: '否',
    ...data,
  };
}

module.exports = {
  name: 'supplier-mock',
  desc: '供应商信息',
  apis: [
    {
      name: '列表',
      desc: '供应商列表',
      method: 'GET',
      url: '/api/srm/supplier',
      handle: (req: Request, res: Response) => {
        res.status(200);
        res.send({ content: supplierCRUD.getList() });
      },
    },
    {
      name: '详情',
      desc: '供应商详情',
      method: 'GET',
      url: '/api/srm/supplier/:id',
      handle: (req: Request, res: Response) => {
        const { id } = req.params;
        const supplier = supplierCRUD.getById(parseInt(id, 10));

        if (supplier) {
          res.status(200);
          res.send({ content: [supplier] });
        } else {
          res.status(404);
          res.send({ success: false, message: '数据不存在' });
        }
      },
    },
    {
      name: '新增',
      desc: '供应商新增',
      method: 'POST',
      url: '/srm/supplier',
      handle: (req: Request, res: Response) => {
        const newItem = supplierCRUD.create(normalizeSupplier(req.body));
        res.status(200);
        res.send({ success: true, content: [newItem], data: newItem });
      },
    },
    {
      name: '修改',
      desc: '供应商修改',
      method: 'PUT',
      url: '/srm/supplier/:id',
      handle: (req: Request, res: Response) => {
        const { id } = req.params;
        const updated = supplierCRUD.update(parseInt(id, 10), req.body || {});

        if (updated) {
          res.status(200);
          res.send({ success: true, content: [updated], data: updated });
        } else {
          res.status(404);
          res.send({ success: false, message: '数据不存在' });
        }
      },
    },
    {
      name: '删除',
      desc: '供应商删除',
      method: 'DELETE',
      url: '/srm/supplier',
      handle: (req: Request, res: Response) => {
        const { ids } = req.body;
        const delList = supplierCRUD.delete(
          ids.map((id: string) => parseInt(id)),
        );
        res.status(200);
        res.send({ success: true, data: delList });
      },
    },
  ],
};
