import { Request, Response } from 'express';
const { setCorsHeaders } = require('./_utils/cors');

module.exports = {
  name: 'ts-demo',
  desc: 'ts apis',
  apis: [
    {
      name: 'ts-demo options',
      desc: 'CORS preflight',
      method: 'OPTIONS',
      url: '/demo',
      handle: (req: Request, res: Response) => {
        setCorsHeaders(req, res);
        res.sendStatus(200);
      },
    },
    {
      name: 'ts-demo one',
      desc: 'example',
      method: 'GET',
      url: '/demo',
      options: {
        cors: {
          origin: 'http://localhost:8000',
          credentials: true
        }
      },
      handle: (req: Request, res: Response) => {
        setCorsHeaders(req, res);
        res.status(200);
        res.send([
          {name: '宋江', age: 68, email: '88@qq.com', id: 1},
          {name: '张飞', age: 60, email: '33@qq.com', id: 2},
          {name: '小明', age: 25, email: '22@qq.com', id: 3},
          {name: '小红', age: 88, email: '11@qq.com', id: 4},
        ]);
      },
    }
  ]


};
