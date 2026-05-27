import _DataSet from "choerodon-ui/pro/lib/data-set";
// 自定义组件依赖查询
import intl from 'utils/intl';
import { FieldType } from 'choerodon-ui/dataset/data-set/enum';
import { isTenantRoleLevel } from 'utils/utils';
import { lowcodeOrganizationURL } from "hzero-front-apaas/lib/utils/common";
import { HZERO_HLOD } from "hzero-front-apaas/lib/utils/config";
const isTenant = isTenantRoleLevel();
export let FN = /*#__PURE__*/function (FN) {
  FN["PAGE_NAME"] = "pageName";
  FN["FUNCTION_NAME"] = "functionName";
  FN["MODULE_NAME"] = "moduleName";
  FN["DOMAIN_NAME"] = "domainName";
  FN["DOMAIN_CODE"] = "domainCode";
  FN["TENANT_NAME"] = "tenantName";
  FN["TENANT_ID"] = "tenantId";
  FN["PLATFORM"] = "platform";
  FN["PAGETYPE"] = "pageType";
  FN["RULECODE"] = "ruleCode";
  FN["BELONG_TENANT_ID"] = "belongTenantId";
  return FN;
}({});
export let DesignerMode = /*#__PURE__*/function (DesignerMode) {
  DesignerMode["pc"] = "PC";
  DesignerMode["mobile"] = "MOBILE";
  return DesignerMode;
}({}); // 移动端
export let EPageType = /*#__PURE__*/function (EPageType) {
  EPageType["PageSelect"] = "PageSelect";
  EPageType["PageDesigner"] = "PageDesigner";
  EPageType["UIPageDesigner"] = "UIPageDesigner";
  EPageType["PageEventFlow"] = "PageEventFlow";
  EPageType["MobilePageEventFlow"] = "MobilePageEventFlow";
  EPageType["Mobile"] = "Mobile";
  return EPageType;
}({}); // 移动端设计器
const DSConfig = () => ({
  autoQuery: false,
  selection: false,
  queryFields: [{
    label: intl.get(`hmde.bo.view.message.pageName`).d('页面名称'),
    name: FN.PAGE_NAME,
    type: "string"
  }, {
    label: intl.get(`hmde.bo.view.message.functionName`).d('功能名称'),
    name: FN.FUNCTION_NAME,
    type: "string"
  }, {
    label: intl.get(`hmde.bo.view.message.domainName`).d('所属领域'),
    name: FN.DOMAIN_CODE,
    type: "object",
    lovCode: isTenant ? 'HMDE.DOMAIN' : 'HMDE.DOMAIN.SITE',
    transformRequest: value => {
      return value === null || value === void 0 ? void 0 : value.domainCode;
    }
  }, {
    label: intl.get(`hmde.bo.view.message.pageType`).d('来源'),
    name: FN.PAGETYPE,
    type: "string",
    lookupCode: 'HLOD_PAGE_TYPE'
  }, {
    label: intl.get(`hmde.bo.view.message.ruleCode`).d('个性化规则'),
    name: FN.RULECODE,
    type: "string"
  }, !isTenant && {
    label: intl.get(`hmde.common.tenant`).d('所属租户'),
    name: FN.BELONG_TENANT_ID,
    type: "object",
    textField: 'tenantName',
    lovCode: 'HPFM.TENANT',
    transformRequest: value => {
      return value === null || value === void 0 ? void 0 : value.tenantId;
    }
  }, {
    label: intl.get(`hmde.bo.view.message.platform`).d('页面类别'),
    name: FN.PLATFORM,
    type: "string",
    options: new _DataSet({
      paging: false,
      data: [{
        value: 'PC',
        meaning: 'PC端'
      }, {
        value: 'MOBILE',
        meaning: '移动端'
      }]
    })
  }].filter(Boolean),
  fields: [{
    label: intl.get(`hmde.bo.view.message.pageName`).d('页面名称'),
    name: FN.PAGE_NAME,
    type: "string"
  }, {
    label: intl.get(`hmde.bo.view.message.functionName`).d('功能名称'),
    name: FN.FUNCTION_NAME,
    type: "string"
  }, {
    label: intl.get(`hmde.bo.view.message.moduleName`).d('模块名称'),
    name: FN.MODULE_NAME,
    type: "string"
  }, {
    label: intl.get(`hmde.bo.view.message.domainName`).d('所属领域'),
    name: FN.DOMAIN_NAME,
    type: "string"
  }, {
    label: intl.get(`hmde.bo.view.message.platform`).d('页面类别'),
    name: FN.PLATFORM,
    type: "string",
    options: new _DataSet({
      paging: false,
      data: [{
        value: 'PC',
        meaning: 'PC端'
      }, {
        value: 'MOBILE',
        meaning: '移动端'
      }]
    })
  }, {
    label: intl.get(`hmde.common.tenant`).d('所属租户'),
    name: FN.TENANT_NAME,
    type: "string"
  }, {
    label: intl.get(`hmde.bo.view.message.pageType`).d('来源'),
    name: FN.PAGETYPE,
    type: "string",
    lookupCode: 'HLOD_PAGE_TYPE'
  }, {
    label: intl.get(`hmde.bo.view.message.ruleCode`).d('个性化规则'),
    name: FN.RULECODE,
    type: "string"
  }].filter(Boolean),
  transport: {
    read: props => {
      const dataSet = props.dataSet,
        params = props.params;
      const body = dataSet === null || dataSet === void 0 ? void 0 : dataSet.getState('params');
      return {
        url: `${lowcodeOrganizationURL({
          route: HZERO_HLOD
        })}/pages/single-component-template/depends-query`,
        method: 'GET',
        params: {
          ...body,
          ...params
        }
      };
    }
  }
});
export default DSConfig;