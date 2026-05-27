import _isEmpty from "lodash/isEmpty";
import { getParentObjList } from "hzero-front-hmde/lib/routes/BusinessObjectComposition/Detail/FieldInformation/utils";
const CONSTANT = 'CONSTANT',
  // 前置条件类型标识
  FIELD // 关联字段类型标识
  = 'FIELD';

// 获取钻取表达式
const getFieldPath = (obj, totalData = [], parentObjList = []) => {
  // if (!obj?.parentId) {
  //   return;
  // }
  const _parentObjList = getParentObjList(totalData, obj.parentId) || parentObjList;
  let realValue = '';
  let masterBusinessObjectFieldCode = ''; // 前置条件左侧字段
  let associateValue = ''; // 前置条件右侧字段值
  let associationStr = '';
  const newList = [..._parentObjList, obj];
  const len = newList.length;
  newList.forEach((item, index) => {
    // 高级关系前置条件对象 // CASCADE(MEMBER_ROLE.|${memberType// 前置条件字段}=${USER // 前置条件值}|${memberId // 关联字段左侧code集合}, USER.id)
    if (item !== null && item !== void 0 && item.associateBusinessObjectCode) {
      // 获取前置条件
      const preCondition = item === null || item === void 0 ? void 0 : item.businessObjectAssociateFieldList.find(advanceField => (advanceField === null || advanceField === void 0 ? void 0 : advanceField.associateFieldType) === CONSTANT);
      masterBusinessObjectFieldCode = preCondition === null || preCondition === void 0 ? void 0 : preCondition.masterBusinessObjectFieldCode;
      associateValue = preCondition === null || preCondition === void 0 ? void 0 : preCondition.associateValue;
      // 获取关联字段数组
      let associationRelationCodeList = item === null || item === void 0 ? void 0 : item.businessObjectAssociateFieldList.filter(advanceField => (advanceField === null || advanceField === void 0 ? void 0 : advanceField.associateFieldType) === FIELD).map(associateField => associateField === null || associateField === void 0 ? void 0 : associateField.masterBusinessObjectFieldCode); // 关联关系标识
      associationRelationCodeList = associationRelationCodeList.join('|');
      if (!_isEmpty(associationRelationCodeList)) {
        associationStr = masterBusinessObjectFieldCode ? `|${masterBusinessObjectFieldCode}=${associateValue}|${associationRelationCodeList}` : `|${associationRelationCodeList}`;
      } else if (masterBusinessObjectFieldCode) {
        associationStr = `|${masterBusinessObjectFieldCode}=${associateValue}`;
      }
    }
    // 拼接名称
    // textValue = textValue.concat(
    //   index === len - 1
    //     ? `${item?.businessObjectFieldName}`
    //     : `${item?.businessObjectFieldName}.`
    // );
    // 拼接真实值
    // 主从
    if ((item === null || item === void 0 ? void 0 : item.relateType) === 'MASTER_SLAVE') {
      realValue = realValue.concat(index === len - 1 ? `${item === null || item === void 0 ? void 0 : item.businessObjectCode}.${item !== null && item !== void 0 && item.associateBusinessObjectCode ? associationStr : item === null || item === void 0 ? void 0 : item.businessObjectFieldCode}-${item === null || item === void 0 ? void 0 : item.slaveBusinessObjectFieldCode}` : `${item === null || item === void 0 ? void 0 : item.businessObjectCode}.${item !== null && item !== void 0 && item.associateBusinessObjectCode ? associationStr : item === null || item === void 0 ? void 0 : item.businessObjectFieldCode}-${item === null || item === void 0 ? void 0 : item.slaveBusinessObjectFieldCode},`);
    } else {
      realValue = realValue.concat(index === len - 1 ? `${item === null || item === void 0 ? void 0 : item.businessObjectCode}.${item !== null && item !== void 0 && item.associateBusinessObjectCode ? associationStr : item === null || item === void 0 ? void 0 : item.businessObjectFieldCode}` : `${item === null || item === void 0 ? void 0 : item.businessObjectCode}.${item !== null && item !== void 0 && item.associateBusinessObjectCode ? associationStr : item === null || item === void 0 ? void 0 : item.businessObjectFieldCode},`);
    }
  });
  let str = `CASCADE(${realValue}`;
  str = `${str})`;
  return str;
};
export { getFieldPath };