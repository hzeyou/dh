import React, { ReactNode } from 'react';
import C7NRecord from 'choerodon-ui/pro/lib/data-set/Record';
import { DataSet } from 'choerodon-ui/pro';
interface Props {
    record: C7NRecord;
    index: number;
    businessObjectCode: string;
    openSqlModal: (record: C7NRecord, sqlReadOnly?: boolean, drillText?: any) => void;
    deleteIcon: ReactNode;
    baseInfoDs?: DataSet;
    disabled?: boolean;
    predefineList?: any[];
    commonDataRange?: any[];
    handleCreateItem?: any;
    customDataRangeRecords: C7NRecord[];
    otherDrillParams?: object;
}
declare const _default: React.FunctionComponent<Props>;
export default _default;
