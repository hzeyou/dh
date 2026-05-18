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
      name: 'field',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorCode`).d('变更单号'),
    },
    {
      name: 'field2',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorTypeName`).d('供应商名称'),
    },
    {
      name: 'field3',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorStatus`).d('供应商编码'),
      lookupCode: 'SRM.ACTION.STATUS',
    },
    {
      name: 'field4',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorStatus`).d('单据状态'),
      lookupCode: 'SRM.ACTION.STATUS',
    },
    {
      name: 'field5',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorStatus`).d('创建人'),
      lookupCode: 'SRM.ACTION.STATUS',
    },
  ],
  fields: [
    {
      name: 'field',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorCode`).d('变更单号'),
    },
    {
      name: 'field1',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorTypeName`).d('供应商编码'),
    },
    {
      name: 'field2',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorStatus`).d('供应商名称'),
      lookupCode: 'SRM.ACTION.STATUS',
    },
    {
      name: 'field3',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorStatus`).d('简称'),
      lookupCode: 'SRM.ACTION.STATUS',
    },
    {
      name: 'field4',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorStatus`).d('单据状态'),
      lookupCode: 'SRM.ACTION.STATUS',
    },
    {
      name: 'field5',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorStatus`).d('创建人'),
      lookupCode: 'SRM.ACTION.STATUS',
    },
    {
      name: 'field6',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorStatus`).d('创建时间'),
      lookupCode: 'SRM.ACTION.STATUS',
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
