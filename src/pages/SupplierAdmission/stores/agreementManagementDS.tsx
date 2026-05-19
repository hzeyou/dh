import { AxiosRequestConfig } from 'axios';
import { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import { FieldType } from 'choerodon-ui/dataset/data-set/enum';

import { intl } from 'utils/utils';

const intlPrefix = 'srm.supplier.model.supplier';

export const agreementManagementDSConf = (): DataSetProps => ({
  autoCreate: true,
  primaryKey: 'id',
  idField: 'id',
  fields: [
    {
      name: 'id',
      type: FieldType.number,
    },
    {
      name: 'field1',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorCode`).d('协议单号'),
      required: true,
    },
    {
      name: 'field2',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorTypeName`).d('协议名称'),
      required: true,
    },
    {
      name: 'field2',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorTypeName`).d('备注'),
      required: true,
    },
    {
      name: 'field2',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorTypeName`).d('准入要求'),
      required: true,
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
