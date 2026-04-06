import { Request, Response } from 'express';

import Mock from 'mockjs';

module.exports = {
  name: 'test-mock',
  desc: 'ts apis',
  apis: [
    {
      name: 'test-mock',
      desc: 'example',
      method: 'GET',
      url: '/test/mock',
      handle: (req: Request, res: Response) => {
        res.status(200);
        res.send(Mock.mock({
          'list|1-10': [{
            // 属性 id 是一个自增数，起始值为 1，每次增 1
            'id|+1': 1
          }]
        }));
      },
    }
  ]


};
