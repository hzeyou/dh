import { AxiosRequestConfig } from 'axios';
import { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import { FieldType } from 'choerodon-ui/dataset/data-set/enum';

import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { DataSet } from 'choerodon-ui/pro';
const organizationId = getCurrentOrganizationId();
const BASE_URL = `${process.env.SRM_DEV_HOST}/hsrm/v1/${organizationId}/purchase`;

export const poLineDSConf = (): DataSetProps => ({
  forceValidate: true,
  pageSize: 100,
  fields: [
    {
      name: 'id',
      type: FieldType.number,
      label: intl.get('srm.model.purchaseDtlId').d('明细ID'),
    },
    {
      name: 'productName',
      bind: 'productsLov.productName',
      label: intl.get('srm.model.productName').d('货品名称'),
      required: true,
      type: FieldType.string,
    },
    {
      name: 'productId',
      bind: 'productsLov.productId',
      label: intl.get('srm.model.productId').d('货品ID'),
      type: FieldType.number,
      required: true,
    },
    {
      name: 'orderQty',
      type: FieldType.string,
      label: intl.get('srm.model.orderQty').d('订单数量'),
      required: true,
      step: 1,
    }
  ],
  transport: {
    read: ({ dataSet }): AxiosRequestConfig => {
      console.log('dataSet:', dataSet);
      const purchaseId = dataSet?.getState('purchaseId');
      console.log('poDetail:', purchaseId);
      return {
        url: `${BASE_URL}/detail`,
        method: 'get',
      };
    },

  },
});
