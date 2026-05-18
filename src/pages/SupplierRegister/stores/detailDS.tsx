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
      name: 'field1',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorCode`).d('供应商名称'),
      required: true,
    },
    {
      name: 'field2',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorTypeName`).d('供应商类型'),
      required: true,
    },
    {
      name: 'field3',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorStatus`).d('邀请邮箱'),
      lookupCode: 'SRM.ACTION.STATUS',
      required: true,
    },
    {
      name: 'field4',
      type: FieldType.boolean,
      label: intl.get(`${intlPrefix}.isRegisterAudit`).d('供应商级别'),
      trueValue: checkedValue,
      falseValue: uncheckedValue,
      defaultValue: uncheckedValue,
    },
    {
      name: 'field5',
      type: FieldType.boolean,
      label: intl.get(`${intlPrefix}.isZiZhiAudit`).d('备注'),
      trueValue: checkedValue,
      falseValue: uncheckedValue,
      defaultValue: uncheckedValue,
    },
    {
      name: 'field6',
      type: FieldType.boolean,
      label: intl.get(`${intlPrefix}.isXieYi`).d('创建供应商账号'),
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
