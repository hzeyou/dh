import { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import { FieldIgnore, FieldType } from 'choerodon-ui/dataset/data-set/enum';

import { intl } from 'utils/utils';
import { LovSyncTable } from '@/utils/util';

const intlPrefix = 'srm.supplier.model.supplier';


export const supplyScopeDSConf = (): DataSetProps => ({
  autoCreate: false,
  selection: false,
  fields: [
    {
      name: 'categoryId',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.categoryId`).d('品类编码'),
      required: true,
      bind: 'categoryLov.supplierId',
    },
    {
      name: 'categoryName',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.categoryName`).d('品类名称'),
      bind: 'categoryLov.supplierName',
    },
    {
      name: 'status',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.status`).d('准入状态'),
      defaultValue: '1',
    },
    {
      name: 'categoryLevel',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.categoryLevel`).d('供应商等级'),
      lookupCode: 'SRM.SUPPLIER_LEVEL',
    },
    {
      name: 'categoryLov',
      type: FieldType.object,
      label: intl.get(`${intlPrefix}.categoryId`).d('品类编码'),
      required: true,
      lovCode: 'SCM.SUPPLIER',
      ignore: FieldIgnore.always,
    },
  ],
  events: {
    remove: ({dataSet}) => {
      const lovDS = dataSet.getState('lovDS');
      LovSyncTable.delete(dataSet, lovDS, 'lovSortCode');
    }
  },
});
