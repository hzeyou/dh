import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _TreeSelect from "@hzero-front-ui/c7n-ui/lib/TreeSelectPro";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _Select from "@hzero-front-ui/c7n-ui/lib/SelectPro";
import _Icon from "choerodon-ui/pro/lib/icon";
import _Tooltip from "@hzero-front-ui/c7n-ui/lib/Tooltip";
import _Output from "@hzero-front-ui/c7n-ui/lib/OutputPro";
import _Modal from "@hzero-front-ui/c7n-ui/lib/ModalPro";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _isString from "lodash/isString";
import React, { useEffect } from 'react';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import DrillComponent, { EDrillMainKeyType, EDrillPublishType } from 'hzero-front-apaas/lib/components/DrillComponent';
import useBusinessObjectOperator from 'hzero-front-apaas/lib/hooks/useBusinessObjectOperator';
import { observer } from 'mobx-react-lite';
import { FormLayout, ShowValidation } from 'choerodon-ui/pro/lib/form/enum';
// import { ButtonColor } from 'choerodon-ui/pro/lib/button/enum';
import { Tooltip } from 'choerodon-ui/pro/lib/core/enum';
import { FilterFieldsNameType, IRightValueType } from "hzero-front-hmde/lib/stores/BusinessObject/PermissionPolicyDS";
// import { getThemeColor } from '@apaas/utils/common';
import { FieldOperatorType, FieldComponentType } from "hzero-front-apaas/lib/constants/businessObject";
import { getDrillFIeldType } from "hzero-front-hmde/lib/utils/common";
import { getApiObjectParams, EEnvironmentCode } from "hzero-front-hmde/lib/utils/queryApiObjectFields";
import { getCascadeName } from "hzero-front-hmde/lib/services/permissionPolicy";
import RecordIndex from "hzero-front-hmde/lib/businessComponents/RecordIndex";
import { SQL_PARAM_CATEGORY } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/SqlMaintenance/datasets/sqlParamsDS";
import OrgStructure from "../OrgStructure";
import styles from "../../index.less?modules";
const DataRangeItem = ({
  deleteIcon,
  record,
  index,
  businessObjectCode,
  openSqlModal,
  baseInfoDs,
  disabled,
  predefineList = [],
  commonDataRange = [],
  handleCreateItem,
  customDataRangeRecords,
  otherDrillParams = {}
}) => {
  var _record$getState, _record$getState2, _dComponentOptionalPr2, _record$get;
  // const { primary, step1 } = getThemeColor();

  const hiddenStyle = [FieldOperatorType.IS_NULL, FieldOperatorType.IS_NOT_NULL].includes(record === null || record === void 0 ? void 0 : record.get(FilterFieldsNameType.OPERATOR_TYPE)) ? {
    visibility: 'hidden'
  } : {
    visibility: 'visible'
  };
  const _useBusinessObjectOpe = useBusinessObjectOperator({
      businessObjectCode: (_record$getState = record.getState('drillData')) === null || _record$getState === void 0 ? void 0 : _record$getState.businessObjectCode,
      businessObjectFieldCode: (_record$getState2 = record.getState('drillData')) === null || _record$getState2 === void 0 ? void 0 : _record$getState2.businessObjectFieldCode,
      draftFieldFlag: true
    }, record === null || record === void 0 ? void 0 : record.get(FilterFieldsNameType.OPERATOR_TYPE)),
    _useBusinessObjectOpe2 = _slicedToArray(_useBusinessObjectOpe, 3),
    optionalOperators = _useBusinessObjectOpe2[0],
    dynamicComponent = _useBusinessObjectOpe2[1],
    dComponentOptionalProps = _useBusinessObjectOpe2[2];
  useEffect(() => {
    var _dComponentOptionalPr;
    record.setState('range', dComponentOptionalProps === null || dComponentOptionalProps === void 0 ? void 0 : (_dComponentOptionalPr = dComponentOptionalProps.componentProps) === null || _dComponentOptionalPr === void 0 ? void 0 : _dComponentOptionalPr.range);
  }, [dComponentOptionalProps === null || dComponentOptionalProps === void 0 ? void 0 : (_dComponentOptionalPr2 = dComponentOptionalProps.componentProps) === null || _dComponentOptionalPr2 === void 0 ? void 0 : _dComponentOptionalPr2.range]);
  const openOrgModal = () => {
    return _Modal.open({
      title: intl.get('hmde.bo.businessObject.commonDataRange').d('常用数据范围'),
      closable: true,
      destroyOnClose: true,
      children: /*#__PURE__*/React.createElement(OrgStructure, {
        baseInfoDs: baseInfoDs,
        commonDataRange: commonDataRange,
        handleCreateItem: handleCreateItem,
        record: record
      }),
      style: {
        width: '957px'
      }
    });
  };
  useEffect(() => {
    if ((record === null || record === void 0 ? void 0 : record.get('rightValueType')) === 'template' && !(record !== null && record !== void 0 && record.get('leftFieldName'))) {
      getCascadeName({
        referenceFormula: record === null || record === void 0 ? void 0 : record.get('leftFieldCode')
      }).then(res => {
        if (res && res.failed) return;
        if (res !== null && res !== void 0 && res.length) {
          let leftFieldName = '';
          res.forEach((v, i) => {
            leftFieldName += `${i === 0 ? '' : ','}${v.businessObjectName}.${v.businessObjectFieldName}`;
          });
          record === null || record === void 0 ? void 0 : record.init('leftFieldName', leftFieldName);
        }
      });
    }
  }, [record === null || record === void 0 ? void 0 : record.get('leftFieldName')]);
  useEffect(() => {
    if ((record === null || record === void 0 ? void 0 : record.get('rightValueType')) === 'template' && !(record !== null && record !== void 0 && record.get('templateName'))) {
      let templateName = '';
      commonDataRange === null || commonDataRange === void 0 ? void 0 : commonDataRange.some(v => {
        var _v$templateList;
        return v === null || v === void 0 ? void 0 : (_v$templateList = v.templateList) === null || _v$templateList === void 0 ? void 0 : _v$templateList.some(item => {
          if (item.templateCode === (record === null || record === void 0 ? void 0 : record.get('rightValue'))) {
            templateName = item.templateName;
            return true;
          }
        });
      });
      record === null || record === void 0 ? void 0 : record.init('templateName', templateName);
    }
  }, [commonDataRange]);
  const useTypeFlag = (record === null || record === void 0 ? void 0 : record.get(FilterFieldsNameType.USE_TYPE)) === SQL_PARAM_CATEGORY.QUERY_PARAM;
  return /*#__PURE__*/React.createElement(_Form, {
    key: (_record$get = record === null || record === void 0 ? void 0 : record.get('dataFilterId')) !== null && _record$get !== void 0 ? _record$get : record.key,
    record: record,
    layout: "none",
    showValidation: "tooltip",
    className: `${styles['condition-config']} ${(record === null || record === void 0 ? void 0 : record.get('rightValueType')) === 'template' ? styles['condition-config-template'] : ''}`
    // useColon={false}
    ,
    disabled: disabled
  }, /*#__PURE__*/React.createElement(_Output, {
    name: FilterFieldsNameType.ORDER_SEQ,
    renderer: () => {
      // const orderSeq = index + 1;
      // return orderSeq;
      return /*#__PURE__*/React.createElement(RecordIndex, {
        index: index,
        dataSet: customDataRangeRecords
      });
    }
  }), (record === null || record === void 0 ? void 0 : record.get('rightValueType')) === 'template' ? /*#__PURE__*/React.createElement("div", {
    className: styles.leftFieldNameStyle
  }, /*#__PURE__*/React.createElement(_Tooltip, {
    title: `可查询【${(record === null || record === void 0 ? void 0 : record.get('leftFieldName')) || ''}】在【${(record === null || record === void 0 ? void 0 : record.get('templateName')) || ''}】其中的数据。`,
    placement: "top",
    theme: "dark"
  }, /*#__PURE__*/React.createElement("span", null, `可查询【${(record === null || record === void 0 ? void 0 : record.get('leftFieldName')) || ''}】在【${(record === null || record === void 0 ? void 0 : record.get('templateName')) || ''}】其中的数据。`)), /*#__PURE__*/React.createElement(_Icon, {
    type: "edit-o",
    onClick: openOrgModal
  })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_Output, {
    name: FilterFieldsNameType.LEFT_FIELD_CODE,
    renderer: () => {
      var _baseInfoDs$current, _baseInfoDs$current$g;
      return /*#__PURE__*/React.createElement(DrillComponent, {
        queryHandleBeforeFetch: (level, query) => {
          if (level > 6) {
            return {
              ...query,
              excludeComponentTypeList: ['LINK_RELATION', 'MASTER_RELATION']
            };
          }
          return query;
        },
        disabled: useTypeFlag,
        excludeFieldList: ['organizationId', 'tenantId'],
        drillPublishType: EDrillPublishType.ONLY_FIRST
        // selectObjectCheckFlag
        ,
        selectAdvancedRelationshipCheckFlag: true
        // name={FilterFieldsNameType.LEFT_FIELD_CODE}
        ,
        initValue: (record === null || record === void 0 ? void 0 : record.get(FilterFieldsNameType.LEFT_FIELD_CODE)) || '',
        businessObjectCode: businessObjectCode,
        drillMainKeyType: EDrillMainKeyType.ALL,
        isWriteBack: true,
        otherDrillParams: {
          ...((baseInfoDs === null || baseInfoDs === void 0 ? void 0 : (_baseInfoDs$current = baseInfoDs.current) === null || _baseInfoDs$current === void 0 ? void 0 : (_baseInfoDs$current$g = _baseInfoDs$current.get) === null || _baseInfoDs$current$g === void 0 ? void 0 : _baseInfoDs$current$g.call(_baseInfoDs$current, 'physicalModelType')) === 'API' ? getApiObjectParams(EEnvironmentCode.PERMISSION_POLICY_CUSTOM_CONDITION_DRILL) : {}),
          ...otherDrillParams
        },
        onChange: (res = {}) => {
          // 向兄弟级联关系传入数据
          record.setState('drillData', res);
        },
        onOk: res => {
          var _res$result;
          record === null || record === void 0 ? void 0 : record.set(FilterFieldsNameType.LEFT_FIELD_TYPE, res === null || res === void 0 ? void 0 : (_res$result = res.result) === null || _res$result === void 0 ? void 0 : _res$result.componentType);
          // 判断钻取的层级,如果只有一层过滤掉拼接语句
          // const _str = res.value.match( /(?<=CASCADE\().+(?=\))/)[0].split(',');
          record === null || record === void 0 ? void 0 : record.set(FilterFieldsNameType.LEFT_FIELD_CODE, res === null || res === void 0 ? void 0 : res.value);
        },
        componentTypeList: getDrillFIeldType === null || getDrillFIeldType === void 0 ? void 0 : getDrillFIeldType(['FORMULA'])
      });
    }
  }), /*#__PURE__*/React.createElement(_Select, {
    name: FilterFieldsNameType.OPERATOR_TYPE,
    options: optionalOperators,
    notFoundContent: dComponentOptionalProps.loading ? `${intl.get('hmde.common.status.loading').d('加载中')}...` : intl.get('hmde.common.nodata').d('暂无数据')
  }), /*#__PURE__*/React.createElement(_Select, {
    name: FilterFieldsNameType.RIGHT_VALUE_TYPE,
    style: hiddenStyle,
    optionRenderer: ({
      text,
      value
    }) => {
      var _record$getState3;
      if ((record === null || record === void 0 ? void 0 : (_record$getState3 = record.getState('drillData')) === null || _record$getState3 === void 0 ? void 0 : _record$getState3.componentType) === 'PRIMARY_KEY' && value === IRightValueType.FIXED) {
        return /*#__PURE__*/React.createElement(React.Fragment, null, text, /*#__PURE__*/React.createElement(_Tooltip, {
          title: intl.get('hmde.bo.businessObject.masterFilterError').d('主键无法直接使用固定值进行过滤'),
          placement: "top"
        }, /*#__PURE__*/React.createElement(_Icon, {
          type: "info_outline",
          style: {
            margin: '-3px 0px 0px 2px'
          }
        })));
      }
      return `${text}`;
    },
    onOption: ({
      record: optionRecord
    }) => {
      var _record$getState4;
      return {
        disabled: (record === null || record === void 0 ? void 0 : (_record$getState4 = record.getState('drillData')) === null || _record$getState4 === void 0 ? void 0 : _record$getState4.componentType) === 'PRIMARY_KEY' && (optionRecord === null || optionRecord === void 0 ? void 0 : optionRecord.get('value')) === IRightValueType.FIXED
      };
    },
    optionsFilter: obj => {
      var _record$getState5;
      // api类型业务对象不能取 自定义sql
      // if (
      //   baseInfoDs?.current?.get?.('physicalModelType') === 'API' &&
      //   obj?.get('value') === 'sql'
      // ) {
      //   return false;
      // }
      // 从主/关联关系类型字段，不可选择”固定值”
      const componentType = record === null || record === void 0 ? void 0 : (_record$getState5 = record.getState('drillData')) === null || _record$getState5 === void 0 ? void 0 : _record$getState5.componentType;
      const excludeComponentTypes = [FieldComponentType.MASTER_RELATION, FieldComponentType.LINK_RELATION
      // FieldComponentType.PRIMARY_KEY,
      ];
      if (excludeComponentTypes.includes(componentType) && (obj === null || obj === void 0 ? void 0 : obj.get('value')) === 'fixed') {
        return false;
      }
      // 操作符选择 在其中 不在其中 介于 不可选预置变量
      const operatorType = record === null || record === void 0 ? void 0 : record.get(FilterFieldsNameType.OPERATOR_TYPE);
      const excludeOperatorTypes = [FieldOperatorType.IN, FieldOperatorType.NOT_IN, FieldOperatorType.RANGE];
      if (excludeOperatorTypes.includes(operatorType) && (obj === null || obj === void 0 ? void 0 : obj.get('value')) === 'predefine') {
        return false;
      }
      return true;
    }
  }), /*#__PURE__*/React.createElement(_Output, {
    style: {
      position: 'relative',
      border: 'none',
      lineHeight: 0,
      background: 'none',
      ...hiddenStyle
    },
    renderer: ({
      record: _record
    }) => {
      const rightValueType = _record === null || _record === void 0 ? void 0 : _record.get(FilterFieldsNameType.RIGHT_VALUE_TYPE);
      // const _field = _dataset?.getField(FilterFieldsNameType.RIGHT_VALUE);
      if (rightValueType === IRightValueType.SQL) {
        return /*#__PURE__*/React.createElement(_TextField, {
          readOnly: true,
          name: FilterFieldsNameType.RIGHT_VALUE,
          suffix: /*#__PURE__*/React.createElement(_Icon, {
            type: "gongshi"
          }),
          style: {
            width: '100%'
          },
          onClick: () => _record && openSqlModal(_record, disabled),
          renderer: ({
            record: _Trecord
          }) => _Trecord === null || _Trecord === void 0 ? void 0 : _Trecord.get(FilterFieldsNameType.EXPRESSTION_NAME)
        });
      } else if (rightValueType === IRightValueType.PREDEFINE) {
        return /*#__PURE__*/React.createElement(_Select, {
          name: FilterFieldsNameType.RIGHT_VALUE,
          style: {
            width: '100%'
          },
          optionTooltip: "always",
          options: new _DataSet({
            paging: false,
            data: predefineList
          })
        });
      } else if (rightValueType === IRightValueType.FIXED) {
        if (!dynamicComponent) return null;
        const renderComponent = dComponentOptionalProps.renderComponent,
          componentProps = dComponentOptionalProps.componentProps;
        // 特殊数组处理
        if (componentProps.range || componentProps.multiple) {
          const value = _record === null || _record === void 0 ? void 0 : _record.get(FilterFieldsNameType.RIGHT_VALUE);
          if (_isString(value)) {
            _record === null || _record === void 0 ? void 0 : _record.set(FilterFieldsNameType.RIGHT_VALUE, value.split(','));
          }
        }
        return renderComponent(record, FilterFieldsNameType.RIGHT_VALUE);
      } else if (rightValueType === IRightValueType.TEMPLATE) {
        return /*#__PURE__*/React.createElement(_TreeSelect, {
          name: FilterFieldsNameType.RIGHT_VALUE,
          treeDefaultExpandAll: true
        }, commonDataRange.map(v => {
          var _v$templateList2;
          return /*#__PURE__*/React.createElement(_TreeSelect.TreeNode, {
            value: v.groupCode,
            key: v.groupCode,
            title: v.groupName,
            disabled: true
          }, v === null || v === void 0 ? void 0 : (_v$templateList2 = v.templateList) === null || _v$templateList2 === void 0 ? void 0 : _v$templateList2.map(item => /*#__PURE__*/React.createElement(_TreeSelect.TreeNode, {
            value: item.templateCode,
            key: item.templateCode,
            title: item.templateName
          })));
        }));
      } else {
        return /*#__PURE__*/React.createElement(_TextField, {
          name: FilterFieldsNameType.RIGHT_VALUE,
          style: {
            width: '100%'
          }
        });
      }
    }
  })), !useTypeFlag && deleteIcon);
};
export default formatterCollections({
  code: ['hmde.common', 'hmde.bo']
})(observer(DataRangeItem));