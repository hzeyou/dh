import { AxiosRequestConfig } from 'axios';
import DataSet, { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import { FieldType } from 'choerodon-ui/dataset/data-set/enum';

import { intl } from 'utils/utils';

const intlPrefix = 'srm.supplier.model.supplier';


export const lovBankDSConf = (): DataSetProps => ({
  autoCreate: false,
  fields: [
    {
      name: 'sortCode',
      type: FieldType.object,
      label: intl.get(`${intlPrefix}.vendorCode`).d('本地清算号（联行号）'),
      multiple: true,
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
