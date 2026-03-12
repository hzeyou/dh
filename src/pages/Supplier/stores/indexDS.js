import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';

const organizationId = getCurrentOrganizationId();
const intlPrefix = 'srm.supplier.model';

const ListDS = () => ({
  selection: false,
  autoQuery: true,
  pageSize: 100,
  queryFields: [
    {
      label: intl.get(`${intlPrefix}.supplierCode`).d('供应商编码'),
      name: 'supplierCode',
      type: 'string',
    },
    {
      label: intl.get(`${intlPrefix}.supplierName`).d('供应商名称'),
      name: 'supplierName',
      type: 'string',
    },
    {
      label: intl.get(`${intlPrefix}.supplierShortName`).d('供应商简称'),
      name: 'supplierShortName',
      type: 'string',
    },
    {
      name: 'enabledFlag',
      type: 'string',
      label: intl.get(`${intlPrefix}.enabledFlag`).d('有效'),
      // trueValue: 1,
      // falseValue: 0,
      lookupCode: 'HPFM.FLAG'
    },
  ],
  fields: [
    {
      label: intl.get(`${intlPrefix}.supplierCode`).d('供应商编码'),
      name: 'supplierCode',
      type: 'string',
    },
    {
      label: intl.get(`${intlPrefix}.supplierName`).d('供应商名称'),
      name: 'supplierName',
      type: 'string',
    },
    {
      label: intl.get(`${intlPrefix}.supplierShortName`).d('供应商简称'),
      name: 'supplierShortName',
      type: 'string',
    },
    {
      name: 'unifiedSocialCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.unifiedSocialCode`).d('社会信用代码'),
    },
    {
      name: 'supplierType',
      type: 'string',
      label: intl.get(`${intlPrefix}.supplierType`).d('供应商类型'),
      lookupCode: 'SRM.SUPPLIER_TYPE', //todo 待配置
    },
    {
      name: 'supplierLevel',
      type: 'string',
      label: intl.get(`${intlPrefix}.supplierLevel`).d('供应商级别'),
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${intlPrefix}.enabledFlag`).d('有效'),
      trueValue: 1,
      falseValue: 0,
    },
    {
      name: 'creationDate',
      type: 'dateTime',
      label: intl.get(`${intlPrefix}.creationDate`).d('创建时间'),
    },
    {
      name: 'createdByName',
      type: 'string',
      label: intl.get(`${intlPrefix}.createdByName`).d('创建人'),
    },
    {
      name: 'lastUpdateDate',
      type: 'dateTime',
      label: intl.get(`${intlPrefix}.lastUpdateDate`).d('更新时间'),
    },
    {
      name: 'lastUpdatedByName',
      type: 'string',
      label: intl.get(`${intlPrefix}.lastUpdatedByName`).d('更新人'),
    },
  ],
  transport: {
    read: () => {
      return {
        url: `${process.env.SRM_DEV_HOST}/hsrm/v1/${organizationId}/suppliers`,
        method: 'GET',
      };
    },
  },
  feedback: {
    loadFailed: () => {},
  },
});

export { ListDS };
