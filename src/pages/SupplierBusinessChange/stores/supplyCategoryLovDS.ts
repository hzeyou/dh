import { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import { FieldIgnore, FieldType } from 'choerodon-ui/dataset/data-set/enum';

import { intl } from 'utils/utils';

const intlPrefix = 'srm.supplier.model.supplier';


export const supplyCategoryLovDSConf = (): DataSetProps => ({
  autoCreate: false,
  fields: [
    {
      name: 'supplyCodeLov',
      type: FieldType.object,
      label: intl.get(`${intlPrefix}.lovSortCode`).d('新建'),
      multiple: true,
      // TODO 需要值集
      lovCode: 'SCM.SUPPLIER',
      ignore: FieldIgnore.always,
    },
  ],
});
