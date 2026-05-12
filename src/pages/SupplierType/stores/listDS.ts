// import { HG_SRM_API_PREFIX } from '@/utils/config';
import { AxiosRequestConfig } from 'axios';
import { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import { FieldType } from 'choerodon-ui/dataset/data-set/enum';

import { intl } from 'utils/utils';

const intlPrefix = 'srm.supplier.model.supplier';
const admissionRulePrefix = `${intlPrefix}.admissionRule`;

export const listDSConf = (): DataSetProps => ({
  selection: false,
  primaryKey: 'id',
  idField: 'id',
  pageSize: 20,
  autoQueryAfterSubmit: false,
  queryFields: [
    {
      name: 'vendorCode',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorCode`).d('类型编码'),
    },
    {
      name: 'vendorTypeName',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorTypeName`).d('类型名称'),
    },
    {
      name: 'vendorStatus',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorStatus`).d('状态'),
      lookupCode: 'SRM.ACTION.STATUS',
    },
  ],
  fields: [
    {
      name: 'id',
      type: FieldType.number,
    },
    {
      name: 'vendorCode',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorCode`).d('类型编码'),
    },
    {
      name: 'vendorTypeName',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorTypeName`).d('类型名称'),
    },
    {
      name: 'vendorStatus',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorStatus`).d('状态'),
      lookupCode: 'SRM.ACTION.STATUS',
    },
    {
      name: 'isRegisterAudit',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isRegisterAudit`).d('注册审核'),
    },
    {
      name: 'registerAuditRule',
      type: FieldType.string,
      label: intl
        .get(`${admissionRulePrefix}.registerAuditRule`)
        .d('注册审核方式'),
      lookupCode: 'SRM.REGISTRATION_REVIEW',
    },
    {
      name: 'isZiZhiAudit',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isZiZhiAudit`).d('资质审核'),
    },
    {
      name: 'ziZhiAuditRule',
      type: FieldType.string,
      label: intl.get(`${admissionRulePrefix}.ziZhiAuditRule`).d('资质证书'),
      lookupCode: 'SRM.REGISTRATION_REVIEW',
      multiple: ',',
    },
    {
      name: 'isXieYi',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isXieYi`).d('协议管理'),
    },
    {
      name: 'isXianChangAudit',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('线上审核'),
    },
  ],
  transport: {
    read: ({ data }): AxiosRequestConfig => {
      return {
        // url: `${HG_SRM_API_PREFIX}/supplier`,
        url: `${process.env.SRM_DEV_HOST}/srm/supplier`,
        method: 'get',
        data,
      };
    },
  },
});
