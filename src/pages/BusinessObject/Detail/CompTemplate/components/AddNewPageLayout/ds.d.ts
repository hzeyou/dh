import { DataSet } from 'choerodon-ui/pro';
import { DataSetProps } from 'choerodon-ui/pro/lib/data-set/DataSet';
export declare const codeHandle: (code: any) => string;
export declare const PlatformDS: () => DataSetProps;
export declare const PublishPageDS: (businessObjectCode: any, domainId: any) => {
    transport: {
        read: ({ params }: {
            params: any;
        }) => {
            url: string;
            method: string;
            headers: {
                'domain-id': any;
            };
            params: any;
        };
    };
    fields: {
        name: string;
        label: string;
        type: string;
    }[];
    queryFields: ({
        name: string;
        label: string;
        type: string;
        options?: undefined;
    } | {
        name: string;
        type: string;
        label: string;
        options: DataSet;
    })[];
};
export declare const TemplatePageDS: (businessObjectCode: any, domainId: any) => {
    autoCreate: boolean;
    fields: ({
        name: string;
        label: string;
        type: string;
        required: boolean;
        maxLength: number;
        format?: undefined;
        validator?: undefined;
    } | {
        name: string;
        label: string;
        required: boolean;
        maxLength: number;
        format: string;
        validator: (value: any, nu: any, record: any) => Promise<any>;
        type?: undefined;
    } | {
        name: string;
        label: string;
        maxLength: number;
        type?: undefined;
        required?: undefined;
        format?: undefined;
        validator?: undefined;
    })[];
};
declare const _default: (businessObjectCode: any, domainId: any, isEdit: any) => {
    autoQuery: boolean;
    autoCreate: boolean;
    paging: boolean;
    selection: boolean;
    fields: ({
        name: string;
        type: string;
        label: string;
        required?: undefined;
        maxLength?: undefined;
        lookupCode?: undefined;
        defaultValue?: undefined;
        dynamicProps?: undefined;
        help?: undefined;
        lookupAxiosConfig?: undefined;
        trueValue?: undefined;
        falseValue?: undefined;
        options?: undefined;
    } | {
        name: string;
        label: string;
        type: string;
        required: boolean;
        maxLength: number;
        lookupCode?: undefined;
        defaultValue?: undefined;
        dynamicProps?: undefined;
        help?: undefined;
        lookupAxiosConfig?: undefined;
        trueValue?: undefined;
        falseValue?: undefined;
        options?: undefined;
    } | {
        name: string;
        label: string;
        required: boolean;
        maxLength: number;
        type?: undefined;
        lookupCode?: undefined;
        defaultValue?: undefined;
        dynamicProps?: undefined;
        help?: undefined;
        lookupAxiosConfig?: undefined;
        trueValue?: undefined;
        falseValue?: undefined;
        options?: undefined;
    } | {
        name: string;
        type: string;
        label: string;
        lookupCode: string;
        required: boolean;
        defaultValue: string;
        maxLength?: undefined;
        dynamicProps?: undefined;
        help?: undefined;
        lookupAxiosConfig?: undefined;
        trueValue?: undefined;
        falseValue?: undefined;
        options?: undefined;
    } | {
        name: string;
        type: string;
        label: string;
        dynamicProps: {
            required: ({ record }: {
                record: any;
            }) => boolean;
        };
        help: string;
        required?: undefined;
        maxLength?: undefined;
        lookupCode?: undefined;
        defaultValue?: undefined;
        lookupAxiosConfig?: undefined;
        trueValue?: undefined;
        falseValue?: undefined;
        options?: undefined;
    } | {
        name: string;
        type: string;
        label: string;
        dynamicProps: {
            required: ({ record }: {
                record: any;
            }) => boolean;
        };
        lookupAxiosConfig: {
            url: string;
            method: string;
            params: {
                'HLOD.BUSINESS_COMPONENT.DOMAIN': string;
            };
            transformResponse(res: any): any;
        };
        help: string;
        required?: undefined;
        maxLength?: undefined;
        lookupCode?: undefined;
        defaultValue?: undefined;
        trueValue?: undefined;
        falseValue?: undefined;
        options?: undefined;
    } | {
        name: string;
        label: string;
        maxLength: number;
        type?: undefined;
        required?: undefined;
        lookupCode?: undefined;
        defaultValue?: undefined;
        dynamicProps?: undefined;
        help?: undefined;
        lookupAxiosConfig?: undefined;
        trueValue?: undefined;
        falseValue?: undefined;
        options?: undefined;
    } | {
        name: string;
        type: string;
        label: string;
        trueValue: boolean;
        falseValue: boolean;
        required?: undefined;
        maxLength?: undefined;
        lookupCode?: undefined;
        defaultValue?: undefined;
        dynamicProps?: undefined;
        help?: undefined;
        lookupAxiosConfig?: undefined;
        options?: undefined;
    } | {
        name: string;
        type: string;
        label: string;
        options: DataSet;
        required?: undefined;
        maxLength?: undefined;
        lookupCode?: undefined;
        defaultValue?: undefined;
        dynamicProps?: undefined;
        help?: undefined;
        lookupAxiosConfig?: undefined;
        trueValue?: undefined;
        falseValue?: undefined;
    })[];
    transport: {
        submit: ({ data }: {
            data: any;
        }) => {
            url: string;
            method: string;
            headers: {
                'domain-id': any;
            };
            data: any;
        } | undefined;
    };
};
export default _default;
export declare function savePage(data: any): Promise<any>;
