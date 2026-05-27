import _Table from "@hzero-front-ui/c7n-ui/lib/TablePro";
import _Popconfirm from "@hzero-front-ui/c7n-ui/lib/Popconfirm";
import _Tooltip from "@hzero-front-ui/c7n-ui/lib/TooltipPro";
import _useModal from "choerodon-ui/pro/lib/use-modal";
import React, { useEffect, useImperativeHandle, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { operatorRender } from 'utils/renderer';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { getResponse, isTenantRoleLevel } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import { ColumnLock, TableQueryBarType } from 'choerodon-ui/pro/lib/table/enum';
import { Tooltip as TooltipProps } from 'choerodon-ui/pro/lib/core/enum';
import { SourceType } from "hzero-front-apaas/lib/constants/businessObject";
import PopconfirmButton from "hzero-front-hmde/lib/components/PopconfirmButton";
import { renderPopConfirmTitle } from "hzero-front-apaas/lib/utils/render";
import { disableBusinessObjectRule, enableBusinessObjectRule } from "hzero-front-hmde/lib/services/businessObjectService";
import BOPermissionButton from "hzero-front-hmde/lib/routes/BusinessObject/Detail/components/BOPermissionButton";
import { enableRender } from "hzero-front-apaas/lib/utils/render";
import RuleCreteAndEdit from "./Rule";
import parentStyles from "../index.less?modules";
const isTenant = isTenantRoleLevel();
const Index = props => {
  var _baseInfoDS$current;
  const ruleDS = props.ruleDS,
    businessObjectId = props.match.params.id,
    businessObjectCode = props.businessObjectCode,
    businessObjectName = props.businessObjectName,
    domainId = props.domainId,
    baseInfoDS = props.baseInfoDS,
    businessRuleRef = props.businessRuleRef,
    readOnlyFlag = props.readOnlyFlag,
    showVersion = props.showVersion;
  const Modal = _useModal();
  const isApiTenantType = (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current = baseInfoDS.current) === null || _baseInfoDS$current === void 0 ? void 0 : _baseInfoDS$current.get('physicalModelType')) === 'API' && isTenant;
  const predefineDisabled = useMemo(() => {
    var _baseInfoDS$current2;
    return (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current2 = baseInfoDS.current) === null || _baseInfoDS$current2 === void 0 ? void 0 : _baseInfoDS$current2.get('sourceType')) === SourceType.PREDEFINE;
  }, [baseInfoDS]);
  useImperativeHandle(businessRuleRef, () => ({
    initData
  }));
  useEffect(() => {
    initData();
  }, [ruleDS, businessObjectCode]);
  const initData = async () => {
    if (businessObjectCode) {
      await ruleDS.query();
    }
    baseInfoDS.query();
  };
  const handleDisableRule = async data => {
    const res = await disableBusinessObjectRule(data);
    if (getResponse(res, _res => {
      const msg = (_res === null || _res === void 0 ? void 0 : _res.message) || (_res === null || _res === void 0 ? void 0 : _res.code);
      notification.warning({
        message: intl.get('hmde.common.disableError').d('禁用失败'),
        description: msg
      });
    })) {
      ruleDS.query();
      baseInfoDS.query();
    }
  };
  const handleEnableRule = async data => {
    const res = await enableBusinessObjectRule(data);
    if (getResponse(res)) {
      ruleDS.query();
      baseInfoDS.query();
    }
  };

  // [新建] [编辑]业务规则
  const handleCreateOrEditRule = (editorRuleId, isCustomRule) => {
    const createRuleProps = {
      businessObjectId,
      ruleId: editorRuleId,
      businessObjectCode,
      cacheTotalCount: ruleDS.totalCount,
      businessObjectName,
      domainId,
      ruleDS,
      baseInfoDS,
      isCustomRule,
      predefineDisabled,
      readOnlyFlag,
      showVersion,
      isApiTenantType
    };
    return Modal.open({
      title: editorRuleId ? intl.get('hmde.bo.businessObject.editRuleModalTitle').d('编辑业务规则') : intl.get('hmde.bo.businessObject.createRuleModalTitle').d('新建业务规则'),
      destroyOnClose: true,
      closable: true,
      drawer: !!editorRuleId,
      // SB-UI: 新建是弹框；编辑是抽屉
      style: {
        width: 1000
      },
      children: /*#__PURE__*/React.createElement(RuleCreteAndEdit, createRuleProps),
      cancelText: intl.get('hmde.common.button.cancel').d('取消'),
      // 租户级继承平台标准的隐藏确认按钮
      footer: (onOkBtn, cancelBtn) => /*#__PURE__*/React.createElement(React.Fragment, null, cancelBtn, isTenant && editorRuleId && !isCustomRule || predefineDisabled || isApiTenantType ? null : onOkBtn)
    });
  };
  const buttons = () => {
    var _baseInfoDS$current3, _baseInfoDS$current4;
    const boSourceType = (_baseInfoDS$current3 = baseInfoDS.current) === null || _baseInfoDS$current3 === void 0 ? void 0 : _baseInfoDS$current3.get('sourceType');
    const businessObjectCategory = (_baseInfoDS$current4 = baseInfoDS.current) === null || _baseInfoDS$current4 === void 0 ? void 0 : _baseInfoDS$current4.get('businessObjectCategory');
    // 组户级看到平台参数对象 直接不给任何操作
    if (isTenant && boSourceType === 'PLATFORM' && businessObjectCategory === 'DIMENSION') {
      // 组户级看到平台参数对象 直接不给任何操作
      return [];
    }
    return [/*#__PURE__*/React.createElement(BOPermissionButton, {
      icon: "add",
      disabled: readOnlyFlag || isApiTenantType,
      onClick: () => handleCreateOrEditRule(''),
      hidden: predefineDisabled
    }, intl.get('hmde.common.button.create').d('新建'))];
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h3", {
    className: parentStyles.title,
    style: {
      marginBottom: '12px'
    }
  }, intl.get('hmde.common.rules').d('业务规则')), /*#__PURE__*/React.createElement(_Table, {
    dataSet: ruleDS,
    queryBar: "filterBar",
    queryBarProps: {
      fuzzyQueryPlaceholder: intl.get('hmde.bo.businessObject.EnterrulenameOrcode').d('请输入规则名称、编码等')
    },
    buttons: buttons(),
    columns: [{
      name: 'ruleName',
      tooltip: 'overflow',
      renderer: ({
        value,
        record
      }) => {
        return /*#__PURE__*/React.createElement("a", {
          style: {
            verticalAlign: 'text-bottom'
          },
          onClick: () => handleCreateOrEditRule(record === null || record === void 0 ? void 0 : record.get('validateRuleId'), (record === null || record === void 0 ? void 0 : record.get('ruleSourceType')) === 'CUSTOM')
        }, value);
      }
    }, {
      name: 'ruleCode',
      tooltip: 'overflow'
    }, {
      name: 'ruleType',
      renderer: ({
        value
      }) => {
        const map = {
          RECHECK_RULE: intl.get('hmde.bo.businessObject.checkRule').d('查重规则'),
          REGEXP_VALIDATE: intl.get('hmde.bo.businessObject.regularCheck').d('正则校验'),
          FORMULA_VALIDATE: intl.get('hmde.bo.businessObject.formulaCheck').d('公式校验'),
          CUSTOM_RULE: intl.get('hmde.bo.businessObject.customRules').d('自定义规则')
        };
        return map[value];
      }
    }, {
      name: 'enabledFlag',
      renderer: ({
        value
      }) => enableRender(value)
    }, {
      name: 'ruleSourceType',
      renderer: ({
        value
      }) => {
        const map = {
          CUSTOM: intl.get('hmde.common.custom').d('自定义'),
          PREDEFINE: intl.get('hmde.common.standard').d('标准')
        };
        return map[value];
      }
    }, {
      name: 'errorInfoMeaning',
      tooltip: TooltipProps.overflow
    }, {
      header: intl.get('hmde.common.table.column.operate').d('操作'),
      width: 120,
      lock: "right",
      hidden: predefineDisabled,
      renderer: ({
        record
      }) => {
        const middleObjWrapper = (text, dom) => {
          const operatorProps = {
            ele: null,
            len: text.length,
            title: text
          };
          if (!(record !== null && record !== void 0 && record.get('operationalFlag'))) {
            var _baseInfoDS$current5;
            operatorProps.title = '';
            operatorProps.ele = /*#__PURE__*/React.createElement(_Tooltip, {
              title: (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current5 = baseInfoDS.current) === null || _baseInfoDS$current5 === void 0 ? void 0 : _baseInfoDS$current5.get('businessObjectCategory')) === 'DIMENSION' ? '' : intl.get('hmde.bo.businessObject.help.middleHelpTooltip').d('与目标对象关系成立的业务规则，不允许禁用、删除。')
            }, /*#__PURE__*/React.createElement(BOPermissionButton, {
              componentType: "a",
              disabled: readOnlyFlag,
              style: {
                color: 'rgb(140, 140, 140)'
              }
            }, text));
          } else {
            operatorProps.ele = dom;
          }
          return operatorProps;
        };
        const deleteText = intl.get('hmde.common.button.delete').d('删除');
        const disableText = intl.get('hmde.common.button.disable').d('禁用');
        const operators = [];
        if (isTenant && (record === null || record === void 0 ? void 0 : record.get('ruleSourceType')) === 'CUSTOM') {
          var _record$toData;
          operators.unshift({
            key: 'delete',
            ...middleObjWrapper(deleteText, /*#__PURE__*/React.createElement(PopconfirmButton, {
              title: intl.get('hmde.bo.businessObject.confirm.deleteRuleNew').d('请确认是否删除该业务规则，删除并发布后相关数据会失效。'),
              titleTips: intl.get('hmde.bo.businessObject.deletetip').d('是否删除'),
              text: deleteText,
              busLimits: true,
              onConfirm: () => {
                if (record) {
                  ruleDS.delete(record, false).then(res => {
                    if (res) {
                      baseInfoDS.query();
                    }
                  });
                }
              },
              styles: {
                verticalAlign: 'top',
                marginLeft: '16px'
              },
              delUrl: `/business-object-validate-rules/${record === null || record === void 0 ? void 0 : record.get('validateRuleId')}?checkFlag=true`,
              method: "DELETE",
              data: record === null || record === void 0 ? void 0 : (_record$toData = record.toData) === null || _record$toData === void 0 ? void 0 : _record$toData.call(record),
              params: {
                validateRuleId: record === null || record === void 0 ? void 0 : record.get('validateRuleId')
              },
              disabled: readOnlyFlag || isApiTenantType
            }))
          });
          if (record !== null && record !== void 0 && record.get('enabledFlag')) {
            var _record$toData2;
            operators.unshift({
              key: 'disable',
              ...middleObjWrapper(disableText, /*#__PURE__*/React.createElement(PopconfirmButton
              // title={intl
              //   .get('hmde.bo.businessObject.confirm.disableBusinessRuleObj')
              //   .d('请确认是否禁用该业务规则？')}
              , {
                titleTips: intl.get('hmde.common.message.disableTips').d(`是否禁用`),
                text: disableText,
                busLimits: true,
                onConfirm: () => handleDisableRule(record === null || record === void 0 ? void 0 : record.toData()),
                styles: {
                  verticalAlign: 'top'
                },
                delUrl: `/business-object-validate-rules/${record === null || record === void 0 ? void 0 : record.get('validateRuleId')}/disable?checkFlag=true`,
                method: "PUT",
                data: record === null || record === void 0 ? void 0 : (_record$toData2 = record.toData) === null || _record$toData2 === void 0 ? void 0 : _record$toData2.call(record),
                disabled: readOnlyFlag || isApiTenantType
              }))
            });
          } else {
            operators.unshift({
              key: 'disable',
              ele: /*#__PURE__*/React.createElement(_Popconfirm, {
                title: renderPopConfirmTitle('', intl.get('hmde.common.isEnabled').d(`是否启用`)),
                okText: intl.get('hmde.common.button.sure').d('确定'),
                cancelText: intl.get('hmde.common.button.cancel').d('取消'),
                onConfirm: () => handleEnableRule(record === null || record === void 0 ? void 0 : record.toData())
              }, /*#__PURE__*/React.createElement(BOPermissionButton, {
                componentType: "a",
                style: {
                  verticalAlign: 'text-bottom'
                },
                disabled: readOnlyFlag || isApiTenantType
              }, intl.get('hmde.common.button.enable').d('启用'))),
              len: 2,
              title: intl.get('hmde.common.button.enable').d('启用')
            });
          }
        } else if (!isTenant) {
          var _record$toData3;
          operators.unshift({
            key: 'delete',
            ...middleObjWrapper(deleteText, /*#__PURE__*/React.createElement(PopconfirmButton, {
              title: intl.get('hmde.bo.businessObject.confirm.deleteRuleNew').d('请确认是否删除该业务规则，删除并发布后相关数据会失效。'),
              titleTips: intl.get('hmde.bo.businessObject.deletetip').d('是否删除'),
              text: deleteText,
              busLimits: true,
              onConfirm: () => {
                if (record) {
                  ruleDS.delete(record, false).then(res => {
                    if (res) {
                      baseInfoDS.query();
                    }
                  });
                }
              },
              styles: {
                verticalAlign: 'top',
                marginLeft: '16px'
              },
              delUrl: `/business-object-validate-rules/${record === null || record === void 0 ? void 0 : record.get('validateRuleId')}?checkFlag=true`,
              method: "DELETE",
              data: record === null || record === void 0 ? void 0 : (_record$toData3 = record.toData) === null || _record$toData3 === void 0 ? void 0 : _record$toData3.call(record),
              params: {
                validateRuleId: record === null || record === void 0 ? void 0 : record.get('validateRuleId')
              },
              disabled: readOnlyFlag || isApiTenantType
            }))
          });
          if (record !== null && record !== void 0 && record.get('enabledFlag')) {
            var _record$toData4;
            operators.unshift({
              key: 'disable',
              ...middleObjWrapper(disableText, /*#__PURE__*/React.createElement(PopconfirmButton
              // title={intl
              //   .get('hmde.bo.businessObject.confirm.disableBusinessRuleObj')
              //   .d('请确认是否禁用该业务规则？')}
              , {
                titleTips: intl.get('hmde.common.message.disableTips').d(`是否禁用`),
                text: disableText,
                busLimits: true,
                onConfirm: () => handleDisableRule(record === null || record === void 0 ? void 0 : record.toData()),
                styles: {
                  verticalAlign: 'top'
                },
                delUrl: `/business-object-validate-rules/${record === null || record === void 0 ? void 0 : record.get('validateRuleId')}/disable?checkFlag=true`,
                method: "PUT",
                data: record === null || record === void 0 ? void 0 : (_record$toData4 = record.toData) === null || _record$toData4 === void 0 ? void 0 : _record$toData4.call(record),
                disabled: readOnlyFlag || isApiTenantType
              }))
            });
          } else {
            operators.unshift({
              key: 'disable',
              ele: /*#__PURE__*/React.createElement(_Popconfirm, {
                title: renderPopConfirmTitle('', intl.get('hmde.common.isEnabled').d(`是否启用`)),
                okText: intl.get('hmde.common.button.sure').d('确定'),
                cancelText: intl.get('hmde.common.button.cancel').d('取消'),
                onConfirm: () => handleEnableRule(record === null || record === void 0 ? void 0 : record.toData())
              }, /*#__PURE__*/React.createElement(BOPermissionButton, {
                componentType: "a",
                style: {
                  verticalAlign: 'text-bottom'
                },
                disabled: readOnlyFlag || isApiTenantType
              }, intl.get('hmde.common.button.enable').d('启用'))),
              len: 2,
              title: intl.get('hmde.common.button.enable').d('启用')
            });
          }
        }
        return operatorRender(operators, record);
      }
    }]
  }));
};
export default formatterCollections({
  code: ['hmde.bo', 'hmde.common']
})(observer(Index));