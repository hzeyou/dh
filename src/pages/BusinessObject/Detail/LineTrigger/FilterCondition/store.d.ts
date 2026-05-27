import { DataSetProps } from 'choerodon-ui/pro/lib/data-set/DataSet';
export declare enum FILTER_CONDITION_FN {
    ORDER_SEQ = "orderSeq",
    VARIABLE_TYPE = "leftValueType",
    VARIABLE = "leftValue",
    VARIABLE_VALUE = "leftDrillExpression",
    OPERATOR_TYPE = "operatorType",
    VALUE_TYPE = "rightValueType",
    VALUE = "rightValue",
    RIGHT_VALUE = "rightDrillExpression",
    COMPONENT_TYPE = "componentType",
    LEFT_EXPRESS_NAME = "leftExpressName",
    LEFT_EXPRESS_TYPE = "leftExpressType",
    RIGHT_EXPRESS_NAME = "rightExpressName"
}
export declare const filterConditionDs: () => DataSetProps;
export declare const relationDs: (filterDs: any) => DataSetProps;
