import { FieldComponentType } from 'hzero-front-apaas/lib/constants/businessObject';

// 连接桩分组名称
export let PortsGroup = /*#__PURE__*/function (PortsGroup) {
  PortsGroup["head"] = "head";
  PortsGroup["list"] = "list";
  return PortsGroup;
}({});

// 需要展示连接桩的关系类字段
export const RELATION_TYPE = [FieldComponentType.LINK_RELATION, FieldComponentType.MASTER_RELATION, FieldComponentType.REFERENCE_FIELD, FieldComponentType.MULTIPLE_RELATION];