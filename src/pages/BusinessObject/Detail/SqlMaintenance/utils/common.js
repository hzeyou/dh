import { ApiParamType } from "hzero-front-hmde/lib/constants/businessObject";

/**
 * 查询参数数据类型过滤规则
 * @param optionRecord
 */
export const filerQueryParamsTypes = optionRecord => {
  // 过滤掉数组类型
  return optionRecord.get('value') !== ApiParamType.Array;
};