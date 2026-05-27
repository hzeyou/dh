import _DataSet from "choerodon-ui/pro/lib/data-set";
import _isNull from "lodash/isNull";
import { FieldType } from 'choerodon-ui/dataset/data-set/enum';
import intl from 'utils/intl';
import { isBracketsValid } from "hzero-front-hmde/lib/routes/Modeler/utils/utils";
import { POLYMERIZATION_CONDITION_HELP } from "../constants";
import FilterConditionDS from "./FilterConditionDS";
export let FieldNameTypes = /*#__PURE__*/function (FieldNameTypes) {
  FieldNameTypes["FILTER_CONDITIONS"] = "filterConditions";
  FieldNameTypes["FORMULA_NAME"] = "formulaName";
  FieldNameTypes["POLYMERIZATION_STANDARD"] = "polymerizationStandard";
  FieldNameTypes["POLYMERIZATION_STANDARD_CODE"] = "polymerizationStandardCode";
  FieldNameTypes["POLYMERIZATION_CONDITION"] = "polymerizationCondition";
  FieldNameTypes["POLYMERIZATION_EXPRESSION"] = "polymerizationExpression";
  FieldNameTypes["POLYMERIZATION_EXPRESSION_CODE"] = "polymerizationExpressionCode";
  FieldNameTypes["CONDITION_RELATIONSHIP"] = "conditionRelationship";
  return FieldNameTypes;
}({}); // 筛选条件表达式
export default (filterCacheRef => ({
  autoCreate: false,
  children: {
    [FieldNameTypes.FILTER_CONDITIONS]: new _DataSet(FilterConditionDS())
  },
  fields: [{
    name: FieldNameTypes.FORMULA_NAME,
    type: "string",
    label: intl.get('hmde.bo.modeler.jhFunction').d('聚合函数'),
    maxLength: 32,
    required: true
  }, {
    name: FieldNameTypes.POLYMERIZATION_STANDARD,
    type: "string",
    label: intl.get('hmde.bo.businessObject.polymerizationStandard').d('聚合基准')
    // required: true,
  }, {
    name: FieldNameTypes.POLYMERIZATION_EXPRESSION,
    type: "string",
    label: intl.get('hmde.bo.businessObject.polyExpression').d('聚合表达式'),
    computedProps: {
      required({
        record
      }) {
        return !['COL_COUNT'].includes(record === null || record === void 0 ? void 0 : record.get(FieldNameTypes.FORMULA_NAME));
      }
    }
  }, {
    name: FieldNameTypes.POLYMERIZATION_EXPRESSION_CODE,
    type: "string",
    computedProps: {
      required({
        record
      }) {
        return !['COL_COUNT'].includes(record === null || record === void 0 ? void 0 : record.get(FieldNameTypes.FORMULA_NAME));
      }
    }
  }, {
    name: FieldNameTypes.POLYMERIZATION_STANDARD_CODE,
    type: "string"
    // required: true,
  }, {
    name: FieldNameTypes.POLYMERIZATION_CONDITION,
    type: "object",
    label: intl.get('hmde.common.filterConditional').d('过滤条件'),
    help: POLYMERIZATION_CONDITION_HELP()
  }, {
    name: FieldNameTypes.CONDITION_RELATIONSHIP,
    type: "string",
    label: intl.get('hmde.common.conditionalRelation').d('条件关系'),
    help: intl.get('hmde.common.conditionalRelation.help').d('使用 AND 和 OR 合并筛选器条件行，示例：(1 AND 2) OR 3'),
    dynamicProps: {
      required({
        dataSet
      }) {
        return !!dataSet.children.filterConditions.length;
      }
    },
    validator: async (value = '') => {
      var _filterCacheRef$curre, _filterCacheRef$curre2, _value$match, _value$match2, _value$match2$call, _value$match3, _value$match3$call, _value$match4, _value$match5, _value$match5$call;
      if (!(filterCacheRef !== null && filterCacheRef !== void 0 && (_filterCacheRef$curre = filterCacheRef.current) !== null && _filterCacheRef$curre !== void 0 && (_filterCacheRef$curre2 = _filterCacheRef$curre.ds) !== null && _filterCacheRef$curre2 !== void 0 && _filterCacheRef$curre2.length)) return true; // 没有条件行，条件之间的关系也不是必输的

      const regNum = new RegExp('[0-9]+', 'g');
      const regBrackets = new RegExp('[()]', 'g');
      const regStr = new RegExp('[A-Z ]+', 'g');
      const regBracketsPro = new RegExp('[{[}]|]', 'g');
      const ChineseRegex = /[\u4e00-\u9fa5]/g; // 匹配中文字符
      let message = true;
      if (_isNull(value) || value.trim().length === 0 || value && !(value !== null && value !== void 0 && (_value$match = value.match) !== null && _value$match !== void 0 && _value$match.call(value, regNum)) || value !== null && value !== void 0 && (_value$match2 = value.match) !== null && _value$match2 !== void 0 && (_value$match2$call = _value$match2.call(value, regNum)) !== null && _value$match2$call !== void 0 && _value$match2$call.some(_key => {
        var _filterCacheRef$curre3, _filterCacheRef$curre4;
        return Number(_key) > (filterCacheRef === null || filterCacheRef === void 0 ? void 0 : (_filterCacheRef$curre3 = filterCacheRef.current) === null || _filterCacheRef$curre3 === void 0 ? void 0 : (_filterCacheRef$curre4 = _filterCacheRef$curre3.ds) === null || _filterCacheRef$curre4 === void 0 ? void 0 : _filterCacheRef$curre4.length);
      })) {
        message = intl.get('hmde.common.conditionalRelation.errorMes1').d('校验不通过，请按照参考示例输写筛选逻辑！');
      }
      if (value !== null && value !== void 0 && value.match(regStr) && !(value !== null && value !== void 0 && (_value$match3 = value.match) !== null && _value$match3 !== void 0 && (_value$match3$call = _value$match3.call(value, regStr)) !== null && _value$match3$call !== void 0 && _value$match3$call.every(str => str.trim() === 'AND' || str.trim() === 'OR'))) {
        message = intl.get('hmde.common.conditionalRelation.errorMes1').d('校验不通过，请按照参考示例输写筛选逻辑！');
      }
      if (regBracketsPro.test(value) || ChineseRegex.test(value)) {
        message = intl.get('hmde.common.conditionalRelation.errorMes2').d('校验不通过，请按照参考示例输写，当前仅支持“()”');
      }
      if (value !== null && value !== void 0 && (_value$match4 = value.match) !== null && _value$match4 !== void 0 && _value$match4.call(value, regBrackets) && !isBracketsValid(value === null || value === void 0 ? void 0 : (_value$match5 = value.match) === null || _value$match5 === void 0 ? void 0 : (_value$match5$call = _value$match5.call(value, regBrackets)) === null || _value$match5$call === void 0 ? void 0 : _value$match5$call.join())) {
        message = intl.get('hmde.common.conditionalRelation.errorMes3').d('校验不通过，你输入的括号匹配错误！');
      }
      return message;
    }
  }]
}));