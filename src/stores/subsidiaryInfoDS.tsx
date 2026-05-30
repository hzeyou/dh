import { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import { FieldIgnore, FieldType } from 'choerodon-ui/dataset/data-set/enum';

import { intl } from 'utils/utils';

const intlPrefix = 'srm.supplier.model.supplier';

export const subsidiaryInfoDSConf = (): DataSetProps => ({
  autoCreate: false,
  primaryKey: 'id',
  idField: 'id',
  selection: false,
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
      bind: 'subsidiaryLov.supplierId',
    },
    {
      name: 'paymentTerms',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.paymentTerms`).d('付款条件'),
      required: true,
    },
    // {
    //   name: 'companyInfo',
    //   type: FieldType.object,
    //   label: intl.get(`${intlPrefix}.paymentTerms`).d('公司信息'),
    //   required: true,
    // },
    {
      name: 'subsidiaryLov',
      type: FieldType.object,
      label: intl.get(`${intlPrefix}.vendorCode`).d('公司'),
      required: true,
      lovCode: 'SCM.SUPPLIER',
      ignore: FieldIgnore.always,
    },
  ],
});
