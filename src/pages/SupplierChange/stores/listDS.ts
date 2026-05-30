import DataSet, { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import { FieldType } from 'choerodon-ui/dataset/data-set/enum';
import { AxiosRequestConfig } from 'axios';

import { HG_SRM_API_PREFIX } from '@/utils/config';
import { intl } from 'utils/utils';

const intlPrefix = 'srm.supplier.model.supplier';

// TODO 模拟值集
const statusOptionsDS = new DataSet({
  data: [
    { value: 1, meaning: '新建' },
    { value: 2, meaning: '完成' },
    { value: 3, meaning: '取消' },
  ],
});

export const listDSConf = (): DataSetProps => ({
  selection: false,
  primaryKey: 'changeId',
  idField: 'changeId',
  pageSize: 20,
  autoQueryAfterSubmit: false,
  autoQuery: true,
  queryFields: [
    {
      name: 'changeNo',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.changeNo`).d('变更单号'),
    },
    {
      name: 'supplierName',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.supplierName`).d('供应商名称'),
    },
    {
      name: 'supplierCode',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.supplierCode`).d('供应商编码'),
    },
    {
      name: 'status',
      type: FieldType.number,
      label: intl.get(`${intlPrefix}.status`).d('单据状态'),
      options: statusOptionsDS,
    },
    {
      name: 'createdByName',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.createdByName`).d('创建人'),
    },
  ],
  fields: [
    {
      name: 'changeNo',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.changeNo`).d('变更单号'),
    },
    {
      name: 'supplierCode',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.supplierCode`).d('供应商编码'),
    },
    {
      name: 'supplierName',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.supplierName`).d('供应商名称'),
    },
    {
      name: 'shortName',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.shortName`).d('简称'),
    },
    {
      name: 'statusMeaning',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.statusMeaning`).d('单据状态'),
    },
    {
      name: 'createdByName',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.createdByName`).d('创建人'),
    },
    {
      name: 'creationDateStr',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.creationDateStr`).d('创建时间'),
    },
  ],
  transport: {
    read: ({ data }): AxiosRequestConfig => ({
      url: `${HG_SRM_API_PREFIX}/supplier-changes`,
      method: 'get',
      data,
    }),
    destroy: ({ data }): AxiosRequestConfig => ({
      url: `${HG_SRM_API_PREFIX}/supplier-changes`,
      method: 'delete',
      data: {
        ids: data.map(item => item.changeId),
      },
    }),
  },
});
