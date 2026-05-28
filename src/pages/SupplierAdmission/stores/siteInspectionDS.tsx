import { AxiosRequestConfig } from 'axios';
import DataSet, { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import { FieldIgnore, FieldType } from 'choerodon-ui/dataset/data-set/enum';

import { intl } from 'utils/utils';

const intlPrefix = 'srm.supplier.model.supplier';

const optionsDS = new DataSet({
  data: [
    { meaning: '是', value: '1' },
    { meaning: '否', value: '2' },
  ],
});

export const siteInspectionDSConf = (): DataSetProps => ({
  autoCreate: false,
  primaryKey: 'id',
  idField: 'id',
  selection: false,
  fields: [
    {
      name: 'id',
      type: FieldType.number,
    },
    {
      name: 'categoryCode',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.categoryCode`).d('品类编码'),
      required: true,
      bind: 'categoryLov.supplierId',
    },
    {
      name: 'categoryName',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.categoryName`).d('品类名称'),
      required: true,
      bind: 'categoryLov.supplierName',
    },
    {
      name: 'auditFormNo',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.auditFormNo`).d('现场审核单'),
    },
    {
      name: 'auditDate',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.auditDate`).d('审核日期'),
    },
    {
      name: 'passingScore',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.passingScore`).d('合格分数线'),
    },
    {
      name: 'totalScore',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.totalScore`).d('总评分'),
    },
    {
      name: 'auditResult',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.auditResult`).d('审核结果'),
    },
    {
      name: 'remark',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.remark`).d('备注'),
    },
    {
      name: 'admissionRequirement',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.admissionRequirement`).d('准入要求'),
      required: true,
      options: optionsDS
    },
    {
      name: 'categoryLov',
      type: FieldType.object,
      label: intl.get(`${intlPrefix}.categoryId`).d('品类编码'),
      required: true,
      lovCode: 'SCM.SUPPLIER',
      ignore: FieldIgnore.always,
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

  },
});
