import { Request, Response } from 'express';

module.exports = {
  name: 'cors-handler',
  desc: 'Handle all CORS preflight requests',
  apis: [
    {
      name: 'cors-preflight',
      desc: 'CORS preflight for all routes',
      method: 'OPTIONS',
      url: '/*',
      handle: (req: Request, res: Response) => {
        console.log('=== OPTIONS Request Received ===');
        console.log('URL:', req.url);
        console.log('Origin:', req.headers.origin);
        
        const origin = req.headers.origin || 'http://localhost:8000';
        
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, h-menu-id, h-tenant-id, h-request-id, access-token, sec-ch-ua, sec-ch-ua-mobile, sec-ch-ua-platform');
        
        console.log('Set CORS headers, origin:', origin);
        res.sendStatus(200);
      },
    }
  ]
};
