/**
 * 设置 CORS 响应头
 */
function setCorsHeaders(req, res) {
  console.log('=== CORS Headers Being Set ===');
  console.log('Origin from request:', req.headers.origin);
  
  const origin = req.headers.origin || 'http://localhost:8000';
  
  // 移除可能已存在的 CORS 头
  res.removeHeader('Access-Control-Allow-Origin');
  res.removeHeader('Access-Control-Allow-Credentials');
  res.removeHeader('Access-Control-Allow-Methods');
  res.removeHeader('Access-Control-Allow-Headers');
  
  // 设置新的 CORS 头
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, h-menu-id, h-tenant-id, h-request-id, access-token');
  
  console.log('Set Access-Control-Allow-Origin to:', origin);
}

module.exports = { setCorsHeaders };
