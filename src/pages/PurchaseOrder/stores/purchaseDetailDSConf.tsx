import { AxiosRequestConfig } from 'axios';
import DataSet, { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import { FieldType, FieldIgnore } from 'choerodon-ui/dataset/data-set/enum';

import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { poLineDSConf } from '@/pages/PurchaseOrder/stores/poLineDSConf';
const organizationId = getCurrentOrganizationId();
const BASE_URL = `${process.env.SRM_DEV_HOST}/hsrm/v1/${organizationId}/purchase`;

export const purchaseDetailDSConf = (): DataSetProps => ({
  autoCreate: true,
  primaryKey: 'purchaseId',
  children: {
    dtlList: new DataSet(poLineDSConf())
  },
  fields: [
    {
      name: 'purchaseId',
      type: FieldType.number,
      label: intl.get('srm.model.purchaseId').d('采购单ID'),
    },
    {
      name: 'purchaseCode',
      type: FieldType.string,
      label: intl.get('srm.model.purchaseId').d('采购单编号'),
    },
    {
      name: 'supplierLov',
      type: FieldType.object,
      label: intl.get('srm.model.supplierName').d('供应商名称'),
      ignore: FieldIgnore.always,
      lovCode: 'SRM.COMMON.SUPPLIER_LIST',
      textField: 'supplierName',
      valueField: 'supplierId',
    },
    {
      name: 'supplierName',
      type: FieldType.string,
      label: intl.get('srm.model.supplierName').d('供应商名称'),
      required: true,
      bind: 'supplierLov.supplierName',
    },
    {
      name: 'supplierId',
      type: FieldType.string,
      label: intl.get('srm.model.supplierName').d('供应商ID'),
      required: true,
      bind: 'supplierLov.supplierId',
    },
  ],
  transport: {
    read: ({dataSet}): AxiosRequestConfig => {
      const purchaseId = dataSet?.getState('purchaseId');
      return {
        url: BASE_URL + `/id/${purchaseId}`,
        method: 'GET',
      };
    },
    submit: ({ dataSet, params, data }): AxiosRequestConfig => {
      return {
        url: BASE_URL,
        method: 'POST',
        data,
      };
    },
  }
});
