import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _Select from "@hzero-front-ui/c7n-ui/lib/SelectPro";
import _Tooltip from "@hzero-front-ui/c7n-ui/lib/TooltipPro";
import _Icon from "choerodon-ui/pro/lib/icon";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import React, { useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import formatterCollections from 'utils/intl/formatterCollections';
import { FieldType } from 'choerodon-ui/pro/lib/data-set/enum';
import { FuncType } from 'choerodon-ui/pro/lib/button/enum';
import { FormLayout } from 'choerodon-ui/pro/lib/form/enum';
import intl from 'utils/intl';
import useDataSetEvents from 'hzero-front-apaas/lib/hooks/useDataSetEvents';
import { HZERO_HMDE } from "hzero-front-apaas/lib/utils/config";
import { lowcodeOrganizationURL } from "hzero-front-hmde/lib/utils/common";
import ImgIcon from "hzero-front-hmde/lib/utils/ImgIcon";
import { useBoStore } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/stores";
import BOPermissionButton from "hzero-front-hmde/lib/routes/BusinessObject/Detail/components/BOPermissionButton";
import { BindType } from "hzero-front-hmde/lib/utils/validate";
import { FieldsNameTypes } from "hzero-front-hmde/lib/stores/BusinessObject/PermissionPolicyDS";
import styles from "./index.less?modules";
var FN = /*#__PURE__*/function (FN) {
  FN["FIELDNAME"] = "businessObjectFieldCode";
  FN["DESENSITIZE_TYPE"] = "desensitizeType";
  FN["DESENSITIZE_RULE"] = "desensitizeRule";
  return FN;
}(FN || {});
const Index = props => {
  var _boStore$getState;
  const boStore = useBoStore();
  const hasPermission = (_boStore$getState = boStore === null || boStore === void 0 ? void 0 : boStore.getState('hasPermission')) !== null && _boStore$getState !== void 0 ? _boStore$getState : true;
  const parentDataSetValidateNode = props.parentDataSetValidateNode,
    baseInfoDs = props.baseInfoDs,
    parentDs = props.parentDs,
    readOnly = props.readOnly;

  // 字段ds
  const fieldDs = useMemo(() => {
    return new _DataSet({
      autoQuery: true,
      transport: {
        read: () => {
          var _baseInfoDs$current;
          return {
            url: `${lowcodeOrganizationURL({
              route: HZERO_HMDE
            })}/business-object-fields?businessObjectId=${baseInfoDs === null || baseInfoDs === void 0 ? void 0 : (_baseInfoDs$current = baseInfoDs.current) === null || _baseInfoDs$current === void 0 ? void 0 : _baseInfoDs$current.get('businessObjectId')}&componentTypes=TEXT_FIELD,PHONE_NUMBER,EMAIL,CODE_RULE,REFERENCE_FIELD`,
            method: 'GET'
          };
        }
      }
    });
  }, []);

  // 过滤条件ds
  const filterDs = useMemo(() => {
    return new _DataSet({
      autoQuery: false,
      selection: false,
      autoCreate: false,
      fields: [{
        name: FN.FIELDNAME,
        type: "string",
        label: intl.get('hmde.common.fieldName').d('字段名称'),
        options: fieldDs,
        textField: 'businessObjectFieldName',
        valueField: 'businessObjectFieldCode',
        required: true
      }, {
        name: FN.DESENSITIZE_TYPE,
        type: "string",
        label: intl.get('hmde.bo.businessObject.desensitizeType').d(' 脱敏类型'),
        required: true,
        lookupCode: 'HMDE.DESENSITIZE.TYPE'
      }, {
        name: FN.DESENSITIZE_RULE,
        label: intl.get('hmde.bo.businessObject.desensitizationRules').d('脱敏规则'),
        type: "string",
        pattern: /^[0-9][0-9,-]*$/,
        defaultValidationMessages: {
          patternMismatch: intl.get('hmde.bo.businessObject.desensitizationRules2').d(`仅允许数字、"-"、","  且需要以数字开头`)
        },
        computedProps: {
          required: ({
            record
          }) => {
            return (record === null || record === void 0 ? void 0 : record.get(FN.DESENSITIZE_TYPE)) !== 'HIDE';
          }
        }
      }]
    });
  }, []);
  useEffect(() => {
    var _parentDataSetValidat;
    parentDataSetValidateNode === null || parentDataSetValidateNode === void 0 ? void 0 : (_parentDataSetValidat = parentDataSetValidateNode.addDataSet) === null || _parentDataSetValidat === void 0 ? void 0 : _parentDataSetValidat.call(parentDataSetValidateNode, {
      name: FieldsNameTypes.SENSITIVE_LIST,
      dataSet: filterDs,
      bind: BindType.array
    });
  }, [filterDs, parentDataSetValidateNode]);

  // 删除item
  const deleteItem = record => {
    filterDs.remove(record);
  };
  useDataSetEvents(parentDs, 'load', ({
    dataSet
  }) => {
    var _dataSet$current, _dataSet$current$get;
    filterDs.loadData(((_dataSet$current = dataSet.current) === null || _dataSet$current === void 0 ? void 0 : (_dataSet$current$get = _dataSet$current.get) === null || _dataSet$current$get === void 0 ? void 0 : _dataSet$current$get.call(_dataSet$current, FieldsNameTypes.SENSITIVE_LIST)) || []);
  });

  // 加载数据
  useDataSetEvents(filterDs, ['update', 'remove', 'create'], ({
    dataSet
  }) => {
    var _parentDs$current;
    (_parentDs$current = parentDs.current) === null || _parentDs$current === void 0 ? void 0 : _parentDs$current.set(FieldsNameTypes.SENSITIVE_LIST, dataSet.toData());
  });
  const handleOptionsFilter = (option, r) => {
    const item = filterDs.find(v => (v === null || v === void 0 ? void 0 : v.get(FN.FIELDNAME)) === (option === null || option === void 0 ? void 0 : option.get('businessObjectFieldCode')));
    if (item && item.id !== r.id) {
      return false;
    }
    return option;
  };
  const topLabelList = useMemo(() => {
    return [{
      title: intl.get('hmde.common.fieldName').d('字段名称'),
      key: 1
    }, {
      title: intl.get('hmde.bo.businessObject.desensitizeType').d(' 脱敏类型'),
      tip: intl.get('hmde.bo.businessObject.desensitizeType.tips1').d('隐藏：字段不返回数据；脱敏：字段数据将按脱敏规则返回*'),
      key: 2
    }, {
      title: intl.get('hmde.bo.businessObject.desensitizationRules').d('脱敏规则'),
      tip: intl.get('hmde.bo.businessObject.desensitizeType.tips3').d('仅允许输入数字与符号"-"、","，例如输入"1-3,5,8-"，字符串的第1位到第3位，第5位，第8位以后均以*代替，下标从1开始'),
      key: 3
    }];
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: styles['desensitize-content']
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['desensitize-name']
  }, /*#__PURE__*/React.createElement("span", null, intl.get('hmde.bo.businessObject.desensitizationRules').d('脱敏规则')), !readOnly && /*#__PURE__*/React.createElement(BOPermissionButton, {
    funcType: "flat",
    icon: "add",
    onClick: () => {
      filterDs === null || filterDs === void 0 ? void 0 : filterDs.create({});
    }
  }, /*#__PURE__*/React.createElement("span", null, intl.get('hmde.bo.businessObject.addDesensitizeRule').d('添加脱敏规则')))), !!(filterDs !== null && filterDs !== void 0 && filterDs.length) && /*#__PURE__*/React.createElement("div", {
    className: styles['desensitize-config-detail']
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("i", null), topLabelList.map(v => {
    return /*#__PURE__*/React.createElement("span", {
      className: styles['desensitize-config-detail-label'],
      key: v.key
    }, v.title, v.tip && /*#__PURE__*/React.createElement(_Tooltip, {
      placement: "top",
      title: v.tip
    }, /*#__PURE__*/React.createElement(_Icon, {
      type: "help_outline"
    })));
  })), filterDs === null || filterDs === void 0 ? void 0 : filterDs.map(record => {
    return /*#__PURE__*/React.createElement(_Form, {
      record: record,
      key: record.index,
      className: styles['option-condition'],
      layout: "none",
      disabled: !hasPermission || readOnly
    }, /*#__PURE__*/React.createElement("i", null, record.index + 1), /*#__PURE__*/React.createElement("span", {
      className: styles['desensitize-config-detail-label']
    }, /*#__PURE__*/React.createElement(_Select, {
      name: FN.FIELDNAME,
      style: {
        width: '100%'
      },
      optionsFilter: options => handleOptionsFilter(options, record)
    })), /*#__PURE__*/React.createElement("span", {
      className: styles['desensitize-config-detail-label']
    }, /*#__PURE__*/React.createElement(_Select, {
      name: FN.DESENSITIZE_TYPE,
      style: {
        width: '100%'
      }
    })), /*#__PURE__*/React.createElement("span", {
      className: styles['desensitize-config-detail-label']
    }, (record === null || record === void 0 ? void 0 : record.get(FN.DESENSITIZE_TYPE)) !== 'HIDE' && /*#__PURE__*/React.createElement(_TextField, {
      name: FN.DESENSITIZE_RULE,
      style: {
        width: '100%'
      }
    })), !readOnly && /*#__PURE__*/React.createElement(ImgIcon, {
      name: "delete-B16@1x.svg",
      className: styles['delete-button'],
      size: 16,
      onClick: () => {
        if (!hasPermission) return;
        deleteItem(record);
      }
    }));
  })));
};
export default formatterCollections({
  code: ['hmde.bo', 'hmde.common']
})(observer(Index));