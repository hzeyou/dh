import { AxiosRequestConfig } from 'axios';
import { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import { FieldType } from 'choerodon-ui/dataset/data-set/enum';

import { intl } from 'utils/utils';

const intlPrefix = 'srm.supplier.model.supplier';

export const detailDSConf = (): DataSetProps => ({
  autoCreate: true,
  fields: [
    {
      name: 'vendorCode',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorCode`).d('类型编码'),
      required: true,
    },
    {
      name: 'vendorTypeName',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorTypeName`).d('类型名称'),
      required: true,
    },
    {
      name: 'vendorStatus',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorStatus`).d('状态'),
      lookupCode: 'SRM.ACTION.STATUS',
      required: true,
    },
    {
      name: 'isRegisterAudit',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isRegisterAudit`).d('注册审核'),
    },
    {
      name: 'isZiZhiAudit',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isZiZhiAudit`).d('资质审核'),
    },
    {
      name: 'isXieYi',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isXieYi`).d('协议管理'),
    },
    {
      name: 'isXianChangAudit',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('线上审核'),
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
