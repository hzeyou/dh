import { Request, Response } from 'express';


const list = [
  {name: '宋江', age: 68, email: '88@qq.com', id: 1},
  {name: '张飞', age: 60, email: '33@qq.com', id: 2},
  {name: '小明', age: 25, email: '22@qq.com', id: 3},
  {name: '小红', age: 88, email: '11@qq.com', id: 4},
];

let id = 5;

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
        res.send({ content: list });
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
        res.send({ content: [list.find(v => v.id == id)] } );
      },
    },
    {
      name: '新增',
      desc: 'example',
      method: 'POST',
      url: '/demo',
      handle: (req: Request, res: Response) => {
        const body = req.body;
        list.push({
          ...body,
          id: id++,
        });
        res.status(200);
        res.send({ content: [body] } );
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

          const index = list.findIndex(d => d.id === parseInt(id));

          if (index !== -1) {
            list[index] = {
              ...list[index],
              ...body,
              id: parseInt(id),
              updatedAt: new Date().toISOString()
            };
            res.status(200);
            res.send({success: true, data: list[index]});
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
        console.log('ids==', ids);
        const delList = [];
        ids.forEach((id) => {
          const index = list.findIndex(d => d.id === parseInt(id));
          if (index !== -1) {
            Array.prototype.push.call(delList, ...list.splice(index, 1));
          }
        });
        console.log('delList==', delList);
        res.status(200);
        res.send({success: true, data: delList} );
      },
    },
  ]


};
