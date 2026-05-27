import { FieldComponentType } from 'hzero-front-apaas/lib/constants/businessObject';
export declare const codeTransfer: (code: string, mappingList: any[], from: string, to: string) => any;
export declare const getTranslateFormulaList: (referenceInfoList: any) => any[];
export declare const replaceFormulaValueToMeaning: (formula?: string, mappingList?: Array<{
    value: string;
    meaning: string;
}>) => string;
export declare const formula2Desc: (formula: any, mappingList: any) => any;
export declare const dataMapTransfer2: (initValue: any, mapList: any, from: any, to: any) => any;
export declare const typeMapConvert: (type: string) => "" | FieldComponentType.SINGLE_SELECT | FieldComponentType.MULTIPLE_SELECT | "FLOAT" | "TEXT_FIELD" | "NUMBER_FIELD" | "DATE_SELECTION_BOX" | "DATETIME_SELECTION_BOX" | "SWITCH";
