import { AxiosRequestConfig } from 'axios';
import { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import { FieldType } from 'choerodon-ui/dataset/data-set/enum';

import { intl } from 'utils/utils';

const intlPrefix = 'srm.supplier.model.supplier';

export const detailDSConf = (): DataSetProps => ({
  autoCreate: true,
  fields: [
    {
      name: 'field',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorCode`).d('供应商类型'),
      required: true,
    },
    {
      name: 'field1',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorTypeName`).d('供应商名称'),
      required: true,
    },
    {
      name: 'field2',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorStatus`).d('统一社会信用代码'),
      lookupCode: 'SRM.ACTION.STATUS',
      required: true,
    },
    {
      name: 'field3',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isRegisterAudit`).d('简称'),
    },
    {
      name: 'field4',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isZiZhiAudit`).d('供应商级别'),
    },
    {
      name: 'field5',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isXieYi`).d('爱奇迹采购员'),
    },
    {
      name: 'field6',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('交易币种'),
    },
    {
      name: 'field7',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('国家'),
    },
    {
      name: 'field8',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('所在地区'),
    },
    {
      name: 'field9',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('详细地址'),
    },
    {
      name: 'field10',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('退货地址'),
    },
    {
      name: 'field11',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('注册资本（万元）'),
    },
    {
      name: 'field12',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('实缴资本（万元）'),
    },
    {
      name: 'field13',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('成立日期'),
    },
    {
      name: 'field14',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('营业期限'),
    },
    {
      name: 'field15',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('法人代表'),
    },
    {
      name: 'field16',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('是否使用电子签章'),
    },
    {
      name: 'field17',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('境内货源地'),
    },
    {
      name: 'field18',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('境外货源地'),
    },
    {
      name: 'field19',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('是否领用防伪码'),
    },
    {
      name: 'field20',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('开票公司名称'),
    },
    {
      name: 'field21',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('开票公司电话'),
    },
    {
      name: 'field22',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('开票公司地址'),
    },
    {
      name: 'field23',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('经营范围'),
    },
    {
      name: 'field24',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('公司简介'),
      multiLine: true,
    },
    {
      name: 'field25',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('创建供应商账号'),
      lookupCode: 'SRM.ACTION.STATUS',
    },
  ],
  transport: {
    read: ({ dataSet }): AxiosRequestConfig => {
      const supplierId = dataSet?.getState('supplierId');
      return {
        url: `${process.env.SRM_DEV_HOST}/srm/supplier/${supplierId}`,
        method: 'get',
      };
    },
    submit: ({ dataSet, data }): AxiosRequestConfig => {
      const supplierId = dataSet?.getState('supplierId');
      const isCreate = supplierId === 'create';

      return {
        url: `${process.env.SRM_DEV_HOST}/srm/supplier${
          isCreate ? '' : `/${supplierId}`
        }`,
        method: isCreate ? 'post' : 'put',
        data: data[0],
      };
    },
  },
});
