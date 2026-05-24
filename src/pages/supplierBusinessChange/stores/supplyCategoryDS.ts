import { AxiosRequestConfig } from 'axios';
import DataSet, { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import { FieldIgnore, FieldType } from 'choerodon-ui/dataset/data-set/enum';

import { intl } from 'utils/utils';
import { LovSyncTable } from '@/utils/util';
import { detailDSConf } from '@/pages/SupplierBusinessChange/stores/detailDS';

const intlPrefix = 'srm.supplier.model.supplier';

export const supplyCategoryDSConf = (): DataSetProps => ({
  autoCreate: false,
  fields: [
    {
      name: 'supplierId',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.supplierName`).d('供应商id'),
      required: true,
      bind: 'supplyCodeLov.supplierId',
    },
    {
      name: 'supplierCode',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.supplierCode`).d('供应商编码'),
      required: true,
      bind: 'supplyCodeLov.supplierCode',
    },
    {
      name: 'supplierName',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.supplierName`).d('供应商名称'),
      required: true,
      bind: 'supplyCodeLov.supplierName',
    },
    {
      name: 'supplierTypeId',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.supplierTypeId`).d('供应商类型'),
      required: true,
      bind: 'supplyCodeLov.supplierType',
    },
    {
      name: 'categoryId',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.categoryId`).d('品类'),
      lookupCode: 'SRM.ACTION.STATUS',
    },
    {
      name: 'categoryLevel',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.categoryLevel`).d('供应商等级'),
      bind: 'supplyCodeLov.supplierLevel',
    },
    {
      name: 'newLevel',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.newLevel`).d('变更后等级'),
    },
    {
      name: 'reson',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.reson`).d('原因'),
    },
    {
      name: 'remark',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.remark`).d('备注'),
    },
    {
      name: 'attachment',
      type: FieldType.attachment,
      label: intl.get(`${intlPrefix}.attachment`).d('上传文件'),
    },
    {
      name: 'supplyCodeLov',
      type: FieldType.object,
      label: intl.get(`${intlPrefix}.supplyCodeLov`).d('供应商对象'),
      ignore: FieldIgnore.always,
    },
  ],
  events: {
    remove: ({dataSet}) => {
      const lovDS = dataSet.getState('lovDS');
      LovSyncTable.delete(dataSet, lovDS, 'supplyCodeLov');
    }
  },
});
