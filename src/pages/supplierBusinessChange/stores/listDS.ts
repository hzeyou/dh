import { HG_SRM_API_PREFIX, billTypeOptionsDS } from '@/utils/config';
import { AxiosRequestConfig } from 'axios';
import { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import { FieldType } from 'choerodon-ui/dataset/data-set/enum';

import { intl } from 'utils/utils';

const intlPrefix = 'srm.supplier.model.supplier';

export const listDSConf = (): DataSetProps => ({
  selection: false,
  primaryKey: 'changeId',
  idField: 'changeId',
  pageSize: 20,
  autoQueryAfterSubmit: false,
  autoQuery: true,
  queryFields: [
    {
      name: 'businessChangeNo',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.businessChangeNo`).d('业务变更单'),
    },
    {
      name: 'type',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.type`).d('单据类型'),
      options: billTypeOptionsDS,
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
  ],
  fields: [
    {
      name: 'businessChangeNo',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.businessChangeNo`).d('业务变更单'),
    },
    {
      name: 'statusMeaning',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.statusMeaning`).d('状态'),
    },
    {
      name: 'typeMeaning',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.typeMeaning`).d('单据类型'),
    },
    {
      // TODO 返回缺失
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
      url: `${HG_SRM_API_PREFIX}/supplier-business-changes`,
      method: 'get',
      data,
    }),
    destroy: ({ data }): AxiosRequestConfig => ({
      url: `${HG_SRM_API_PREFIX}/supplier-business-changes`,
      method: 'delete',
      data: {
        ids: data.map(item => item.changeId),
      },
    }),
  },
});
