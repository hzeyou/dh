import React from 'react';
import { DataSet } from 'choerodon-ui/pro';
import C7NRecord from 'choerodon-ui/pro/lib/data-set/Record';
import { Buttons } from 'choerodon-ui/pro/lib/table/Table';
import { FieldType } from '@apaas/constants/businessObject';
interface IProps {
    location: {
        state: any;
    };
    FieldListCache: any;
    buttons: Buttons[];
    handleEnable: (record: any) => Promise<false | undefined>;
    handleDetail: (record: C7NRecord | null | undefined, type: FieldType) => void;
    handleDeleteCheck: (record: any, v: any, isExtend: boolean) => void;
    handleDelete: (record: any) => Promise<void>;
    tableDS: DataSet;
    activeKey: FieldType | null;
    creating: boolean;
    editing: boolean;
}
declare const _default: React.FunctionComponent<IProps>;
export default _default;
