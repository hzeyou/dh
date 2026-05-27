import { DataSet } from 'choerodon-ui/pro';
import { MutableRefObject } from 'react';
import Record from 'choerodon-ui/pro/lib/data-set/Record';
export declare enum SyncRecordState {
    COVER = "cover",
    ADD = "add"
}
/**
 * 同步 ds 数据到 记录
 * @param dataSet
 * @param totalRecord
 * @param status
 */
export declare const syncRecordToTotal: (dataSet: DataSet, totalRecord: MutableRefObject<Record[]>, status?: SyncRecordState | undefined) => void;
export declare const handleSetRecordsTotal: (ds: DataSet, targetRecordsTotal: MutableRefObject<Record[]>, status?: SyncRecordState | undefined) => void;
