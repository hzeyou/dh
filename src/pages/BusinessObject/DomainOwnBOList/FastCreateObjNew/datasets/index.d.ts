import { DataSetProps } from 'choerodon-ui/pro/lib/data-set/DataSet';
declare type TformDatasetProps = ({ domainCode, extendTableEnabledFlag, extendTableSuffix, serviceCode, }: {
    domainCode: string;
    extendTableEnabledFlag: boolean;
    serviceCode: string;
    extendTableSuffix: string;
}) => DataSetProps;
declare const formDatasetProps: TformDatasetProps;
export { formDatasetProps };
