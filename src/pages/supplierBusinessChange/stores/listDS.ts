// import { HG_SRM_API_PREFIX } from '@/utils/config';
import { AxiosRequestConfig } from 'axios';
import { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import { FieldType } from 'choerodon-ui/dataset/data-set/enum';

import { intl } from 'utils/utils';
import { billTypeOptionsDS } from '@/utils/config';

const intlPrefix = 'srm.supplier.model.supplier';

export const listDSConf = (): DataSetProps => ({
  selection: false,
  pageSize: 20,
  autoQueryAfterSubmit: false,
  autoQuery: true,
  queryFields: [
    // {
    //   name: 'changeId',
    //   type: FieldType.string,
    //   label: intl.get(`${intlPrefix}.changeId`).d('业务变更单'),
    // },
    {
      name: 'type',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.type`).d('单据类型'),
      options: billTypeOptionsDS,
    },
    {
      name: 'supplierCode',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.supplierCode`).d('供应商编码'),
    },
    {
      name: 'supplierName',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.supplierName`).d('供应商编码'),
      lovCode: 'SCM.SUPPLIER'
    },
  ],
  fields: [
    {
      name: 'changeId',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorCode`).d('业务变更单'),
    },
    {
      name: 'status',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorTypeName`).d('状态'),
    },
    {
      name: 'type',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorStatus`).d('单据类型'),
      lookupCode: 'SRM.ACTION.STATUS',
    },
    {
      name: 'createdBy',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorStatus`).d('创建人'),
      lookupCode: 'SRM.ACTION.STATUS',
    },
    {
      name: 'creationDate',
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
