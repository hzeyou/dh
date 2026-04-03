import { Request, Response } from 'express';

/**
 * 设置 CORS 响应头
 */
export function setCorsHeaders(req: Request, res: Response) {
  const origin = req.headers.origin || 'http://localhost:8000';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, h-menu-id, h-tenant-id, h-request-id, access-token');
}
