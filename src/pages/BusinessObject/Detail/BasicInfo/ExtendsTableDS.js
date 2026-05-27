import intl from 'utils/intl';
import { HZERO_HMDE } from "hzero-front-apaas/lib/utils/config";
import { lowcodeOrganizationURL } from "hzero-front-hmde/lib/utils/common";
import { isTenantRoleLevel } from 'utils/utils';
export default (() => ({
  autoQuery: true,
  selection: 'single',
  fields: [{
    name: 'id',
    type: 'string'
  }, {
    name: 'name',
    type: 'string',
    label: intl.get('hmde.bo.businessObject.extendsTable.name').d('表名')
  }, {
    name: 'serviceCode',
    type: 'string',
    label: intl.get('hmde.pd.nodeClassification.serviceCode').d('服务编码')
  }, {
    name: 'schemaName',
    type: 'string',
    label: intl.get('hmde.common.label.dataBaseName').d('数据库名称')
  }, {
    name: 'dataSourceType',
    label: intl.get('hmde.bo.businessObject.serviceCode.dataSourceType').d('数据库类型'),
    type: 'string'
  }],
  queryFields: [{
    name: 'name',
    type: 'string',
    label: intl.get('hmde.bo.businessObject.extendsTable.name').d('表名')
  }],
  transport: {
    read: ({
      data
    }) => {
      return {
        url: isTenantRoleLevel() ? `${lowcodeOrganizationURL({
          route: HZERO_HMDE
        })}/business-objects/table/page?lovCode=HMDE.BUSINESS_OBJECT.REF_TABLE` : `${lowcodeOrganizationURL({
          route: HZERO_HMDE
        })}/business-objects/table/page?lovCode=HMDE.BUSINESS_OBJECT.TABLE.SITE`,
        method: 'GET',
        data: {
          ...data,
          tableCategoryList: 'STANDARD,REDUNDANT_INHERIT,REDUNDANT_X',
          tableTypeList: 'POSITIVE,REVERSE'
        }
      };
    }
  }
}));