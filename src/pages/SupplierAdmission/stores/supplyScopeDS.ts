import { AxiosRequestConfig } from 'axios';
import DataSet, { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import { FieldIgnore, FieldType } from 'choerodon-ui/dataset/data-set/enum';

import { intl } from 'utils/utils';
import { LovSyncTable } from '@/utils/util';

const intlPrefix = 'srm.supplier.model.supplier';


export const supplyScopeDSConf = (): DataSetProps => ({
  autoCreate: false,
  fields: [
    {
      name: 'categoryId',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.categoryId`).d('品类编码'),
      required: true,
      bind: 'lovSortCode.supplierId',
    },
    {
      name: 'categoryName',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.categoryName`).d('品类名称'),
      required: true,
    },
    {
      name: 'status',
      type: FieldType.email,
      label: intl.get(`${intlPrefix}.status`).d('准入状态'),
      required: true,
    },
    {
      name: 'categoryLevel',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.categoryLevel`).d('供应商等级'),
    },
  ],
  events: {
    remove: ({dataSet}) => {
      const lovDS = dataSet.getState('lovDS');
      LovSyncTable.delete(dataSet, lovDS, 'lovSortCode');
    }
  },
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
});
