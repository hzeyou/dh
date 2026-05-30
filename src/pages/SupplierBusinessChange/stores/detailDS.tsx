import { AxiosRequestConfig } from 'axios';
import { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import { FieldIgnore, FieldType } from 'choerodon-ui/dataset/data-set/enum';

import { intl } from 'utils/utils';
import {
  billTypeOptionsDS,
  exitTypeOptionsDS,
  HG_SRM_API_PREFIX,
} from '@/utils/config';

const intlPrefix = 'srm.supplier.model.supplier';

interface BusinessChangeDetailItem {
  supplierId?: number;
  supplierCode?: string;
  supplierName?: string;
  supplierType?: string;
  supplierTypeId?: string;
  level?: string;
  categoryLevel?: string;
  supplyCodeLov?: Record<string, unknown>;
  [key: string]: unknown;
}

const transformBusinessChangeDetail = (value: unknown) => {
  if (!Array.isArray(value)) return [];

  return value.map((item: BusinessChangeDetailItem) => ({
    ...item,
    supplyCodeLov: {
      supplierId: item.supplierId,
      supplierCode: item.supplierCode,
      supplierName: item.supplierName,
      supplierType: item.supplierType || item.supplierTypeId,
      supplierTypeId: item.supplierTypeId,
      supplierLevel: item.level || item.categoryLevel,
    },
  }));
};

export const detailDSConf = (): DataSetProps => ({
  autoCreate: true,
  primaryKey: 'changeId',
  idField: 'changeId',
  fields: [
    {
      name: 'changeId',
      type: FieldType.number,
    },
    {
      name: 'businessChangeNo',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.businessChangeNo`).d('业务变更单号'),
    },
    {
      name: 'changeCode',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.businessChangeNo`).d('业务变更单号'),
    },
    {
      name: 'type',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.type`).d('单据类型'),
      required: true,
      options: billTypeOptionsDS,
    },
    {
      name: 'exitType',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.exitType`).d('退出类型'),
      options: exitTypeOptionsDS,
      dynamicProps: {
        required: ({ record }) => record?.get('type') === '3',
      },
    },
    {
      name: 'startDate',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.startDate`).d('冻结开始日期'),
      bind: 'startEndDate.start',
    },
    {
      name: 'endDate',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.endDate`).d('冻结结束日期'),
      bind: 'startEndDate.end',
    },
    {
      name: 'startEndDate',
      type: FieldType.date,
      label: intl.get(`${intlPrefix}.startEndDate`).d('冻结周期'),
      ignore: FieldIgnore.always,
      range: ['start', 'end'],
      dynamicProps: {
        required: ({ record }) => record?.get('type') === '1',
      },
    },
    {
      name: 'applicant',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.applicant`).d('申请人'),
    },
    {
      name: 'createdByName',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.applicant`).d('申请人'),
    },
    {
      name: 'remark',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.remark`).d('申请说明'),
    },
    {
      name: 'attachment',
      type: FieldType.attachment,
      label: intl.get(`${intlPrefix}.attachment`).d('附件上传'),
    },
    {
      name: 'admissionCategoryId',
      type: FieldType.number,
      label: intl.get(`${intlPrefix}.admissionCategoryId`).d('准入品类ID'),
    },
    {
      name: 'businessChangeDetail',
      type: FieldType.object,
      label: intl.get(`${intlPrefix}.businessChangeDetail`).d('业务变更明细'),
      transformResponse: transformBusinessChangeDetail,
    },
  ],
  transport: {
    read: ({ dataSet }): AxiosRequestConfig => {
      const changeId = dataSet?.getState('changeId');
      return {
        url: `${HG_SRM_API_PREFIX}/supplier-business-changes/${changeId}`,
        method: 'get',
      };
    },
    submit: ({ data }): AxiosRequestConfig => ({
      url: `${HG_SRM_API_PREFIX}/supplier-business-changes/save`,
      method: 'post',
      data: data[0],
    }),
  },
  events: {
    load: ({ dataSet }) => {
      const supplyCategoryDS = dataSet.getState('supplyCategoryDS');
      const businessChangeDetail = dataSet.current?.get('businessChangeDetail');

      const list = Array.from(businessChangeDetail);

      if (!supplyCategoryDS || !Array.isArray(list)) return;

      supplyCategoryDS.loadData(list);
    },
  },
});
