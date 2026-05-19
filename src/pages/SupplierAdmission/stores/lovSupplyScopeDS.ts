import { AxiosRequestConfig } from 'axios';
import DataSet, { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import { FieldIgnore, FieldType } from 'choerodon-ui/dataset/data-set/enum';

import { intl } from 'utils/utils';
import { lovBankDSConf } from '@/pages/Supplier/stores/lovBankDS';

const intlPrefix = 'srm.supplier.model.supplier';


export const lovSupplyScopeDSConf = (): DataSetProps => ({
  autoCreate: false,
  fields: [
    {
      name: 'lovSupplyCode',
      type: FieldType.object,
      label: intl.get(`${intlPrefix}.lovSortCode`).d('本地清算号（联行号）'),
      multiple: true,
      lovCode: 'SCM.SUPPLIER',
      ignore: FieldIgnore.always,
    },
  ],
});
