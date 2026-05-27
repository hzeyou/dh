import React from 'react';
import { DataSet } from 'choerodon-ui/pro';
import { modalChildrenProps } from 'choerodon-ui/pro/lib/modal/interface';
export declare enum ParamsTableFN {
    PARAMS_NAME = "paramName",
    PARAMS_REMARK = "paramDescription",
    REQUIRE_TYPE = "paramType",
    MAN_LENGTH = "maxLength",
    DECIMALS = "decimalDigits",
    IS_REQUIRED = "requiredFlag",
    BEHAVIOR = "paramBehavior",
    API_BEHAVIOR = "apiBehavior",
    PRIMARY_KEY = "primaryFlag",
    PARAMS_MAP = "businessObjectFieldId"
}
interface Props {
    baseInfoDS: DataSet;
    modal?: modalChildrenProps;
    listTableDS: DataSet;
}
declare const _default: React.FunctionComponent<Props>;
export default _default;
