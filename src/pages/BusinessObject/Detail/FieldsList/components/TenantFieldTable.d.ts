import React, { ReactElement } from 'react';
import { DataSet } from 'choerodon-ui/pro';
import C7NRecord from 'choerodon-ui/pro/lib/data-set/Record';
import { Buttons } from 'choerodon-ui/pro/lib/table/Table';
import { FieldType } from '@apaas/constants/businessObject';
interface IProps {
    buttons: Buttons[];
    tableDS: DataSet;
    activeKey: FieldType | null;
    handleEnable: (record: any) => Promise<false | undefined>;
    handleDetail: (record: C7NRecord | null | undefined, type: FieldType) => void;
    handleDeleteCheck: (record: any, v: any) => void;
    handleDelete: (record: any) => Promise<void>;
    updateSort: (dataSet: DataSet) => void;
    updateRowConfig: (record: C7NRecord) => object;
    handleDragEndBefore: (dataSet: any, col: any, resultDrag: any) => boolean;
    renderDragIcon: (rowRenderIcon: any) => ReactElement;
    creating: boolean;
    editing: boolean;
    scrollRef: React.MutableRefObject<number>;
    getAddonBefore?: string;
    physicalModelType?: string;
    baseInfoDS?: DataSet;
}
declare const _default: React.FunctionComponent<IProps>;
export default _default;
