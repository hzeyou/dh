// import { HG_SRM_API_PREFIX } from '@/utils/config';
import { AxiosRequestConfig } from 'axios';
import { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import { FieldType } from 'choerodon-ui/dataset/data-set/enum';

import { intl } from 'utils/utils';

const intlPrefix = 'srm.supplier.model.supplier';

export const listDSConf = (): DataSetProps => ({
  selection: false,
  pageSize: 20,
  autoQueryAfterSubmit: false,
  autoQuery: true,
  queryFields: [
    {
      name: 'vendorCode',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorCode`).d('供应商编码'),
    },
    {
      name: 'vendorTypeName',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorTypeName`).d('供应商名称'),
    },
    {
      name: 'vendorType',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorStatus`).d('供应商类型'),
      lookupCode: 'SRM.ACTION.STATUS',
    },
    {
      name: 'vendor1',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorStatus`).d('同步状态'),
      lookupCode: 'SRM.ACTION.STATUS',
    },
    {
      name: 'vendor2',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorStatus`).d('生命周期阶段'),
      lookupCode: 'SRM.ACTION.STATUS',
    },
    {
      name: 'vendor3',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorStatus`).d('创建方式'),
      lookupCode: 'SRM.ACTION.STATUS',
    },
    {
      name: 'vendor4',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorStatus`).d('供货品类'),
      lookupCode: 'SRM.ACTION.STATUS',
    },
    {
      name: 'vendor5',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorStatus`).d('供应商级别'),
      lookupCode: 'SRM.ACTION.STATUS',
    },
  ],
  fields: [
    {
      name: 'vendorCode',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorCode`).d('供应商编码'),
    },
    {
      name: 'vendorTypeName',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorTypeName`).d('SRM编码'),
    },
    {
      name: 'vendorStatus',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorStatus`).d('供应商名称'),
      lookupCode: 'SRM.ACTION.STATUS',
    },
    {
      name: 'isRegisterAudit',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isRegisterAudit`).d('供应商类型'),
    },
    {
      name: 'isZiZhiAudit',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isZiZhiAudit`).d('供应商级别'),
    },
    {
      name: 'isXieYi',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isXieYi`).d('生命周期阶段'),
    },
    {
      name: 'isXianChangAudit',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isXianChangAudit1`).d('供货品类'),
    },
    {
      name: 'isXianChangAudit1',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isXianChangAudit2`).d('创建方式'),
    },
    {
      name: 'isXianChangAudit2',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isXianChangAudit3`).d('同步状态'),
    },
  ],
  transport: {
    read: ({ data }): AxiosRequestConfig => {
      return {
        // url: `${HG_SRM_API_PREFIX}/supplier`,
        url: `${process.env.SRM_DEV_HOST}/api/srm/supplier`,
        method: 'get',
        data,
      };
    },
  },
});
