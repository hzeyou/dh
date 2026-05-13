import { AxiosRequestConfig } from 'axios';
import { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import { FieldType } from 'choerodon-ui/dataset/data-set/enum';

import { intl } from 'utils/utils';

const intlPrefix = 'srm.supplier.model.supplier';

export const certDSConf = (): DataSetProps => ({
  autoCreate: true,
  fields: [
    {
      name: 'field',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorCode`).d('证书类型'),
      required: true,
      lookupCode: 'SRM.ACTION.STATUS',
    },
    {
      name: 'field1',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorTypeName`).d('证书名称'),
      required: true,
    },
    {
      name: 'field2',
      type: FieldType.email,
      label: intl.get(`${intlPrefix}.vendorStatus`).d('证书号'),
      required: true,
    },
    {
      name: 'field3',
      type: FieldType.date,
      label: intl.get(`${intlPrefix}.isRegisterAudit`).d('证书生效日期'),
    },
    {
      name: 'field4',
      type: FieldType.date,
      label: intl.get(`${intlPrefix}.isZiZhiAudit`).d('证书失效日期'),
    },
    {
      name: 'field5',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isZiZhiAudit`).d('备注'),
    },
    {
      name: 'field6',
      type: FieldType.attachment,
      label: intl.get(`${intlPrefix}.isZiZhiAudit`).d('附件'),
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
