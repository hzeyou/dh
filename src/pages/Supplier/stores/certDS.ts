import { AxiosRequestConfig } from 'axios';
import { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import { FieldType } from 'choerodon-ui/dataset/data-set/enum';

import { intl } from 'utils/utils';

const intlPrefix = 'srm.supplier.model.supplier';

export const certDSConf = (): DataSetProps => ({
  autoCreate: true,
  fields: [
    {
      name: 'type',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.type`).d('证书类型'),
      required: true,
      lookupCode: 'SRM.ACTION.STATUS',
    },
    {
      name: 'name',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.name`).d('证书名称'),
      required: true,
    },
    {
      name: 'number',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.number`).d('证书号'),
      required: true,
    },
    {
      name: 'effectiveDate',
      type: FieldType.date,
      label: intl.get(`${intlPrefix}.effectiveDate`).d('证书生效日期'),
    },
    {
      name: 'expiryDate',
      type: FieldType.date,
      label: intl.get(`${intlPrefix}.expiryDate`).d('证书失效日期'),
    },
    {
      name: 'remark',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.remark`).d('备注'),
    },
    {
      name: 'attachment',
      type: FieldType.attachment,
      label: intl.get(`${intlPrefix}.attachment`).d('附件'),
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
