import { AxiosRequestConfig } from 'axios';
import { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import { FieldType } from 'choerodon-ui/dataset/data-set/enum';

import { HG_SRM_API_PREFIX } from '@/utils/config';
import { intl } from 'utils/utils';

const intlPrefix = 'srm.supplier.model.supplier';

export const listDSConf = (): DataSetProps => ({
  selection: false,
  primaryKey: 'assessmentId',
  idField: 'assessmentId',
  pageSize: 20,
  autoQueryAfterSubmit: false,
  autoQuery: true,
  queryFields: [
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
      name: 'assessmentCode',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.assessmentCode`).d('准入及品类扩充单'),
    },
    {
      name: 'assessmentTypeMeaning',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.assessmentTypeMeaning`).d('单据类型'),
    },
    {
      name: 'supplierTypeMeaning',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.supplierTypeMeaning`).d('供应商类型'),
    },
    {
      name: 'statusMeaning',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.statusMeaning`).d('状态'),
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
      name: 'exportCreatedBy',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.createdBy`).d('创建人'),
    },
    {
      name: 'exportCreationDate',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.creationDate`).d('创建时间'),
    },
  ],
  transport: {
    read: ({ data }): AxiosRequestConfig => ({
      url: `${HG_SRM_API_PREFIX}/supplier-assessments`,
      method: 'get',
      data,
    }),
    destroy: ({ data }): AxiosRequestConfig => ({
      url: `${HG_SRM_API_PREFIX}/supplier-assessments`,
      method: 'delete',
      data: {
        ids: data.map(item => item.assessmentId),
      },
    }),
  },
});
