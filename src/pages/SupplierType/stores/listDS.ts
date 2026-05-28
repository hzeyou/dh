import { HG_SRM_API_PREFIX } from '@/utils/config';
import { AxiosRequestConfig } from 'axios';
import DataSet, { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import { FieldType } from 'choerodon-ui/dataset/data-set/enum';

import { intl } from 'utils/utils';

const intlPrefix = 'srm.supplier.model.supplier';



export const listDSConf = (): DataSetProps => ({
  selection: false,
  autoQuery: true,
  primaryKey: 'typeId',
  idField: 'typeId',
  pageSize: 20,
  autoQueryAfterSubmit: false,
  queryFields: [
    {
      name: 'sapCode',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.sap_code`).d('类型编码'),
    },
    {
      name: 'typeName',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.type_name`).d('类型名称'),
    },
    {
      name: 'status',
      type: FieldType.number,
      label: intl.get(`${intlPrefix}.status`).d('状态'),
      lookupCode: 'SRM.SUPPLIER_TYPE_STATUS',
    },
  ],
  fields: [
    {
      name: 'typeId',
      type: FieldType.number,
    },
    {
      name: 'sapCode',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.sap_code`).d('类型编码'),
    },
    {
      name: 'typeName',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.type_name`).d('类型名称'),
    },
    {
      name: 'status',
      type: FieldType.number,
      label: intl.get(`${intlPrefix}.status`).d('状态'),
      lookupCode: 'SRM.SUPPLIER_TYPE_STATUS',
    },
    {
      name: 'registrationReviewMeaning',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.registration_review`).d('注册审核'),
    },
    {
      name: 'agreementMeaning',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.agreement`).d('协议管理'),
    },
    {
      name: 'onsiteAuditMeaning',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.onsite_audit`).d('现场审核'),
    },
    {
      name: 'certificateMeaning',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.certificate`).d('资质证书'),
    }
  ],
  transport: {
    read: ({ data }): AxiosRequestConfig => {
      return {
        url: `${HG_SRM_API_PREFIX}/supplier-types`,
        method: 'get',
        data,
      };
    },
  },
});
