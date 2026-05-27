import React from 'react';
import C7NRecord from 'choerodon-ui/pro/lib/data-set/Record';
import { modalChildrenProps } from 'choerodon-ui/pro/lib/modal/interface';
interface IProps {
    modal?: modalChildrenProps;
    domain: any;
    record: C7NRecord;
    oldTenantBusinessObjectPrefixRule?: string;
    copySuccess: ({ businessObjectCode, businessObjectName, businessObjectId, }: {
        businessObjectCode: string;
        businessObjectName: string;
        businessObjectId: string;
    }) => void;
    businessObjectCreatedFlag?: boolean;
}
declare const _default: React.FunctionComponent<IProps>;
export default _default;
