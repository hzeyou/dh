import { AxiosRequestConfig } from 'axios';
import DataSet, { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import { FieldType } from 'choerodon-ui/dataset/data-set/enum';

import { intl } from 'utils/utils';

const intlPrefix = 'srm.supplier.model.supplier';

const optionsDS = new DataSet({
  data: [
    { meaning: '是', value: '1' },
    { meaning: '否', value: '2' },
  ],
});

export const agreementManagementDSConf = (): DataSetProps => ({
  autoCreate: false,
  primaryKey: 'id',
  idField: 'id',
  fields: [
    {
      name: 'id',
      type: FieldType.number,
    },
    {
      name: 'agreementNo',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.agreementNo`).d('协议单号'),
      required: true,
    },
    {
      name: 'agreementName',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.agreementName`).d('协议名称'),
      required: true,
    },
    {
      name: 'remark',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.remark`).d('备注'),
      required: true,
    },
    {
      name: 'admissionRequirement',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.admissionRequirement`).d('准入要求'),
      required: true,
      options: optionsDS
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
