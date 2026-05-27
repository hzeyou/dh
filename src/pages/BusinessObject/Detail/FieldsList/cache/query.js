import _isString from "lodash/isString";
import _isArray from "lodash/isArray";
import _omit from "lodash/omit";
import _pick from "lodash/pick";
/**
 * 字段列表查询条件缓存
 */
class FieldListQueryCache {
  constructor(initData) {
    this.data = {};
    if (initData) {
      this.data = initData;
    }
  }

  // 读取
  get() {
    return this.data;
  }

  // 增加/修改缓存
  update(data) {
    this.data = {
      ...this.data,
      ...data
    };
  }

  /**
   * 条件清除
   * 比如：clearByOmit({ a: 1, b: 2, c: 3 }, 'a') = > { a: 1 }
   * @param keys 不被清除的keys
   */
  clearByOmit(keys) {
    if (_isString(keys)) {
      this.data = _pick(this.data, [keys]);
    } else if (_isArray(keys)) {
      this.data = _pick(this.data, keys);
    } else {
      this.clearAll();
    }
  }

  /**
   * 条件清除
   * 比如：clearByPick({ a: 1, b: 2, c: 3 }, 'a') = > { b: 1, c: 3 }
   * @param keys 需要清除的keys
   */
  clearByPick(keys) {
    if (_isString(keys)) {
      this.data = _omit(this.data, [keys]);
    } else if (_isArray(keys)) {
      this.data = _omit(this.data, keys);
    } else {
      this.clearAll();
    }
  }

  // 全部清除
  clearAll() {
    this.data = {};
  }
}
export default FieldListQueryCache;
export const FieldListQueryCacheKey = '__FieldListQueryCacheKey_';