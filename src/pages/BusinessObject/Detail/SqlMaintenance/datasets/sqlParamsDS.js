import { FieldType } from 'choerodon-ui/dataset/data-set/enum';
import intl from 'utils/intl';
import { ApiParamType } from "hzero-front-hmde/lib/constants/businessObject";
export let SQL_SOURCE_TYPE = /*#__PURE__*/function (SQL_SOURCE_TYPE) {
  SQL_SOURCE_TYPE["AUTO"] = "AUTO";
  SQL_SOURCE_TYPE["CUSTOM"] = "CUSTOM";
  return SQL_SOURCE_TYPE;
}({});
export let SQL_PARAM_CATEGORY = /*#__PURE__*/function (SQL_PARAM_CATEGORY) {
  SQL_PARAM_CATEGORY["FIELD_PARAM"] = "FIELD_PARAM";
  SQL_PARAM_CATEGORY["QUERY_PARAM"] = "QUERY_PARAM";
  return SQL_PARAM_CATEGORY;
}({});
export let SQL_PARAMS_FN = /*#__PURE__*/function (SQL_PARAMS_FN) {
  SQL_PARAMS_FN["CODE"] = "paramCode";
  SQL_PARAMS_FN["NAME"] = "paramName";
  SQL_PARAMS_FN["TYPE"] = "paramType";
  SQL_PARAMS_FN["MAX_LENGTH"] = "maxLength";
  SQL_PARAMS_FN["DECIMAL_DIGITS"] = "decimalDigits";
  SQL_PARAMS_FN["PRIMARY_FLAG"] = "primaryFlag";
  SQL_PARAMS_FN["SOURCE_TYPE"] = "sourceType";
  SQL_PARAMS_FN["PARAM_CATEGORY"] = "paramCategory";
  SQL_PARAMS_FN["ENCRYPT_FLAG"] = "encryptFlag";
  return SQL_PARAMS_FN;
}({});
export const SqlParamsState = {
  fieldCodes: 'fieldCodes'
};
const sqlParamsDS = sqlDsRef => {
  return {
    paging: false,
    selection: false,
    forceValidate: true,
    fields: [{
      name: SQL_PARAMS_FN.CODE,
      label: intl.get('hmde.common.paramName').d('参数名称'),
      type: "string",
      required: true,
      maxLength: 60,
      validator: (value, _, record) => {
        var _sqlDsRef$current, _sqlDsRef$current$sql, _sqlDsRef$current2, _sqlDsRef$current2$sq;
        // 校验规则
        const pattern = /^[a-z][a-zA-Z0-9]*$/;
        if (!pattern.test(value)) {
          return intl.get('hmde.bo.sqlBo.codeValidate').d('需以小写字母开头，中间支持大写字母、小写字母、数字组合，仅支持使用小驼峰');
        }
        // 查询参数去重规则
        const sqlParamsRecords = [];
        const sqlQueryParamsRecords = [];
        (_sqlDsRef$current = sqlDsRef.current) === null || _sqlDsRef$current === void 0 ? void 0 : (_sqlDsRef$current$sql = _sqlDsRef$current.sqlParamsDs) === null || _sqlDsRef$current$sql === void 0 ? void 0 : _sqlDsRef$current$sql.forEach(r => {
          if (r !== record) {
            sqlParamsRecords.push(r);
          }
        });
        (_sqlDsRef$current2 = sqlDsRef.current) === null || _sqlDsRef$current2 === void 0 ? void 0 : (_sqlDsRef$current2$sq = _sqlDsRef$current2.sqlQueryParamsDs) === null || _sqlDsRef$current2$sq === void 0 ? void 0 : _sqlDsRef$current2$sq.forEach(r => {
          if (r !== record) {
            sqlQueryParamsRecords.push(r);
          }
        });
        const paramCategory = record.get(SQL_PARAMS_FN.PARAM_CATEGORY);
        // 判断查询参数是否重复
        if (paramCategory === SQL_PARAM_CATEGORY.QUERY_PARAM) {
          const queryParams = sqlQueryParamsRecords.map(r => r.get(SQL_PARAMS_FN.CODE));
          if (queryParams.includes(value)) {
            return intl.get('hmde.bo.sqlBo.queryCodeRepetition').d('查询参数名称重复');
          }
        } else if (paramCategory === SQL_PARAM_CATEGORY.FIELD_PARAM) {
          // 判断返回列是否重复
          const fieldCodes = sqlParamsRecords.map(r => r.get(SQL_PARAMS_FN.CODE));
          if (fieldCodes.includes(value)) {
            return intl.get('hmde.bo.sqlBo.columnCodeRepetition').d('返回列列名重复');
          }
        }
        const queryParams = sqlQueryParamsRecords.map(r => r.get(SQL_PARAMS_FN.CODE));
        const fieldCodes = sqlParamsRecords.map(r => r.get(SQL_PARAMS_FN.CODE));
        if (queryParams.includes(value) || fieldCodes.includes(value)) {
          return intl.get('hmde.bo.sqlBo.queryCodeRepetitionWithColumn').d('参数名称与返回列列名重复');
        }
        return true;
      }
    }, {
      name: SQL_PARAMS_FN.TYPE,
      label: intl.get('hmde.common.paramType').d('参数类型'),
      type: "string",
      required: true,
      lookupCode: 'HMDE.API.PARAM.TYPE'
    }, {
      name: SQL_PARAMS_FN.NAME,
      label: intl.get('hmde.pd.nodeClassification.paramDescription').d('参数描述'),
      type: "string",
      maxLength: 200,
      required: true
    }, {
      name: SQL_PARAMS_FN.MAX_LENGTH,
      label: intl.get('hmde.common.manLength').d('最大长度'),
      type: "number",
      step: 1,
      min: 1,
      max: 4000,
      computedProps: {
        required: ({
          record
        }) => {
          // 浮点数时,小数位数必输
          return record.get(SQL_PARAMS_FN.TYPE) === ApiParamType.String;
        }
      }
    }, {
      name: SQL_PARAMS_FN.DECIMAL_DIGITS,
      label: intl.get('hmde.common.digitalAccuracy').d('小数位数'),
      type: "number",
      max: 10,
      min: 0,
      step: 1,
      computedProps: {
        required: ({
          record
        }) => {
          // 浮点数时,小数位数必输
          return record.get(SQL_PARAMS_FN.TYPE) === ApiParamType.BigDecimal;
        }
      }
    }, {
      name: SQL_PARAMS_FN.PRIMARY_FLAG,
      label: intl.get('hmde.common.primaryKey').d('主键'),
      type: "boolean",
      defaultValue: false
    }, {
      name: SQL_PARAMS_FN.ENCRYPT_FLAG,
      label: intl.get('hmde.common.isEncryption').d('是否加密'),
      type: "boolean",
      defaultValue: false
    }],
    events: {
      update: ({
        dataSet,
        name,
        value,
        record
      }) => {
        // 如果某一行勾选了主键,其余行的主键勾选取消
        if (name === SQL_PARAMS_FN.PRIMARY_FLAG && value) {
          dataSet.forEach(r => {
            if (r !== dataSet.current) {
              r.set(SQL_PARAMS_FN.PRIMARY_FLAG, false);
            }
          });
          // 如果当前行是整型,默认勾选主键加密
          if (record.get(SQL_PARAMS_FN.TYPE) === ApiParamType.Long) {
            record.set(SQL_PARAMS_FN.ENCRYPT_FLAG, true);
          }
        }
        if (name === SQL_PARAMS_FN.TYPE) {
          switch (value) {
            // 如果选择了文本, 清空小数位数/加密的值, 最大长度默认值 240
            case ApiParamType.String:
              record.set(SQL_PARAMS_FN.DECIMAL_DIGITS, null);
              record.set(SQL_PARAMS_FN.MAX_LENGTH, 240);
              record.set(SQL_PARAMS_FN.ENCRYPT_FLAG, false);
              break;
            // 如果选择了整数/日期/日期时间/开关/单附件, 清空最大长度,最小位数/加密
            case ApiParamType.Long:
            case ApiParamType.LocalDate:
            case ApiParamType.ZonedDateTime:
            case ApiParamType.Byte:
            case ApiParamType['String(Byte[])']:
              record.set(SQL_PARAMS_FN.DECIMAL_DIGITS, null);
              record.set(SQL_PARAMS_FN.MAX_LENGTH, null);
              record.set(SQL_PARAMS_FN.ENCRYPT_FLAG, false);
              break;
            // 如果选择了浮点, 清空最大长度/加密, 小数位数默认值 2
            case ApiParamType.BigDecimal:
              record.set(SQL_PARAMS_FN.MAX_LENGTH, null);
              record.set(SQL_PARAMS_FN.DECIMAL_DIGITS, 2);
              record.set(SQL_PARAMS_FN.ENCRYPT_FLAG, false);
              break;
            default:
              break;
          }
        }
      }
    }
  };
};
export default sqlParamsDS;