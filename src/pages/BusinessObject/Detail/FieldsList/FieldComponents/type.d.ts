export interface ICustomOptionList {
    value: string | number;
    orderSeq?: number;
    meaning: IMeaning;
}
export interface IMeaning {
    en_US: string;
    zh_CN: string;
}
export interface IValuesListProps {
    operationColumnHidden: boolean;
    readonlyFields: string[];
}
