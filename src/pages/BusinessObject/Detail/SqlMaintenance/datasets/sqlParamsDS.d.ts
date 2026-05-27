import { MutableRefObject } from 'react';
import { DataSetProps } from 'choerodon-ui/pro/lib/data-set/DataSet';
import { SqlParamsDsRef } from '../index';
export declare enum SQL_SOURCE_TYPE {
    AUTO = "AUTO",
    CUSTOM = "CUSTOM"
}
export declare enum SQL_PARAM_CATEGORY {
    FIELD_PARAM = "FIELD_PARAM",
    QUERY_PARAM = "QUERY_PARAM"
}
export declare enum SQL_PARAMS_FN {
    CODE = "paramCode",
    NAME = "paramName",
    TYPE = "paramType",
    MAX_LENGTH = "maxLength",
    DECIMAL_DIGITS = "decimalDigits",
    PRIMARY_FLAG = "primaryFlag",
    SOURCE_TYPE = "sourceType",
    PARAM_CATEGORY = "paramCategory",
    ENCRYPT_FLAG = "encryptFlag"
}
export declare const SqlParamsState: {
    fieldCodes: string;
};
declare const sqlParamsDS: (sqlDsRef: MutableRefObject<SqlParamsDsRef | null>) => DataSetProps;
export default sqlParamsDS;
