import { AxiosRequestConfig } from 'axios';
import DataSet, { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import { FieldIgnore, FieldType } from 'choerodon-ui/dataset/data-set/enum';

import { intl } from 'utils/utils';
import { LovSyncTable } from '@/utils/util';

const intlPrefix = 'srm.supplier.model.supplier';

const typeOptionsDS = new DataSet({data: [ {meaning: '对公', value: '1'}, {meaning: '对私', value: '2'}, ]});
const ticketOptionsDS = new DataSet({data: [ {meaning: '对公', value: '1'}, {meaning: '对私', value: '2'}, ]});


export const bankDSConf = (): DataSetProps => ({
  autoCreate: false,
  fields: [
    {
      name: 'sortCode',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorCode`).d('本地清算号（联行号）'),
      required: true,
      bind: 'lovSortCode.supplierId',
    },
    {
      name: 'swiftCode',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorTypeName`).d('swiftcode'),
      required: true,
    },
    {
      name: 'name',
      type: FieldType.email,
      label: intl.get(`${intlPrefix}.vendorStatus`).d('银行名称'),
      required: true,
    },
    {
      name: 'country',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isRegisterAudit`).d('国家/地区'),
      lookupCode: 'SRM.ACTION.STATUS',
    },
    {
      name: 'account',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isZiZhiAudit`).d('银行账户'),
    },
    {
      name: 'host',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isZiZhiAudit`).d('收款单位全称'),
    },
    {
      name: 'type',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isZiZhiAudit`).d('收款方类型'),
      options: typeOptionsDS,
    },
    {
      name: 'address',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isZiZhiAudit`).d('收款银行地址'),
    },
    {
      name: 'isTicket',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.isZiZhiAudit`).d('是否开票银行'),
      options: ticketOptionsDS,
    },
    {
      name: 'attachment',
      type: FieldType.attachment,
      label: intl.get(`${intlPrefix}.isZiZhiAudit`).d('银行信息盖章附件'),
      required: true,
    },
    {
      name: 'lovSortCode',
      type: FieldType.object,
      label: intl.get(`${intlPrefix}.isZiZhiAudit`).d('银行信息盖章附件'),
      required: true,
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
