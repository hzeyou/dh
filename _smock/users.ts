import { Request, Response } from 'express';
const { createCRUD } = require('./_utils_/util');


const list = [
  {name: '宋江', age: 68, email: '88@qq.com', id: 1},
  {name: '张飞', age: 60, email: '33@qq.com', id: 2},
  {name: '小明', age: 25, email: '22@qq.com', id: 3},
  {name: '小红', age: 88, email: '11@qq.com', id: 4},
];

const userCRUD = createCRUD(list);

module.exports = {
  name: '例子',
  desc: 'ts apis',
  apis: [
    {
      name: '列表',
      desc: 'example',
      method: 'GET',
      url: '/demo',
      handle: (req: Request, res: Response) => {
        res.status(200);
        res.send({ content: userCRUD.getList() });
      },
    },
    {
      name: '详情',
      desc: 'example',
      method: 'GET',
      url: '/demo/:id',
      handle: (req: Request, res: Response) => {
        const { id } = req.params;
        res.status(200);
        res.send({ content: [userCRUD.getById(parseInt(id))] } );
      },
    },
    {
      name: '新增',
      desc: 'example',
      method: 'POST',
      url: '/demo',
      handle: (req: Request, res: Response) => {
        const body = req.body;
        const newItem = userCRUD.create(body);
        res.status(200);
        res.send({ content: [newItem] } );
      },
    },
    {
      name: '修改',
      desc: 'example',
      method: 'PUT',
      url: '/demo/:id',
      handle: (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id) {
          res.status(400);
          res.send({success: false, message: '缺少 ID 参数'});
          return;
        }

        try {
          const body = req.body;
          const updated = userCRUD.update(parseInt(id), body);

          if (updated) {
            res.status(200);
            res.send({success: true, data: updated});
          } else {
            res.status(404);
            res.send({success: false, message: '数据不存在'});
          }
        } catch (e) {
          console.error(e);
          res.status(400);
          res.send({success: false, message: '请求数据格式错误'});
        }
      },
    },
    {
      name: '删除',
      desc: 'example',
      method: 'DELETE',
      url: '/demo',
      handle: (req: Request, res: Response) => {
        const { ids } = req.body;
        const delList = userCRUD.delete(ids.map((id: string) => parseInt(id)));
        res.status(200);
        res.send({success: true, data: delList} );
      },
    },
  ]


};
