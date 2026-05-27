/**
 * 字段列表查询条件缓存
 */
declare class FieldListQueryCache {
    data: {};
    constructor(initData?: object);
    get(): {};
    update(data: any): void;
    /**
     * 条件清除
     * 比如：clearByOmit({ a: 1, b: 2, c: 3 }, 'a') = > { a: 1 }
     * @param keys 不被清除的keys
     */
    clearByOmit(keys: any): void;
    /**
     * 条件清除
     * 比如：clearByPick({ a: 1, b: 2, c: 3 }, 'a') = > { b: 1, c: 3 }
     * @param keys 需要清除的keys
     */
    clearByPick(keys: any): void;
    clearAll(): void;
}
export default FieldListQueryCache;
export declare const FieldListQueryCacheKey = "__FieldListQueryCacheKey_";
