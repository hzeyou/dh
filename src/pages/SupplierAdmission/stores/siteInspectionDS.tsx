import { AxiosRequestConfig } from 'axios';
import { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import { FieldType } from 'choerodon-ui/dataset/data-set/enum';

import { intl } from 'utils/utils';

const intlPrefix = 'srm.supplier.model.supplier';
const admissionRulePrefix = `${intlPrefix}.admissionRule`;
const checkedValue = '是';
const uncheckedValue = '否';

export const siteInspectionDSConf = (): DataSetProps => ({
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
      label: intl.get(`${intlPrefix}.vendorCode`).d('品类编码'),
      required: true,
    },
    {
      name: 'field2',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorTypeName`).d('品类名称'),
      required: true,
    },
    {
      name: 'field3',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorStatus`).d('现场审核单'),
      lookupCode: 'SRM.ACTION.STATUS',
      required: true,
    },
    {
      name: 'field4',
      type: FieldType.boolean,
      label: intl.get(`${intlPrefix}.isRegisterAudit`).d('审核日期'),
    },
    {
      name: 'field5',
      type: FieldType.boolean,
      label: intl.get(`${intlPrefix}.isZiZhiAudit`).d('合格分数线'),
    },
    {
      name: 'field6',
      type: FieldType.boolean,
      label: intl.get(`${intlPrefix}.isXieYi`).d('总评分'),
    },
    {
      name: 'field7',
      type: FieldType.boolean,
      label: intl.get(`${intlPrefix}.isXieYi`).d('审核结果'),
    },
    {
      name: 'field8',
      type: FieldType.boolean,
      label: intl.get(`${intlPrefix}.isXieYi`).d('备注'),
    },
    {
      name: 'field9',
      type: FieldType.boolean,
      label: intl.get(`${intlPrefix}.isXieYi`).d('准入要求'),
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
