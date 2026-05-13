import { AxiosRequestConfig } from 'axios';
import { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import { FieldType } from 'choerodon-ui/dataset/data-set/enum';

import { intl } from 'utils/utils';

const intlPrefix = 'srm.supplier.model.supplier';

export const bankDSConf = (): DataSetProps => ({
  autoCreate: true,
  fields: [
    {
      name: 'field',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorCode`).d('本地清算号（联行号）'),
      required: true,
    },
    {
      name: 'field1',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorTypeName`).d('swiftcode'),
      required: true,
    },
    {
      name: 'field2',
      type: FieldType.email,
      label: intl.get(`${intlPrefix}.vendorStatus`).d('银行名称'),
      required: true,
    },
    {
      name: 'field3',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isRegisterAudit`).d('国家/地区'),
      lookupCode: 'SRM.ACTION.STATUS',
    },
    {
      name: 'field4',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isZiZhiAudit`).d('银行账户'),
    },
    {
      name: 'field5',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isZiZhiAudit`).d('收款单位全称'),
    },
    {
      name: 'field6',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isZiZhiAudit`).d('收款方类型'),
      lookupCode: 'SRM.ACTION.STATUS',
    },
    {
      name: 'field7',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isZiZhiAudit`).d('收款银行地址'),
    },
    {
      name: 'field8',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isZiZhiAudit`).d('是否开票银行'),
      lookupCode: 'SRM.ACTION.STATUS',
    },
    {
      name: 'field9',
      type: FieldType.attachment,
      label: intl.get(`${intlPrefix}.isZiZhiAudit`).d('银行信息盖章附件'),
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
