import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { DataSetProps } from 'choerodon-ui/dataset/data-set/DataSet';
import { FieldType } from 'choerodon-ui/dataset/data-set/enum';

const organizationId = getCurrentOrganizationId();
const intlPrefix = 'srm.purchase.model';

const ListDSConfig = (): DataSetProps => ({
  selection: false,
  autoQuery: true,
  pageSize: 100,
  queryFields: [
    {
      label: intl.get(`${intlPrefix}.purchaseId`).d('采购单ID'),
      name: 'purchaseId',
      type: FieldType.string,
    },
    {
      label: intl.get(`${intlPrefix}.purchaseCode`).d('采购单号'),
      name: 'purchaseCode',
      type: FieldType.string,
    },
    {
      label: intl.get(`${intlPrefix}.supplierName`).d('供应商名称'),
      name: 'supplierName',
      type: FieldType.string,
    },
  ],
  fields: [
    {
      name: 'purchaseCode',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.purchaseCode`).d('采购单号'),
    },
    {
      name: 'creationDate',
      type: FieldType.date,
      label: intl.get(`${intlPrefix}.creationDate`).d('创建时间'),
    },
    {
      name: 'createdByName',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.createdByName`).d('创建人'),
    },
  ],
  transport: {
    read: () => {
      return {
        url: `${process.env.SRM_DEV_HOST}/hsrm/v1/${organizationId}/purchase`,
        method: 'GET',
      };
    },
  },
  feedback: {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    loadFailed: () => {},
  },
});

export { ListDSConfig };
