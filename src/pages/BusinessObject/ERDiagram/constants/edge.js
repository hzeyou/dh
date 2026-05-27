// 关联类型
export let LinkRelationType = /*#__PURE__*/function (LinkRelationType) {
  LinkRelationType["ONE_TO_MANY"] = "ONE_TO_MANY";
  LinkRelationType["ONE_TO_ONE"] = "ONE_TO_ONE";
  return LinkRelationType;
}({}); // 一对一
export let LinkType = /*#__PURE__*/function (LinkType) {
  LinkType["RELATION_TYPE"] = "LINK_RELATION";
  return LinkType;
}({}); // 关联类型
export const NORMAL_SOURCE_EDGE_ATTR = {
  strokeWidth: 1,
  sourceMarker: {
    r: 4,
    cx: 4
  }
};
export const SELECTED_SOURCE_EDGE_ATTR = {
  strokeWidth: 2,
  sourceMarker: {
    r: 5,
    cx: 5
  }
};