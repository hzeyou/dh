import { AxiosRequestConfig } from 'axios';
import DataSet, { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import { FieldIgnore, FieldType } from 'choerodon-ui/dataset/data-set/enum';

import { intl } from 'utils/utils';

const intlPrefix = 'srm.supplier.model.supplier';
const admissionRulePrefix = `${intlPrefix}.admissionRule`;
const checkedValue = '是';
const uncheckedValue = '否';

const typeOptionsDS = new DataSet({
  data: [
    { meaning: '供应商准入', value: '1' },
    { meaning: '品类扩充', value: '2' },
  ],
});

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
      name: 'admissionCode',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.supplierCode`).d('准入及品类扩充单号'),
    },
    {
      name: 'lovSupplierCode',
      type: FieldType.object,
      label: intl.get(`${intlPrefix}.supplierCode`).d('供应商编码'),
      lovCode: 'SCM.SUPPLIER',
      textField: 'supplierShortName',
      valueField: 'supplierCode',
      ignore: FieldIgnore.always,
    },
    {
      name: 'supplierCode',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.supplierCode`).d('供应商编码'),
      bind: 'lovSupplierCode.supplierCode',
    },
    {
      name: 'supplierName',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.supplierName`).d('供应商名称'),
      bind: 'lovSupplierCode.supplierName',
      required: true,
    },
    {
      name: 'supplierTypeId',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.supplierTypeId`).d('供应商类型'),
      bind: 'lovSupplierCode.supplierType',
      required: true,
    },
    {
      name: 'status',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorStatus`).d('当前生命周期阶段'),
      bind: 'lovSupplierCode.status',
    },
    {
      name: 'type',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.type`).d('单据类型'),
      options: typeOptionsDS,
    },
    {
      name: 'developmentPurpose',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.developmentPurpose`).d('开发供应商目的'),
    },
    {
      name: 'supplierProfile',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.supplierProfile`).d('供应商基本情况描述'),
    },
    {
      name: 'factoryAuditBackground',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.factoryAuditBackground`).d('审厂背景'),
    },
    {
      name: 'remark',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.remark`).d('备注'),
    },
    {
      name: 'meetingMinutes',
      type: FieldType.attachment,
      label: intl.get(`${intlPrefix}.meetingMinutes`).d('供应商评审会议纪要'),
    },
    {
      name: 'attachment',
      type: FieldType.attachment,
      label: intl.get(`${intlPrefix}.attachment`).d('附件'),
    },

    {
      name: 'inspectionInfo',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.inspectionInfo`).d('现场审核信息'),
    },

    {
      name: 'agreementInfo',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.agreementInfo`).d('协议管理信息'),
    },

  ],
  data: [{lovSupplierCode: {supplierCode: '100073', supplierShortName: '麦丰'}}],
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
