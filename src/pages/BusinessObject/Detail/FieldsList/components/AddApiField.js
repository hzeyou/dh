import _Table from "@hzero-front-ui/c7n-ui/lib/TablePro";
import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _Select from "@hzero-front-ui/c7n-ui/lib/SelectPro";
import _Modal from "@hzero-front-ui/c7n-ui/lib/ModalPro";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import React, { useEffect, useMemo, useRef } from 'react';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { observer } from 'mobx-react-lite';
import { TableQueryBarType } from 'choerodon-ui/pro/lib/table/enum';
import { FieldType } from 'choerodon-ui/pro/lib/data-set/enum';
import { LabelAlign } from 'choerodon-ui/pro/lib/form/enum';
import { getCurrentOrganizationId, getResponse } from 'utils/utils';
import notification from 'utils/notification';
import { HZERO_HMDE } from "hzero-front-apaas/lib/utils/config";
import { lowcodeOrganizationURL } from "hzero-front-hmde/lib/utils/common";
import { lowcodeRequest as request } from "hzero-front-hmde/lib/utils/lowcodeRequest";
const tenantId = getCurrentOrganizationId();
export let ParamsTableFN = /*#__PURE__*/function (ParamsTableFN) {
  ParamsTableFN["PARAMS_NAME"] = "paramName";
  ParamsTableFN["PARAMS_REMARK"] = "paramDescription";
  ParamsTableFN["REQUIRE_TYPE"] = "paramType";
  ParamsTableFN["MAN_LENGTH"] = "maxLength";
  ParamsTableFN["DECIMALS"] = "decimalDigits";
  ParamsTableFN["IS_REQUIRED"] = "requiredFlag";
  ParamsTableFN["BEHAVIOR"] = "paramBehavior";
  ParamsTableFN["API_BEHAVIOR"] = "apiBehavior";
  ParamsTableFN["PRIMARY_KEY"] = "primaryFlag";
  ParamsTableFN["PARAMS_MAP"] = "businessObjectFieldId";
  return ParamsTableFN;
}({});
const ShowExtendsFieldDetail = ({
  baseInfoDS,
  modal,
  listTableDS
}) => {
  const FormDs = useMemo(() => new _DataSet({
    autoQuery: false,
    paging: false,
    fields: [{
      label: intl.get('hmde.bo.businessObject.standardApi').d('标准API'),
      name: 'type',
      type: "string",
      textField: 'apiTypeMeaning',
      valueField: 'apiType',
      lookupAxiosConfig: () => {
        var _baseInfoDS$current;
        return {
          url: `${lowcodeOrganizationURL({
            route: HZERO_HMDE
          })}/business-objects/api/${baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current = baseInfoDS.current) === null || _baseInfoDS$current === void 0 ? void 0 : _baseInfoDS$current.get('businessObjectId')}/list`,
          method: 'GET'
        };
      }
    }],
    events: {
      update: ({
        value
      }) => {
        init(value);
      }
    }
  }), []);
  const businessObjectApiIdRef = useRef('');
  const init = (type = 'PAGE') => {
    tableDs === null || tableDs === void 0 ? void 0 : tableDs.query(1, {
      type
    });
  };
  useEffect(() => {
    var _FormDs$getField;
    FormDs === null || FormDs === void 0 ? void 0 : (_FormDs$getField = FormDs.getField('type')) === null || _FormDs$getField === void 0 ? void 0 : _FormDs$getField.fetchLookup(false, FormDs === null || FormDs === void 0 ? void 0 : FormDs.current).then(res => {
      var _res$find;
      const item = res === null || res === void 0 ? void 0 : (_res$find = res.find) === null || _res$find === void 0 ? void 0 : _res$find.call(res, v => v.apiStandardUrl);
      if (item !== null && item !== void 0 && item.apiType) {
        FormDs === null || FormDs === void 0 ? void 0 : FormDs.loadData([{
          type: item.apiType
        }]);
        init(item.apiType);
      }
    });
  }, []);
  const tableDs = useMemo(() => new _DataSet({
    autoQuery: false,
    paging: false,
    transport: {
      read: ({
        params
      }) => {
        var _baseInfoDS$current2;
        return {
          url: `${lowcodeOrganizationURL({
            route: HZERO_HMDE
          })}/business-objects/api/${baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current2 = baseInfoDS.current) === null || _baseInfoDS$current2 === void 0 ? void 0 : _baseInfoDS$current2.get('businessObjectId')}/detail`,
          method: 'GET',
          params,
          transformResponse: respondData => {
            let res = [];
            try {
              var _FormDs$current, _FormDs$current2, _FormDs$current3;
              const temp = JSON.parse(respondData);
              businessObjectApiIdRef.current = temp.id;
              // 那三个 ('PAGE', 'LANE_LIST', 'LANE_PAGE') 取出参的第二层
              if (['PAGE', 'LANE_LIST', 'LANE_PAGE'].includes(FormDs === null || FormDs === void 0 ? void 0 : (_FormDs$current = FormDs.current) === null || _FormDs$current === void 0 ? void 0 : _FormDs$current.get('type'))) {
                var _temp$outputApiParamL, _temp$outputApiParamL2, _temp$outputApiParamL3, _temp$outputApiParamL4, _temp$outputApiParamL5;
                res = (temp === null || temp === void 0 ? void 0 : (_temp$outputApiParamL = temp.outputApiParamList) === null || _temp$outputApiParamL === void 0 ? void 0 : (_temp$outputApiParamL2 = _temp$outputApiParamL.find) === null || _temp$outputApiParamL2 === void 0 ? void 0 : (_temp$outputApiParamL3 = _temp$outputApiParamL2.call(_temp$outputApiParamL, v => {
                  var _v$apiParamList;
                  return v === null || v === void 0 ? void 0 : (_v$apiParamList = v.apiParamList) === null || _v$apiParamList === void 0 ? void 0 : _v$apiParamList.length;
                })) === null || _temp$outputApiParamL3 === void 0 ? void 0 : (_temp$outputApiParamL4 = _temp$outputApiParamL3.apiParamList) === null || _temp$outputApiParamL4 === void 0 ? void 0 : (_temp$outputApiParamL5 = _temp$outputApiParamL4.map) === null || _temp$outputApiParamL5 === void 0 ? void 0 : _temp$outputApiParamL5.call(_temp$outputApiParamL4, v => {
                  return {
                    ...v,
                    ...v.apiParam
                  };
                })) || [];
              }
              // 其他查询类 ("QUERY", "LIST", "COUNT")  取出参的第一层
              if (['QUERY', 'LIST', 'COUNT'].includes(FormDs === null || FormDs === void 0 ? void 0 : (_FormDs$current2 = FormDs.current) === null || _FormDs$current2 === void 0 ? void 0 : _FormDs$current2.get('type'))) {
                var _temp$outputApiParamL6, _temp$outputApiParamL7;
                res = (temp === null || temp === void 0 ? void 0 : (_temp$outputApiParamL6 = temp.outputApiParamList) === null || _temp$outputApiParamL6 === void 0 ? void 0 : (_temp$outputApiParamL7 = _temp$outputApiParamL6.map) === null || _temp$outputApiParamL7 === void 0 ? void 0 : _temp$outputApiParamL7.call(_temp$outputApiParamL6, v => {
                  return {
                    ...v,
                    ...v.apiParam
                  };
                })) || [];
              }

              // 其他 ("INSERT", "UPDATE", "BATCH_UPDATE", "BATCH_DELETE") 取入参
              if (['INSERT', 'UPDATE', 'BATCH_UPDATE', 'BATCH_DELETE'].includes(FormDs === null || FormDs === void 0 ? void 0 : (_FormDs$current3 = FormDs.current) === null || _FormDs$current3 === void 0 ? void 0 : _FormDs$current3.get('type'))) {
                var _temp$inputApiParamLi, _temp$inputApiParamLi2;
                res = (temp === null || temp === void 0 ? void 0 : (_temp$inputApiParamLi = temp.inputApiParamList) === null || _temp$inputApiParamLi === void 0 ? void 0 : (_temp$inputApiParamLi2 = _temp$inputApiParamLi.map) === null || _temp$inputApiParamLi2 === void 0 ? void 0 : _temp$inputApiParamLi2.call(_temp$inputApiParamLi, v => {
                  return {
                    ...v,
                    ...v.apiParam
                  };
                })) || [];
              }

              // 主键过滤掉
              res = res.filter(v => !(v !== null && v !== void 0 && v.primaryFlag));
            } catch (e) {
              res = [];
            }
            return res;
          }
        };
      }
    },
    fields: [{
      label: intl.get('hmde.common.paramName').d('参数名称'),
      name: ParamsTableFN.PARAMS_NAME,
      type: "string"
    }, {
      label: intl.get('hmde.bo.apiModel.paramDescription').d('参数描述'),
      name: ParamsTableFN.PARAMS_REMARK,
      type: "string",
      maxLength: 60
    }, {
      label: intl.get('hmde.common.paramType').d('参数类型'),
      name: ParamsTableFN.REQUIRE_TYPE,
      type: "string",
      lookupCode: 'HMDE.API.PARAM.TYPE'
    }, {
      label: intl.get('hmde.common.manLength').d('最大长度'),
      name: ParamsTableFN.MAN_LENGTH,
      type: "number"
    }, {
      label: intl.get('hmde.common.digitalAccuracy').d('小数位数'),
      name: ParamsTableFN.DECIMALS,
      type: "number"
    }, {
      label: intl.get('hmde.common.isRequired').d('是否必输'),
      name: ParamsTableFN.IS_REQUIRED,
      type: "boolean"
    }, {
      label: intl.get('hmde.bo.businessObject.behavior').d('行为'),
      name: ParamsTableFN.BEHAVIOR,
      type: "string",
      lookupCode: 'HMDE.API.PARAM.BEHAVIOR'
    }]
  }), []);
  modal === null || modal === void 0 ? void 0 : modal.handleOk(async () => {
    if (tableDs !== null && tableDs !== void 0 && tableDs.selected.length) {
      const handleSave = () => {
        var _baseInfoDS$current3;
        modal.update({
          okProps: {
            loading: true
          }
        });
        request(`${lowcodeOrganizationURL({
          route: HZERO_HMDE
        })}/business-objects/api/${baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current3 = baseInfoDS.current) === null || _baseInfoDS$current3 === void 0 ? void 0 : _baseInfoDS$current3.get('businessObjectId')}/field?tenantId=${tenantId}&businessObjectApiId=${businessObjectApiIdRef === null || businessObjectApiIdRef === void 0 ? void 0 : businessObjectApiIdRef.current}`, {
          method: 'POST',
          data: (tableDs === null || tableDs === void 0 ? void 0 : tableDs.selected.map(v => v === null || v === void 0 ? void 0 : v.get('apiParamId'))) || []
        }).then(res => {
          if (getResponse(res)) {
            notification.success({
              message: intl.get('hmde.common.handleSuccess').d('操作成功')
            });
            listTableDS === null || listTableDS === void 0 ? void 0 : listTableDS.query();
            modal === null || modal === void 0 ? void 0 : modal.close();
          }
          modal.update({
            okProps: {
              loading: false
            }
          });
        });
      };
      const selectCodeArr = tableDs === null || tableDs === void 0 ? void 0 : tableDs.selected.map(v => v === null || v === void 0 ? void 0 : v.get('paramName'));
      const errorArr = [];
      listTableDS === null || listTableDS === void 0 ? void 0 : listTableDS.forEach(v => {
        if (selectCodeArr.includes(v === null || v === void 0 ? void 0 : v.get('businessObjectFieldCode'))) {
          errorArr.push({
            businessObjectFieldName: v === null || v === void 0 ? void 0 : v.get('businessObjectFieldName'),
            businessObjectFieldCode: v === null || v === void 0 ? void 0 : v.get('businessObjectFieldCode')
          });
        }
      });
      if (errorArr !== null && errorArr !== void 0 && errorArr.length) {
        _Modal.warning({
          title: intl.get('hmde.common.tips').d('提示'),
          children: `${intl.get('hmde.bo.businessObject.havesamecode').d('已存在相同编码的字段')} ${errorArr.map(v => `【${v.businessObjectFieldName}（${v.businessObjectFieldCode}）】`)}${intl.get('hmde.bo.businessObject.tipmessage2').d('继续引用将覆盖已有字段，请确认是否引用')}`,
          key: _Modal.key(),
          onOk: () => {
            handleSave();
          },
          footer: (okBtn, cancelBtn) => /*#__PURE__*/React.createElement(React.Fragment, null, cancelBtn, okBtn)
        });
      } else {
        setTimeout(() => {
          handleSave();
        });
      }
    }
    return false;
  });
  const columns = [{
    name: ParamsTableFN.PARAMS_NAME
  }, {
    name: ParamsTableFN.PARAMS_REMARK
  }, {
    name: ParamsTableFN.REQUIRE_TYPE
  }, {
    name: ParamsTableFN.MAN_LENGTH
  }, {
    name: ParamsTableFN.DECIMALS
  }, {
    name: ParamsTableFN.IS_REQUIRED
  }, {
    name: ParamsTableFN.BEHAVIOR
  }];
  const handleOptionsFilterXW = option => {
    if (option !== null && option !== void 0 && option.get('apiStandardUrl') && (option === null || option === void 0 ? void 0 : option.get('apiType')) !== 'COUNT') {
      return option;
    }
    return false;
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", null, intl.get('hmde.bo.businessObject.tipmessage3').d('选择标准API的参数生成对应类型的字段。')), /*#__PURE__*/React.createElement(_Form, {
    dataSet: FormDs,
    columns: 2,
    labelAlign: "left",
    labelWidth: 100
  }, /*#__PURE__*/React.createElement(_Select, {
    name: "type",
    optionsFilter: options => handleOptionsFilterXW(options)
  })), /*#__PURE__*/React.createElement(_Table, {
    dataSet: tableDs,
    defaultRowExpanded: true,
    queryBar: "none",
    queryBarProps: {
      fuzzyQueryPlaceholder: intl.get('hmde.bo.businessObject.codeorname').d('请输入字段名称、模板名称')
    },
    columns: columns
  }));
};
export default formatterCollections({
  code: ['hmde.common', 'hmde.bo']
})(observer(ShowExtendsFieldDetail));