import _isUndefined from "lodash/isUndefined";
import { FieldsNameTypes } from "hzero-front-hmde/lib/stores/BusinessObject/PermissionDistributeDS";
export let SyncRecordState = /*#__PURE__*/function (SyncRecordState) {
  SyncRecordState["COVER"] = "cover";
  SyncRecordState["ADD"] = "add";
  return SyncRecordState;
}({}); // 如果 ds 内数据不存在 total 覆盖 total 数据

/**
 * 同步 ds 数据到 记录
 * @param dataSet
 * @param totalRecord
 * @param status
 */
export const syncRecordToTotal = (dataSet, totalRecord, status) => {
  if (status === SyncRecordState.COVER) {
    // eslint-disable-next-line no-param-reassign
    totalRecord.current = dataSet.records;
  } else {
    dataSet.records.forEach(r => {
      const targetIndex = totalRecord.current.findIndex(v => v.get('id') === r.get('id'));
      if (targetIndex !== -1) {
        // eslint-disable-next-line no-param-reassign
        totalRecord.current[targetIndex] = r;
      } else if (status === SyncRecordState.ADD) {
        totalRecord.current.unshift(r);
      }
    });
  }
};

// 每次设置总记录,都需要过滤搜索内容到视图数据
export const handleSetRecordsTotal = (ds, targetRecordsTotal, status) => {
  // 同步 ds 到 总记录
  syncRecordToTotal(ds, targetRecordsTotal, status);
  // 根据搜索过滤
  const searchContent = ds.getState(FieldsNameTypes.SEARCH_CONTENT);
  // 搜索出来的父级记录
  const organizationRecords = targetRecordsTotal.current.filter(v => _isUndefined(v.get('tenantId')) && v.get(FieldsNameTypes.NAME).includes(searchContent) || v.get(FieldsNameTypes.CODE).includes(searchContent));
  // 根据父级记录,带出子级记录
  const roleRecords = targetRecordsTotal.current.filter(r => {
    if (!_isUndefined(r.get('tenantId'))) {
      // 判断子级是否在父级内
      const targetIndex = organizationRecords.findIndex(v => v.get('id') === r.get('tenantId'));
      return targetIndex !== -1;
    }
    return false;
  });
  ds.loadData(organizationRecords.concat(roleRecords));
};