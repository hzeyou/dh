// import { HG_SRM_API_PREFIX } from '@/utils/config';
import { AxiosRequestConfig } from 'axios';
import { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import { FieldType } from 'choerodon-ui/dataset/data-set/enum';

import { intl } from 'utils/utils';

const intlPrefix = 'srm.supplier.model.supplier';

import { getCurrentOrganizationId } from 'utils/utils';

export const listDSConf = (): DataSetProps => ({
  selection: false,
  pageSize: 20,
  autoQueryAfterSubmit: false,
  autoQuery: true,
  queryFields: [
    {
      name: 'supplierCode',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.supplierCode`).d('供应商编码'),
    },
    {
      name: 'supplierName',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.vendorTypeName`).d('供应商名称'),
    },
    {
      name: 'status',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.typeName`).d('状态'),
      lookupCode: 'SRM.SUPPLIERS_STATUS',
    },
  ],
  fields: [
    {
      name: 'registrationCode',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.registrationCode`).d('注册单号'),
    },
    {
      name: 'statusMeaning',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.statusMeaning`).d('状态'),
    },
    {
      name: 'supplierName',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.supplierName`).d('供应商名称'),
      lookupCode: 'SRM.ACTION.STATUS',
    },
    {
      name: 'supplierCode',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.supplierCode`).d('供应商编码'),
      lookupCode: 'SRM.ACTION.STATUS',
    },
    {
      name: 'levelMeaning',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.levelMeaning`).d('供应商级别'),
    },
    {
      name: 'email',
      type: FieldType.email,
      label: intl.get(`${intlPrefix}.email`).d('供应商邮箱'),
    },
    {
      name: 'remark',
      type: FieldType.email,
      label: intl.get(`${intlPrefix}.remark`).d('备注'),
    },
    {
      name: 'inviterCode',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.inviterCode`).d('邀请人'),
      lookupCode: 'SRM.ACTION.STATUS',
    },
    {
      name: 'creationDateStr',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.creationDateStr`).d('邀请时间'),
    },
  ],
  transport: {
    read: ({ data }): AxiosRequestConfig => {
      return {
        url: `https://test-hzero-gateway.imiracle.tech/hsrm/v1/${getCurrentOrganizationId()}/supplier-registrations`,
        method: 'get',
        data,
      };
    },
  },
});
