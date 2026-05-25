import { AxiosRequestConfig } from 'axios';
import { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import { DataToJSON, FieldType } from 'choerodon-ui/dataset/data-set/enum';

import { intl } from 'utils/utils';
import Record from 'choerodon-ui/dataset/data-set/Record';
import { HG_SRM_API_PREFIX } from '@/utils/config';

const intlPrefix = 'srm.supplier.model.supplier';

export const detailDSConf = (): DataSetProps => ({
  autoCreate: true,
  primaryKey: 'id',
  idField: 'id',
  dataToJSON: DataToJSON.normal,
  fields: [
    {
      name: 'id',
      type: FieldType.number,
    },
    {
      name: 'supplierName',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.supplierName`).d('供应商名称'),
      required: true,
    },
    {
      name: 'typeId',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.typeId`).d('供应商类型'),
      required: true,
      lookupCode: 'SRM.SUPPLIERS_TYPE',
    },
    {
      name: 'email',
      type: FieldType.email,
      label: intl.get(`${intlPrefix}.email`).d('邀请邮箱'),
      required: true,
    },
    {
      name: 'level',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.level`).d('供应商级别'),
      multiple: true,
      lookupCode: 'SRM.SUPPLIER_LEVEL',
      required: true,
      transformRequest: (value: any, record: Record) => {
        return value?.join(',');
      },
      transformResponse: (value: any, record: Record) => {
        return value?.split(',');
      }
    },
    {
      name: 'remark',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.remark`).d('备注'),
    },
    {
      name: 'accountCreatedFlag',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.accountCreatedFlag`).d('创建供应商账号'),
      lookupCode: 'SRM.ACCOUNT_CREATED_FLAG',
      required: true,
      defaultValue: '0',
    },
  ],
  transport: {
    read: ({ dataSet, data }): AxiosRequestConfig => {
      return {
        url: `${HG_SRM_API_PREFIX}/supplier-registrations/${data.id}`,
        method: 'get',
      };
    },
    submit: ({ dataSet, data }): AxiosRequestConfig => {
      return {
        url: `${HG_SRM_API_PREFIX}/supplier-registrations/save`,
        method: 'post',
        data: data[0],
      };
    },
    exports: ({ dataSet, data }): AxiosRequestConfig => {
      return {
        url: `${HG_SRM_API_PREFIX}/supplier-registrations/export`,
        method: 'get',
      };
    }
  },
});
