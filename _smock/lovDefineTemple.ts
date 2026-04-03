import { Request, Response } from 'express';
const { setCorsHeaders } = require('./_utils/cors');

module.exports = {
  name: 'ts-demo',
  desc: 'ts apis',
  apis: [
    {
      name: 'ts-demo lov-data options',
      desc: 'CORS preflight',
      method: 'OPTIONS',
      url: '/demo/lov-data',
      handle: (req: Request, res: Response) => {
        setCorsHeaders(req, res);
        res.sendStatus(200);
      },
    },
    {
      name: 'ts-demo one',
      desc: 'example',
      method: 'GET',
      url: '/demo/lov-data',
      handle: (req: Request, res: Response) => {
        setCorsHeaders(req, res);
        res.status(200);
        res.send({
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
        });
      },
    }
  ]


};
