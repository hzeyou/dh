import { DataSetProps } from 'choerodon-ui/pro/lib/data-set/DataSet';
import { FieldType } from 'choerodon-ui/pro/lib/data-set/enum';
export declare const leftListDataSet: (businessObjectId: any, objVersionKey?: any) => DataSetProps;
export declare enum DetailDataSetFN {
    API_TYPE = "apiType",
    API_OBJ = "apiObj",
    API_SERVICE_CODE = "apiServiceCode",
    INTERFACE_NAME = "interfaceName",
    INTERFACE_CODE = "interfaceCode",
    INTERFACE_URL = "interfaceUrl",
    REQUEST_METHOD = "requestMethod",
    REMARK = "remark",
    API_ID = "apiId",
    API_NAME = "apiName"
}
export declare const detailDataSet: (businessObjectId: any, objVersionKey?: any) => DataSetProps;
export declare const paramsAllDataSet: () => DataSetProps;
export declare const getApiFieldDataSet: () => DataSetProps;
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
export declare const paramsTableDataSet: (interfaceType?: any, type?: any) => DataSetProps;
export declare const objectFieldListDataSet: (businessObjectId: any) => {
    autoCreate: boolean;
    autoQuery: boolean;
    paging: boolean;
    fields: {
        name: string;
        type: FieldType;
    }[];
    transport: {
        read: ({ params }: {
            params: any;
        }) => {
            url: string;
            method: string;
            params: any;
        };
    };
};
export declare const addFieldADataSet: () => DataSetProps;
