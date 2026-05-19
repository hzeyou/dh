import { AxiosRequestConfig } from 'axios';
import DataSet, { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import { FieldIgnore, FieldType } from 'choerodon-ui/dataset/data-set/enum';

import { intl } from 'utils/utils';
import { LovSyncTable } from '@/utils/util';

const intlPrefix = 'srm.supplier.model.supplier';

const typeOptionsDS = new DataSet({data: [ {meaning: '对公', value: '1'}, {meaning: '对私', value: '2'}, ]});
const ticketOptionsDS = new DataSet({data: [ {meaning: '对公', value: '1'}, {meaning: '对私', value: '2'}, ]});


export const supplyScopeDSConf = (): DataSetProps => ({
  autoCreate: false,
  fields: [
    {
      name: 'field1',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorCode`).d('供应商编码'),
      required: true,
      bind: 'lovSortCode.supplierId',
    },
    {
      name: 'field2',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorTypeName`).d('供应商名称'),
      required: true,
    },
    {
      name: 'field3',
      type: FieldType.email,
      label: intl.get(`${intlPrefix}.vendorStatus`).d('供应商类型'),
      required: true,
    },
    {
      name: 'field4',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isRegisterAudit`).d('品类'),
      lookupCode: 'SRM.ACTION.STATUS',
    },
    {
      name: 'field5',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isZiZhiAudit`).d('供应商等级'),
    },
    {
      name: 'field6',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isZiZhiAudit`).d('原因'),
    },
    {
      name: 'field7',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isZiZhiAudit`).d('备注'),
      options: typeOptionsDS,
    },
    {
      name: 'field8',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isZiZhiAudit`).d('上传文件'),
    },
    {
      name: 'lovSortCode',
      type: FieldType.object,
      label: intl.get(`${intlPrefix}.isZiZhiAudit`).d('新建'),
      ignore: FieldIgnore.always,
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
