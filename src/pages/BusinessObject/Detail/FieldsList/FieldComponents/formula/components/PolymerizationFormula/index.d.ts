import React from 'react';
import { modalChildrenProps } from 'choerodon-ui/pro/lib/modal/interface';
interface Props {
    businessObjectId?: string;
    formula: string;
    curFieldId: string;
    onOk: (res: {
        value: string;
        text: string;
        mappingList: Array<{
            value: string;
            meaning: string;
        }>;
    }) => void;
    businessObjectCode?: string | number;
    businessObjectName?: string;
    modal?: modalChildrenProps;
}
declare const _default: React.FunctionComponent<Props>;
export default _default;
