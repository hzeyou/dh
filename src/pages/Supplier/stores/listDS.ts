import { HG_SRM_API_PREFIX } from '@/utils/config';
import { AxiosRequestConfig } from 'axios';
import { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import { FieldType } from 'choerodon-ui/dataset/data-set/enum';
import Record from 'choerodon-ui/dataset/data-set/Record';
import { filterNullValueObject, intl } from 'utils/utils';

const intlPrefix = 'srm.supplier.model.supplier';

export const listDSConf = (): DataSetProps => ({
  selection: false,
  pageSize: 20,
  autoQueryAfterSubmit: false,
  autoQuery: true,
  queryFields: [
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
      name: 'supplierTypeId',
      type: FieldType.number,
      label: intl.get(`${intlPrefix}.supplierTypeId`).d('供应商类型'),
      lookupCode: 'SRM.SUPPLIER_TYPE',
    },
    {
      name: 'level',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.level`).d('供应商级别'),
      lookupCode: 'SRM.SUPPLIER_LEVEL',
      multiple: true,
    },
    {
      name: 'syncSapStatus',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.syncSapStatus`).d('同步状态'),
      lookupCode: 'SRM.SUPPLIER_SYNC_SAP_STATUS',
    },
    {
      name: 'status',
      type: FieldType.number,
      label: intl.get(`${intlPrefix}.status`).d('生命周期阶段'),
      lookupCode: 'SRM.SUPPLIER_STATUS',
    },
    {
      name: 'createdFrom',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.createdFrom`).d('创建方式'),
      lookupCode: 'SRM.SUPPLIER_CREATED_TYPE',
    },
    {
      name: 'itemTypes',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.itemTypes`).d('供货品类'),
    },
  ],
  fields: [
    {
      name: 'supplierId',
      type: FieldType.number,
      label: intl.get(`${intlPrefix}.supplierId`).d('供应商ID'),
    },
    {
      name: 'supplierCode',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.supplierCode`).d('供应商编码'),
    },
    {
      name: 'sapCode',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.sapCode`).d('SAP编码'),
    },
    {
      name: 'supplierName',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.supplierName`).d('供应商名称'),
    },
    {
      name: 'supplierTypeId',
      type: FieldType.number,
      label: intl.get(`${intlPrefix}.supplierTypeId`).d('供应商类型'),
      lovCode: 'SRM.SUPPLIER_TYPE',
    },
    {
      name: 'level',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.level`).d('供应商级别'),
      lovCode: 'SRM.SUPPLIER_LEVEL',
      multiple: true,
      transformRequest: (value: any, record: Record) => {
        return value?.join(',');
      },
      transformResponse: (value: any, record: Record) => {
        return value?.split(',');
      },
    },
    {
      name: 'status',
      type: FieldType.number,
      label: intl.get(`${intlPrefix}.status`).d('生命周期阶段'),
      lookupCode: 'SRM.SUPPLIER_STATUS',
    },
    {
      name: 'itemTypes',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.itemTypes`).d('供货品类'),
    },
    {
      name: 'syncSapStatus',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.syncSapStatus`).d('同步状态'),
      lookupCode: 'SRM.SUPPLIER_SYNC_SAP_STATUS',
    },
    {
      name: 'syncSapInfo',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.syncSapInfo`).d('同步返回信息'),
    },
    {
      name: 'creditCode',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.creditCode`).d('统一社会信用代码'),
    },
    {
      name: 'shortName',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.shortName`).d('简称'),
    },
    {
      name: 'categoryName',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.categoryName`).d('供货品类'),
    },
    {
      name: 'createdFrom',
      type: FieldType.number,
      label: intl.get(`${intlPrefix}.createdFrom`).d('创建方式'),
      lookupCode: 'SRM.SUPPLIER_CREATED_TYPE',
    },
    {
      name: 'registerAuditStatus',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.registerAuditStatus`).d('注册审核状态'),
    },
    {
      name: 'admissionNo',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.admissionNo`).d('准入单号'),
    },
  ],
  transport: {
    read: ({ data }): AxiosRequestConfig => {
      return {
        url: `${HG_SRM_API_PREFIX}/suppliers`,
        method: 'get',
        data: data,
      };
    },
  },
});
