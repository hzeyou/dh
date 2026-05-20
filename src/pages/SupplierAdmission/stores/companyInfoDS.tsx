import { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import { FieldType } from 'choerodon-ui/dataset/data-set/enum';

import { intl } from 'utils/utils';

const intlPrefix = 'srm.supplier.model.supplier';

export const companyInfoDSConf = (): DataSetProps => ({
  autoCreate: true,
  primaryKey: 'id',
  idField: 'id',
  fields: [
    {
      name: 'id',
      type: FieldType.number,
    },
    {
      name: 'subsidiaryId',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorCode`).d('公司'),
      required: true,
      bind: 'companyInfo.companyId',
    },
    {
      name: 'paymentTerms',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.paymentTerms`).d('付款条件'),
      required: true,
    },
    {
      name: 'companyInfo',
      type: FieldType.object,
      label: intl.get(`${intlPrefix}.paymentTerms`).d('公司信息'),
      required: true,
    },
  ],
});
