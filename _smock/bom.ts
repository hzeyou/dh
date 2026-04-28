import { Request, Response } from 'express';
const { createCRUD } = require('./_utils_/util');

import Mock from 'mockjs';

const list = Mock.mock({
  'list|10': [{
    'id|+1': 1,
    'material_code': /MAT-[A-Z]{2}[0-9]{6}/,
    'material_name': '@pick(["铜管", "铝板", "不锈钢螺栓", "碳钢法兰", "橡胶密封圈", "聚乙烯管材", "镀锌钢板", "陶瓷轴承", "硅胶垫片", "钛合金棒"])',
    'spec_description': '@pick(["品牌A / Φ25×2.0mm / DN20", "品牌B / 1200×2400×3mm / 304", "品牌C / M12×50 / 8.8级", "品牌D / DN100 PN16 / Q235B", "品牌E / Φ50×30×5mm / NBR", "品牌F / Φ110×4.0mm / PE100"])',
    'pricing_unit|1': ['个', '件', '米', '千克', '吨', '套', '片', '根'],
    'demand_quantity|100-9999': 1,
    'cost_structure': '@pick(["原材料+加工费+运费", "原材料+人工+管理费", "材料费+制造费+利润"])',
    'cost_structure_total|1000-99999.2': 1,
    'bom_version': /V[1-9]\.[0-9]/,
    'bom_quotation|50-5000.2': 1,
    'bom_total_price|5000-500000.2': 1,
    'inquiry_remark': '@cparagraph(1)',
    'inquiry_attachment': '@pick(["报价单.xlsx", "技术规格书.pdf", "图纸.dwg", "质检报告.pdf", ""])',
    'latest_quotation|100-9999.2': 1,
    'lowest_historical_quotation|80-8000.2': 1,
  }]
});

const bomCRUD = createCRUD(list.list);

module.exports = {
  name: 'bom-mock',
  desc: 'BOM物料清单',
  apis: [
    {
      name: '列表',
      desc: 'BOM列表',
      method: 'GET',
      url: '/rfq/bom',
      handle: (req: Request, res: Response) => {
        res.status(200);
        res.send({ content: bomCRUD.getList() });
      },
    },
    {
      name: '详情',
      desc: 'BOM详情',
      method: 'GET',
      url: '/rfq/bom/:id',
      handle: (req: Request, res: Response) => {
        const { id } = req.params;
        res.status(200);
        res.send({ content: [bomCRUD.getById(parseInt(id))] });
      },
    },
    {
      name: '新增',
      desc: 'BOM新增',
      method: 'POST',
      url: '/rfq/bom',
      handle: (req: Request, res: Response) => {
        const body = req.body;
        const newItem = bomCRUD.create(body);
        res.status(200);
        res.send({ content: [newItem] });
      },
    },
    {
      name: '修改',
      desc: 'BOM修改',
      method: 'PUT',
      url: '/rfq/bom/:id',
      handle: (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) {
          res.status(400);
          res.send({ success: false, message: '缺少 ID 参数' });
          return;
        }
        try {
          const body = req.body;
          const updated = bomCRUD.update(parseInt(id), body);
          if (updated) {
            res.status(200);
            res.send({ success: true, data: updated });
          } else {
            res.status(404);
            res.send({ success: false, message: '数据不存在' });
          }
        } catch (e) {
          console.error(e);
          res.status(400);
          res.send({ success: false, message: '请求数据格式错误' });
        }
      },
    },
    {
      name: '删除',
      desc: 'BOM删除',
      method: 'DELETE',
      url: '/demo',
      handle: (req: Request, res: Response) => {
        const { ids } = req.body;
        const delList = bomCRUD.delete(ids.map((id: string) => parseInt(id)));
        res.status(200);
        res.send({ success: true, data: delList });
      },
    },
  ]
};
