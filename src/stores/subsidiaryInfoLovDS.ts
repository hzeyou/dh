import { AxiosRequestConfig } from 'axios';
import DataSet, { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import { FieldIgnore, FieldType } from 'choerodon-ui/dataset/data-set/enum';

import { intl } from 'utils/utils';
import { companyInfoDSConf } from '@/stores/subsidiaryInfoDS';

const intlPrefix = 'srm.supplier.model.supplier';


export const companyInfoLovDSConf = (): DataSetProps => ({
  autoCreate: false,
  fields: [
    {
      name: 'companyInfo',
      type: FieldType.object,
      label: intl.get(`${intlPrefix}.companyInfo`).d('公司信息'),
      multiple: true,
      lovCode: 'SCM.SUPPLIER',
      ignore: FieldIgnore.always,
    },
  ],
});
