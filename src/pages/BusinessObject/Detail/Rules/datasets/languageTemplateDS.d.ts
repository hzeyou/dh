import { DataSetProps } from 'choerodon-ui/pro/lib/data-set/DataSet';
export declare enum FN {
    ERROR_INFO = "errorInfo",
    TYPE = "type",
    RESPONSE_MESSAGES = "responseMessages"
}
declare const languageTemplateDS: (supportLanguage?: any[], codeBefore?: string) => DataSetProps;
export default languageTemplateDS;
