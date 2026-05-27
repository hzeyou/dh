import { FieldType } from 'choerodon-ui/dataset/data-set/enum';
import intl from 'utils/intl';
import { ApiParamType } from "hzero-front-hmde/lib/constants/businessObject";
import { getTimeFormat } from "hzero-front-hmde/lib/utils/common";
export let SQL_RUN_PARAMS_FN = /*#__PURE__*/function (SQL_RUN_PARAMS_FN) {
  SQL_RUN_PARAMS_FN["CODE"] = "paramCode";
  SQL_RUN_PARAMS_FN["TYPE"] = "paramType";
  SQL_RUN_PARAMS_FN["VALUE"] = "value";
  return SQL_RUN_PARAMS_FN;
}({}); // 值
const sqlRunParamsDS = () => ({
  selection: false,
  autoQuery: false,
  autoCreate: false,
  paging: false,
  forceValidate: true,
  fields: [{
    name: SQL_RUN_PARAMS_FN.CODE,
    type: "string",
    label: intl.get('hmde.common.diyParamName').d('自定义参数名称'),
    required: true,
    unique: true,
    maxLength: 60,
    pattern: /^[a-z][a-zA-Z0-9]*$/,
    defaultValidationMessages: {
      patternMismatch: intl.get('hmde.bo.businessObject.fieldCode.validation1').d('需以小写字母开头，中间支持大写字母、小写字母、数字组合，推荐使用小驼峰'),
      uniqueError: intl.get('hmde.bo.sqlBo.uniqueError').d('已存在相同参数')
    }
  }, {
    name: SQL_RUN_PARAMS_FN.TYPE,
    type: "string",
    label: intl.get('hmde.common.paramType').d('参数类型'),
    lookupCode: 'HMDE.API.PARAM.TYPE',
    required: true,
    defaultValue: ApiParamType.String
  }, {
    name: SQL_RUN_PARAMS_FN.VALUE,
    type: "auto",
    label: intl.get('hmde.bo.businessObject.price').d('值'),
    trueValue: 1,
    falseValue: 0,
    dynamicProps: {
      format: ({
        record
      }) => {
        const type = record.get(SQL_RUN_PARAMS_FN.TYPE);
        if (type === ApiParamType.LocalDate) {
          var _getTimeFormat;
          return (_getTimeFormat = getTimeFormat()) === null || _getTimeFormat === void 0 ? void 0 : _getTimeFormat.date;
        } else if (type === ApiParamType.ZonedDateTime) {
          var _getTimeFormat2;
          return (_getTimeFormat2 = getTimeFormat()) === null || _getTimeFormat2 === void 0 ? void 0 : _getTimeFormat2.time;
        }
      }
    }
  }],
  events: {
    update: ({
      name,
      value,
      record
    }) => {
      // 切换数据类型，值置空
      if (name === SQL_RUN_PARAMS_FN.TYPE) {
        if (value !== ApiParamType.Byte) {
          record.set(SQL_RUN_PARAMS_FN.VALUE, null);
        } else {
          // 如果选到开关类型，默认值置0
          record.set(SQL_RUN_PARAMS_FN.VALUE, 0);
        }
      }
    }
  }
});
export default sqlRunParamsDS;