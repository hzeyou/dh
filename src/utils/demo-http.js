const http = require('http');
const url = require('url');

// 内存数据存储
let demoData = [
  {title: '标题1', content: '内容1', id: 1},
  {title: '标题2', content: '内容2', id: 2},
  {title: '标题3', content: '内容3', id: 3},
  {title: '标题4', content: '内容4', id: 4},
];
let idCounter = 1;

// 解析请求体
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

// 发送 JSON 响应
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

// 路由处理器
const handlers = {
  // 获取所有数据或单个数据
  GET: (req, res, pathname, query) => {
    const id = pathname.split('/')[2];

    if (id) {
      const item = demoData.find(d => d.id === parseInt(id));
      if (item) {
        sendJSON(res, 200, [item]);
      } else {
        sendJSON(res, 404, { success: false, message: '数据不存在' });
      }
    } else {
      // 支持 ?ids[]=1&ids[]=2 批量查询
      const idsParam = query['ids[]'];
      if (idsParam) {
        const ids = Array.isArray(idsParam) ? idsParam : [idsParam];
        const items = demoData.filter(d => ids.includes(String(d.id)));
        sendJSON(res, 200, items);
      } else {
        sendJSON(res, 200, demoData);
      }
    }
  },

  // 创建新数据
  POST: async (req, res) => {
    try {
      const body = await parseBody(req);
      const newItem = {
        id: idCounter++,
        ...body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      demoData.push(newItem);
      sendJSON(res, 201, { success: true, data: newItem });
    } catch (e) {
      sendJSON(res, 400, { success: false, message: '请求数据格式错误' });
    }
  },

  // 更新数据
  PUT: async (req, res, pathname) => {
    const id = pathname.split('/')[2];

    if (!id) {
      sendJSON(res, 400, { success: false, message: '缺少 ID 参数' });
      return;
    }

    try {
      const body = await parseBody(req);
      const index = demoData.findIndex(d => d.id === parseInt(id));

      if (index !== -1) {
        demoData[index] = {
          ...demoData[index],
          ...body,
          id: parseInt(id),
          updatedAt: new Date().toISOString()
        };
        sendJSON(res, 200, { success: true, data: demoData[index] });
      } else {
        sendJSON(res, 404, { success: false, message: '数据不存在' });
      }
    } catch (e) {
      sendJSON(res, 400, { success: false, message: '请求数据格式错误' });
    }
  },

  // 删除数据
  DELETE: (req, res, pathname, query) => {
    const id = pathname.split('/')[2];

    // 支持 ?ids[]=1&ids[]=2 批量删除
    const idsParam = query['ids[]'];
    if (idsParam) {
      const ids = Array.isArray(idsParam) ? idsParam : [idsParam];
      const deleted = [];

      ids.forEach(idStr => {
        const index = demoData.findIndex(d => d.id === parseInt(idStr));
        if (index !== -1) {
          deleted.push(demoData.splice(index, 1)[0]);
        }
      });

      if (deleted.length > 0) {
        sendJSON(res, 200, { success: true, data: deleted, count: deleted.length });
      } else {
        sendJSON(res, 404, { success: false, message: '未找到要删除的数据' });
      }
      return;
    }

    if (!id) {
      sendJSON(res, 400, { success: false, message: '缺少 ID 参数' });
      return;
    }

    const index = demoData.findIndex(d => d.id === parseInt(id));

    if (index !== -1) {
      const deleted = demoData.splice(index, 1)[0];
      sendJSON(res, 200, { success: true, data: deleted });
    } else {
      sendJSON(res, 404, { success: false, message: '数据不存在' });
    }
  }
};

// 创建服务器
function createServer(port = 3000) {
  const server = http.createServer((req, res) => {
    // 设置 CORS - 支持带凭证的请求
    const origin = req.headers.origin || 'http://localhost:8000';
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, h-menu-id, h-tenant-id, h-request-id, access-token');

    // 处理 OPTIONS 预检请求
    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    // 只处理 /demo 路径
    if (!pathname.startsWith('/demo')) {
      sendJSON(res, 404, { success: false, message: '路径不存在' });
      return;
    }

    const handler = handlers[req.method];

    if (handler) {
      handler(req, res, pathname, query);
    } else {
      sendJSON(res, 405, { success: false, message: '方法不支持' });
    }
  });

  server.listen(port, () => {
    console.log(`Demo HTTP 服务器运行在 http://localhost:${port}`);
    console.log('支持的接口:');
    console.log('  GET    /demo      - 获取所有数据');
    console.log('  GET    /demo/:id  - 获取单个数据');
    console.log('  POST   /demo      - 创建新数据');
    console.log('  PUT    /demo/:id  - 更新数据');
    console.log('  DELETE /demo/:id  - 删除数据');
  });

  return server;
}

// 如果直接运行此文件，启动服务器
if (require.main === module) {
  createServer(8088);
}

module.exports = { createServer };
