import { AxiosRequestConfig } from 'axios';
import { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import { FieldType } from 'choerodon-ui/dataset/data-set/enum';

import { intl } from 'utils/utils';

const intlPrefix = 'srm.supplier.model.supplier';
const admissionRulePrefix = `${intlPrefix}.admissionRule`;
const checkedValue = '是';
const uncheckedValue = '否';

export const detailDSConf = (): DataSetProps => ({
  autoCreate: true,
  primaryKey: 'id',
  idField: 'id',
  fields: [
    {
      name: 'id',
      type: FieldType.number,
    },
    {
      name: 'vendorCode',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorCode`).d('类型编码'),
      required: true,
    },
    {
      name: 'vendorTypeName',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorTypeName`).d('类型名称'),
      required: true,
    },
    {
      name: 'vendorStatus',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorStatus`).d('状态'),
      lookupCode: 'SRM.ACTION.STATUS',
      required: true,
    },
    {
      name: 'isRegisterAudit',
      type: FieldType.boolean,
      label: intl.get(`${intlPrefix}.isRegisterAudit`).d('注册审核'),
      trueValue: checkedValue,
      falseValue: uncheckedValue,
      defaultValue: uncheckedValue,
    },
    {
      name: 'registerAuditRule',
      type: FieldType.string,
      label: intl
        .get(`${admissionRulePrefix}.registerAuditRule`)
        .d('注册审核方式'),
      lookupCode: 'SRM.REGISTRATION_REVIEW',
      dynamicProps: {
        disabled: ({ record }) =>
          record?.get('isRegisterAudit') !== checkedValue,
        required: ({ record }) =>
          record?.get('isRegisterAudit') === checkedValue,
      },
    },
    {
      name: 'isZiZhiAudit',
      type: FieldType.boolean,
      label: intl.get(`${intlPrefix}.isZiZhiAudit`).d('资质证书'),
      trueValue: checkedValue,
      falseValue: uncheckedValue,
      defaultValue: uncheckedValue,
    },
    {
      name: 'ziZhiAuditRule',
      type: FieldType.string,
      label: intl.get(`${admissionRulePrefix}.ziZhiAuditRule`).d('资质证书'),
      lookupCode: 'SRM.REGISTRATION_REVIEW',
      multiple: ',',
      dynamicProps: {
        disabled: ({ record }) => record?.get('isZiZhiAudit') !== checkedValue,
        required: ({ record }) => record?.get('isZiZhiAudit') === checkedValue,
      },
    },
    {
      name: 'isXieYi',
      type: FieldType.boolean,
      label: intl.get(`${intlPrefix}.isXieYi`).d('协议管理'),
      trueValue: checkedValue,
      falseValue: uncheckedValue,
      defaultValue: uncheckedValue,
    },
    {
      name: 'isXianChangAudit',
      type: FieldType.boolean,
      label: intl.get(`${intlPrefix}.isXianChangAudit`).d('现场审核'),
      trueValue: checkedValue,
      falseValue: uncheckedValue,
      defaultValue: uncheckedValue,
    },
  ],
  transport: {
    read: ({ dataSet }): AxiosRequestConfig => {
      const supplierId = dataSet?.getState('supplierId');
      return {
        url: `${process.env.SRM_DEV_HOST}/srm/supplier/${supplierId}`,
        method: 'get',
      };
    },
    submit: ({ dataSet, data }): AxiosRequestConfig => {
      const supplierId = dataSet?.getState('supplierId');
      const isCreate = supplierId === 'create';

      return {
        url: `${process.env.SRM_DEV_HOST}/srm/supplier${
          isCreate ? '' : `/${supplierId}`
        }`,
        method: isCreate ? 'post' : 'put',
        data: data[0],
      };
    },
  },
  events: {
    update: ({ record, name, value }) => {
      if (name === 'isRegisterAudit' && value !== checkedValue) {
        record.set('registerAuditRule', undefined);
      }
      if (name === 'isZiZhiAudit' && value !== checkedValue) {
        record.set('ziZhiAuditRule', undefined);
      }
    },
  },
});
