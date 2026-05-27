import _last from "lodash/last";
import _nth from "lodash/nth";
import _groupBy from "lodash/groupBy";
import _isArray from "lodash/isArray";
import { FieldComponentType } from 'hzero-front-apaas/lib/constants/businessObject';
import { BlockReg, DrillFormulaReg } from "hzero-front-apaas/lib/constants/businessObject";
import { replaceAll } from "hzero-front-hmde/lib/utils/string";
export const codeTransfer = (code, mappingList, from, to) => {
  // 长的先进行替换，避免被短字符嵌套替换
  return mappingList.sort((a, b) => b[from].length - a[from].length).reduce((pre, cur) => {
    const fromValue = cur[from],
      toValue = cur[to];
    return replaceAll(pre, fromValue, toValue);
  }, code);
};

// 1. 先把公式全部拿出来；
// 2. 然后用正则把cacase(...) 括号之间的值全部拿出来，然后通过 “,” 切一刀；
// 3. 完了根据长度关系得到：是否需要补全翻译最后一个参数
export const getTranslateFormulaList = referenceInfoList => {
  if (!_isArray(referenceInfoList)) return [];
  const groupData = _groupBy(referenceInfoList, item => (item === null || item === void 0 ? void 0 : item.referenceFormula) || 'unKnow');
  const res = Object.keys(groupData).reduce((acc, key) => {
    if (key === 'unKnow') {
      return [...acc];
    }
    const item = groupData[key];
    const content = _nth(`${key}`.match(/CASCADE\((.*?)\)/), 1); // 捕获括号中的内容
    const contentArr = `${content}`.replace(/\s/g, '').split(',');
    if (contentArr.length > item.length) {
      // 说明最后一项是对象，没有选到字段，需要根据最后一项字段推导出翻译
      const lastItem = _last(item);
      const pushItem = {
        referenceFormula: lastItem.referenceFormula,
        businessObjectCode: lastItem.masterBusinessObjectCode,
        businessObjectName: lastItem.masterBusinessObjectName,
        businessObjectFieldCode: '',
        businessObjectFieldName: ''
      };
      return [...acc, ...item, pushItem];
    } else {
      return [...acc, ...item];
    }
  }, []);
  return res;
};

// 根据字段编码进行替换
export const replaceFormulaValueToMeaning = (formula = '', mappingList = []) => {
  /**
   * 只会对CASCADE内的字段编码进行替换
   */
  return formula.replace(/CASCADE\(([^()]*?)\)/g, ($0, $1) => {
    if (!$1) {
      return $0;
    }
    const meaning = $1.replace(/\w+(\.\w+)?/g, fieldCode => {
      var _mappingList$find;
      return ((_mappingList$find = mappingList.find(i => i.value === fieldCode)) === null || _mappingList$find === void 0 ? void 0 : _mappingList$find.meaning) || fieldCode;
    });
    return `CASCADE(${meaning})`;
  });
};
export const formula2Desc = (formula, mappingList) => {
  let temp = formula;
  // const getReg = (params) => {
  //   return new RegExp(params.value);
  // };
  mappingList.forEach(i => {
    var _temp;
    // const reg = getReg(i);
    temp = (_temp = temp) === null || _temp === void 0 ? void 0 : _temp.replace(i === null || i === void 0 ? void 0 : i.value, i.meaning);
  });
  return temp;
};
export const dataMapTransfer2 = (initValue, mapList, from, to) => {
  var _temp2, _temp3;
  let temp = initValue;
  // const reg = new RegExp('#(.*?)#', 'g');
  const matchList = [...(((_temp2 = temp) === null || _temp2 === void 0 ? void 0 : _temp2.match(BlockReg)) || []), ...(((_temp3 = temp) === null || _temp3 === void 0 ? void 0 : _temp3.match(DrillFormulaReg)) || [])];
  // eslint-disable-next-line no-unused-expressions
  matchList === null || matchList === void 0 ? void 0 : matchList.forEach(item => {
    var _temp4;
    const matchItem = mapList.find(i => (i === null || i === void 0 ? void 0 : i[from]) === item);
    temp = (_temp4 = temp) === null || _temp4 === void 0 ? void 0 : _temp4.replace(item, matchItem === null || matchItem === void 0 ? void 0 : matchItem[to]);
  });
  return temp;
};

// 返回值类型 映射
export const typeMapConvert = type => {
  switch (type) {
    case 'Long':
      return 'NUMBER_FIELD';
    case 'BigDecimal':
      return 'FLOAT';
    case 'String':
      return 'TEXT_FIELD';
    case 'LocalDate':
      return 'DATE_SELECTION_BOX';
    case 'ZonedDateTime':
      return 'DATETIME_SELECTION_BOX';
    case 'Boolean':
      return 'SWITCH';
    case FieldComponentType.SINGLE_SELECT:
      return FieldComponentType.SINGLE_SELECT;
    case FieldComponentType.MULTIPLE_SELECT:
      return FieldComponentType.MULTIPLE_SELECT;
    default:
      return '';
  }
};