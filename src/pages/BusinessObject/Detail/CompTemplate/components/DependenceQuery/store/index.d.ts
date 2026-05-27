import { DataSetProps } from 'choerodon-ui/pro/lib/data-set/DataSet';
export declare enum FN {
    PAGE_NAME = "pageName",
    FUNCTION_NAME = "functionName",
    MODULE_NAME = "moduleName",
    DOMAIN_NAME = "domainName",
    DOMAIN_CODE = "domainCode",
    TENANT_NAME = "tenantName",
    TENANT_ID = "tenantId",
    PLATFORM = "platform",
    PAGETYPE = "pageType",
    RULECODE = "ruleCode",
    BELONG_TENANT_ID = "belongTenantId"
}
export declare enum DesignerMode {
    pc = "PC",
    mobile = "MOBILE"
}
export declare enum EPageType {
    PageSelect = "PageSelect",
    PageDesigner = "PageDesigner",
    UIPageDesigner = "UIPageDesigner",
    PageEventFlow = "PageEventFlow",
    MobilePageEventFlow = "MobilePageEventFlow",
    Mobile = "Mobile"
}
declare const DSConfig: () => DataSetProps;
export default DSConfig;
