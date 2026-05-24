import { AxiosRequestConfig } from 'axios';
import DataSet, { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import { FieldIgnore, FieldType } from 'choerodon-ui/dataset/data-set/enum';

import { intl } from 'utils/utils';

const intlPrefix = 'srm.supplier.model.supplier';


export const bankLovDSConf = (): DataSetProps => ({
  autoCreate: false,
  fields: [
    {
      name: 'lovSortCode',
      type: FieldType.object,
      label: intl.get(`${intlPrefix}.lovSortCode`).d('本地清算号（联行号）'),
      multiple: true,
      lovCode: 'SCM.SUPPLIER',
      ignore: FieldIgnore.always,
    },
  ],
});
