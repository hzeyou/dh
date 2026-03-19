const http = require('http');
const url = require('url');

// 内存数据存储
let demoData = [
  {name: '宋江', age: 68, email: '88@qq.com', id: 1},
  {name: '张飞', age: 60, email: '33@qq.com', id: 2},
  {name: '小明', age: 25, email: '22@qq.com', id: 3},
  {name: '小红', age: 88, email: '11@qq.com', id: 4},
];
let idCounter = 1;

const lovDefineTemple = {
  "viewCode": "SCM.SUPPLIER",
  "viewName": "供应商",
  "multiViewName": {
    "en_US": "供应商",
    "zh_CN": "供应商",
    "ja_JP": "供应商"
  },
  "lovCode": "SCM.SUPPLIER",
  "lovName": "供应商",
  "multiLovName": {
    "en_US": "供应商",
    "zh_CN": "供应商",
    "ja_JP": "供应商"
  },
  "lovTypeCode": "URL",
  "tenantId": 0,
  "valueField": "supplierId",
  "displayField": "supplierName",
  "pageSize": 10,
  "delayLoadFlag": 0,
  "queryUrl": "/hscm/v1/{tenantId}/suppliers",
  "queryFields": [
    {
      "field": "supplierCode",
      "label": "供应商编码",
      "dataType": "TEXT",
      "sourceCode": null
    },
    {
      "field": "supplierName",
      "label": "供应商名称",
      "dataType": "TEXT",
      "sourceCode": null
    },
    {
      "field": "supplierShortName",
      "label": "供应商简称",
      "dataType": "TEXT",
      "sourceCode": null
    },
    {
      "field": "enabledFlag",
      "label": "有效",
      "dataType": "SELECT",
      "sourceCode": "HPFM.FLAG"
    }
  ],
  "tableFields": [
    {
      "title": "供应商编码",
      "dataIndex": "supplierCode",
      "width": 100,
      "dataType": "TEXT"
    },
    {
      "title": "供应商名称",
      "dataIndex": "supplierName",
      "width": 140,
      "dataType": "TEXT"
    },
    {
      "title": "供应商简称",
      "dataIndex": "supplierShortName",
      "width": 100,
      "dataType": "TEXT"
    },
    {
      "title": "供应商类型",
      "dataIndex": "supplierTypeMeaning",
      "width": 100,
      "dataType": null
    },
    {
      "title": "供应商级别",
      "dataIndex": "supplierLevel",
      "width": 100,
      "dataType": null
    },
    {
      "title": "有效",
      "dataIndex": "enabledFlagMeaning",
      "width": 50,
      "dataType": null
    }
  ],
  "requestMethod": "GET",
  "topList": [],
  "mustPageFlag": 1
};

const dataSetLovTemple = {
  "totalPages": 2,
  "totalElements": 18,
  "numberOfElements": 10,
  "size": 10,
  "number": 0,
  "content": [
    {
      "creationDate": "2025-09-25 10:55:20",
      "createdBy": 1,
      "lastUpdateDate": "2025-09-25 10:55:20",
      "lastUpdatedBy": 1,
      "objectVersionNumber": 1,
      "_token": "sC9iSordwYtLKByXkl+NYm6saTILMKWlChN8/9qPn33RZyuAyPrCfYUEWIVlSAfZi8g8qyR/6hBkj9n3y0kuB+0cVYePs0FAW2eRJJWIPuc=",
      "tenantId": "6",
      "supplierId": "754020897190981641",
      "supplierCode": "797885",
      "supplierType": "BK01",
      "supplierLevel": "代工厂,一级供应商",
      "supplierName": "麦丰（佛山）药业有限公司",
      "supplierShortName": "麦丰",
      "unifiedSocialCode": "91440604MADFC9K28N",
      "enabledFlag": 1,
      "supplierTypeMeaning": "生产",
      "enabledFlagMeaning": "是",
      "createdByName": "匿名用户",
      "lastUpdatedByName": "匿名用户"
    },
    {
      "creationDate": "2025-09-25 10:55:20",
      "createdBy": 1,
      "lastUpdateDate": "2025-09-25 10:55:20",
      "lastUpdatedBy": 1,
      "objectVersionNumber": 1,
      "_token": "sC9iSordwYtLKByXkl+NYm6saTILMKWlChN8/9qPn33RZyuAyPrCfYUEWIVlSAfZYbrQuozxKXGhk9Nw3axJwuKohzj4Uy8aXmDRQy0mLPQ=",
      "tenantId": "6",
      "supplierId": "759005108890865670",
      "supplierCode": "100073",
      "supplierType": "BK01",
      "supplierLevel": "代工厂,一级供应商",
      "supplierName": "广东蜂窝工场电子科技有限公司",
      "supplierShortName": "蜂窝",
      "unifiedSocialCode": "91441900MA52XAX641",
      "enabledFlag": 1,
      "supplierTypeMeaning": "生产",
      "enabledFlagMeaning": "是",
      "createdByName": "匿名用户",
      "lastUpdatedByName": "匿名用户"
    },
    {
      "creationDate": "2025-09-25 10:55:20",
      "createdBy": 1,
      "lastUpdateDate": "2025-09-25 10:55:20",
      "lastUpdatedBy": 1,
      "objectVersionNumber": 1,
      "_token": "sC9iSordwYtLKByXkl+NYm6saTILMKWlChN8/9qPn33RZyuAyPrCfYUEWIVlSAfZi8g8qyR/6hBkj9n3y0kuB87reT/nwbpGsRNLrkO624o=",
      "tenantId": "6",
      "supplierId": "754020897190981648",
      "supplierCode": "785758",
      "supplierType": "BK01",
      "supplierLevel": "代工厂,一级供应商",
      "supplierName": "深圳市椰子生物科技有限公司",
      "supplierShortName": "椰子",
      "unifiedSocialCode": "91440300MA5GDKGM81",
      "enabledFlag": 1,
      "supplierTypeMeaning": "生产",
      "enabledFlagMeaning": "是",
      "createdByName": "匿名用户",
      "lastUpdatedByName": "匿名用户"
    },
    {
      "creationDate": "2025-09-25 10:55:20",
      "createdBy": 1,
      "lastUpdateDate": "2025-09-25 10:55:20",
      "lastUpdatedBy": 1,
      "objectVersionNumber": 1,
      "_token": "sC9iSordwYtLKByXkl+NYm6saTILMKWlChN8/9qPn33RZyuAyPrCfYUEWIVlSAfZi8g8qyR/6hBkj9n3y0kuB7b6PBo1zqmh5bBcYlZfAl8=",
      "tenantId": "6",
      "supplierId": "754020897190981647",
      "supplierCode": "754421",
      "supplierType": "BK01",
      "supplierLevel": "代工厂,一级供应商",
      "supplierName": "深圳市真味生物科技有限公司",
      "supplierShortName": "真味",
      "unifiedSocialCode": "91440300359914415M",
      "enabledFlag": 1,
      "supplierTypeMeaning": "生产",
      "enabledFlagMeaning": "是",
      "createdByName": "匿名用户",
      "lastUpdatedByName": "匿名用户"
    },
    {
      "creationDate": "2025-09-25 10:55:20",
      "createdBy": 1,
      "lastUpdateDate": "2025-09-25 10:55:20",
      "lastUpdatedBy": 1,
      "objectVersionNumber": 1,
      "_token": "sC9iSordwYtLKByXkl+NYm6saTILMKWlChN8/9qPn33RZyuAyPrCfYUEWIVlSAfZi8g8qyR/6hBkj9n3y0kuB+hkIKo9WDlMqeuLaJtI3vU=",
      "tenantId": "6",
      "supplierId": "754020897190981646",
      "supplierCode": "622246",
      "supplierType": "BK01",
      "supplierLevel": "代工厂,一级供应商",
      "supplierName": "深圳云普星河科技服务有限公司",
      "supplierShortName": "云普",
      "unifiedSocialCode": "91440300MA5GPJGM0E",
      "enabledFlag": 1,
      "supplierTypeMeaning": "生产",
      "enabledFlagMeaning": "是",
      "createdByName": "匿名用户",
      "lastUpdatedByName": "匿名用户"
    },
    {
      "creationDate": "2025-09-25 10:55:20",
      "createdBy": 1,
      "lastUpdateDate": "2025-09-25 10:55:20",
      "lastUpdatedBy": 1,
      "objectVersionNumber": 1,
      "_token": "sC9iSordwYtLKByXkl+NYm6saTILMKWlChN8/9qPn33RZyuAyPrCfYUEWIVlSAfZi8g8qyR/6hBkj9n3y0kuB+7AdSWrhXf0J8Z3+BzxS5E=",
      "tenantId": "6",
      "supplierId": "754020897190981645",
      "supplierCode": "765505",
      "supplierType": "BK01",
      "supplierLevel": "代工厂,一级供应商",
      "supplierName": "深圳易佳特科技有限公司",
      "supplierShortName": "易佳特",
      "unifiedSocialCode": "91440300557198288B",
      "enabledFlag": 1,
      "supplierTypeMeaning": "生产",
      "enabledFlagMeaning": "是",
      "createdByName": "匿名用户",
      "lastUpdatedByName": "匿名用户"
    },
    {
      "creationDate": "2025-09-25 10:55:20",
      "createdBy": 1,
      "lastUpdateDate": "2025-09-25 10:55:20",
      "lastUpdatedBy": 1,
      "objectVersionNumber": 1,
      "_token": "sC9iSordwYtLKByXkl+NYm6saTILMKWlChN8/9qPn33RZyuAyPrCfYUEWIVlSAfZi8g8qyR/6hBkj9n3y0kuB30LDabi669LFZzpdJ3cMkA=",
      "tenantId": "6",
      "supplierId": "754020897190981644",
      "supplierCode": "22328",
      "supplierType": "BK01",
      "supplierLevel": "代工厂,一级供应商",
      "supplierName": "深圳市热火科技有限公司",
      "supplierShortName": "热火",
      "unifiedSocialCode": "914403000769478586",
      "enabledFlag": 1,
      "supplierTypeMeaning": "生产",
      "enabledFlagMeaning": "是",
      "createdByName": "匿名用户",
      "lastUpdatedByName": "匿名用户"
    },
    {
      "creationDate": "2025-09-25 10:55:20",
      "createdBy": 1,
      "lastUpdateDate": "2025-09-25 10:55:20",
      "lastUpdatedBy": 1,
      "objectVersionNumber": 1,
      "_token": "sC9iSordwYtLKByXkl+NYm6saTILMKWlChN8/9qPn33RZyuAyPrCfYUEWIVlSAfZi8g8qyR/6hBkj9n3y0kuB9xQrWYrRC6xS0iKTsgYCWM=",
      "tenantId": "6",
      "supplierId": "754020897190981643",
      "supplierCode": "533508",
      "supplierType": "BK01",
      "supplierLevel": "代工厂,一级供应商",
      "supplierName": "深圳市禾晗科技有限公司",
      "supplierShortName": "禾晗",
      "unifiedSocialCode": "91440300MA5GL5YH41",
      "enabledFlag": 1,
      "supplierTypeMeaning": "生产",
      "enabledFlagMeaning": "是",
      "createdByName": "匿名用户",
      "lastUpdatedByName": "匿名用户"
    },
    {
      "creationDate": "2025-09-25 10:55:20",
      "createdBy": 1,
      "lastUpdateDate": "2025-09-25 10:55:20",
      "lastUpdatedBy": 1,
      "objectVersionNumber": 1,
      "_token": "sC9iSordwYtLKByXkl+NYm6saTILMKWlChN8/9qPn33RZyuAyPrCfYUEWIVlSAfZi8g8qyR/6hBkj9n3y0kuB1kgG8MAyO27Tm6l6DZtpME=",
      "tenantId": "6",
      "supplierId": "754020897190981642",
      "supplierCode": "21493",
      "supplierType": "BK01",
      "supplierLevel": "代工厂,一级供应商",
      "supplierName": "深圳东灏兴科技有限公司",
      "supplierShortName": "东灏兴",
      "unifiedSocialCode": "91440300568546997E",
      "enabledFlag": 1,
      "supplierTypeMeaning": "生产",
      "enabledFlagMeaning": "是",
      "createdByName": "匿名用户",
      "lastUpdatedByName": "匿名用户"
    },
    {
      "creationDate": "2025-09-25 10:55:20",
      "createdBy": 1,
      "lastUpdateDate": "2025-09-25 10:55:20",
      "lastUpdatedBy": 1,
      "objectVersionNumber": 1,
      "_token": "sC9iSordwYtLKByXkl+NYm6saTILMKWlChN8/9qPn33RZyuAyPrCfYUEWIVlSAfZi8g8qyR/6hBkj9n3y0kuB6+/SRs0yDVrhEMTOxwDrdA=",
      "tenantId": "6",
      "supplierId": "754020897190981639",
      "supplierCode": "100013",
      "supplierType": "BK01",
      "supplierLevel": "代工厂,一级供应商",
      "supplierName": "东莞市鸿馥生物科技有限公司",
      "supplierShortName": "鸿馥",
      "unifiedSocialCode": "91441900MA51BPAP3K",
      "enabledFlag": 1,
      "supplierTypeMeaning": "生产",
      "enabledFlagMeaning": "是",
      "createdByName": "匿名用户",
      "lastUpdatedByName": "匿名用户"
    }
  ],
  "empty": false
};



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
  res.writeHead(statusCode, {'Content-Type': 'application/json; charset=utf-8'});
  res.end(JSON.stringify(data));
}

// 路由处理器
const handlers = {
  // 获取所有数据或单个数据
  GET: (req, res, pathname, query) => {
    const id = pathname.split('/')[2];

    console.log('id==', id);

    if (id === 'lov') {
      sendJSON(res, 200, lovDefineTemple);
    } else if (id === 'lov-data') {
      // sendJSON(res, 200, {'SCM.SUPPLIER': dataSetLovTemple.content});
      sendJSON(res, 200, dataSetLovTemple);
    } else if (id) {
      const item = demoData.find(d => d.id === parseInt(id));
      if (item) {
        sendJSON(res, 200, [item]);
      } else {
        sendJSON(res, 404, {success: false, message: '数据不存在'});
      }
    } else {
      // 支持 ?ids[]=1&ids[]=2 批量查询
      const idsParam = query['ids[]'];
      if (idsParam) {
        const ids = Array.isArray(idsParam) ? idsParam : [idsParam];
        const items = demoData.filter(d => ids.includes(String(d.id)));
        sendJSON(res, 200, {content: items});
      } else {
        sendJSON(res, 200, {content: demoData});
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
      sendJSON(res, 201, {success: true, data: newItem});
    } catch (e) {
      sendJSON(res, 400, {success: false, message: '请求数据格式错误'});
    }
  },

  // 更新数据
  PUT: async (req, res, pathname) => {
    const id = pathname.split('/')[2];

    if (!id) {
      sendJSON(res, 400, {success: false, message: '缺少 ID 参数'});
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
        sendJSON(res, 200, {success: true, data: demoData[index]});
      } else {
        sendJSON(res, 404, {success: false, message: '数据不存在'});
      }
    } catch (e) {
      sendJSON(res, 400, {success: false, message: '请求数据格式错误'});
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
        sendJSON(res, 200, {success: true, data: deleted, count: deleted.length});
      } else {
        sendJSON(res, 404, {success: false, message: '未找到要删除的数据'});
      }
      return;
    }

    if (!id) {
      sendJSON(res, 400, {success: false, message: '缺少 ID 参数'});
      return;
    }

    const index = demoData.findIndex(d => d.id === parseInt(id));

    if (index !== -1) {
      const deleted = demoData.splice(index, 1)[0];
      sendJSON(res, 200, {success: true, data: deleted});
    } else {
      sendJSON(res, 404, {success: false, message: '数据不存在'});
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
      sendJSON(res, 404, {success: false, message: '路径不存在'});
      return;
    }

    const handler = handlers[req.method];

    if (handler) {
      handler(req, res, pathname, query);
    } else {
      sendJSON(res, 405, {success: false, message: '方法不支持'});
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

module.exports = {createServer};
