import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _Select from "@hzero-front-ui/c7n-ui/lib/SelectPro";
import _Output from "@hzero-front-ui/c7n-ui/lib/OutputPro";
import _Tooltip from "@hzero-front-ui/c7n-ui/lib/TooltipPro";
import _Icon from "choerodon-ui/pro/lib/icon";
import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { isTenantRoleLevel } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import useDataSetEvents from 'hzero-front-apaas/lib/hooks/useDataSetEvents';
import { FieldComponentType } from 'hzero-front-apaas/lib/constants/businessObject';
import intl from 'utils/intl';
import { ButtonColor, FuncType } from 'choerodon-ui/pro/lib/button/enum';
import { FormLayout } from 'choerodon-ui/pro/lib/form/enum';
import { SourceType } from "hzero-front-apaas/lib/constants/businessObject";
import LovToBoDetail from "hzero-front-hmde/lib/businessComponents/LovToBoDetail";
import { useBoStore } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/stores";
import BOPermissionButton from "hzero-front-hmde/lib/routes/BusinessObject/Detail/components/BOPermissionButton";
import { queryDefaultOptionNew } from "hzero-front-hmde/lib/services/businessObjectService";
import useThemeColor from "hzero-front-apaas/lib/hooks/useThemeColor";
import { SQL_PARAM_CATEGORY } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/SqlMaintenance/datasets/sqlParamsDS";
import { textType, numberType, FN } from "../type";
import styles from "../../index.less?modules";
const isTenantRole = isTenantRoleLevel();
const Index = ({
  type,
  readOnlyFlag,
  businessObjectAssociateId,
  baseInfoDS,
  tableDs,
  advanceDetailDs,
  conditionFilterFIelds = [],
  paramObjDisabledFlag
}) => {
  var _boStore$getState, _baseInfoDS$current, _baseInfoDS$current3;
  const boStore = useBoStore();
  const hasPermission = (_boStore$getState = boStore === null || boStore === void 0 ? void 0 : boStore.getState('hasPermission')) !== null && _boStore$getState !== void 0 ? _boStore$getState : true;
  const themeColor = useThemeColor();
  // 预制领域下 高级关系 无法编辑处理
  const isPredEfineFlag = type === 'edit' && (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current = baseInfoDS.current) === null || _baseInfoDS$current === void 0 ? void 0 : _baseInfoDS$current.get('sourceType')) === SourceType.PREDEFINE;
  useEffect(() => {
    initData();
  }, [businessObjectAssociateId]);
  const initData = () => {};

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const setDefOption = (record, type) => {
    var _advanceDetailDs$curr;
    const boCode = advanceDetailDs === null || advanceDetailDs === void 0 ? void 0 : (_advanceDetailDs$curr = advanceDetailDs.current) === null || _advanceDetailDs$curr === void 0 ? void 0 : _advanceDetailDs$curr.get(FN.ASSOCIATE_BUSINESS_OBJECT_CODE);
    const fieldCode = record === null || record === void 0 ? void 0 : record.get('associateBusinessObjectFieldCode');
    if (boCode && fieldCode) {
      queryDefaultOptionNew({
        businessObjectCode: boCode,
        businessObjectFieldCode: fieldCode,
        multipleFieldFlag: tableDs.length > 1
      }).then(res => {
        var _res$;
        if ((record === null || record === void 0 ? void 0 : record.get('optionType')) === 'BUSINESS_OBJECT_OPTION', !type) {
          record.set({
            childReferenceList: (res === null || res === void 0 ? void 0 : res[0]) || {}
          });
        }
        record.set({
          refBusinessObjectCode: res === null || res === void 0 ? void 0 : (_res$ = res[0]) === null || _res$ === void 0 ? void 0 : _res$.businessObjectCode
        });
      }).catch(e => console.error(e));
    } else {
      record === null || record === void 0 ? void 0 : record.set('childReferenceList', null);
      record === null || record === void 0 ? void 0 : record.set('optionDisplayFieldCode', null);
    }
  };

  // tabledS更新
  const handleUpdate = ({
    name,
    value,
    record
  }) => {
    var _baseInfoDS$current2;
    if (name === 'relationField') {
      const isChooseTypeFlag = [FieldComponentType.SWITCH, FieldComponentType.SINGLE_SELECT, FieldComponentType.MULTIPLE_SELECT, FieldComponentType.CHECKBOX, FieldComponentType.RADIO].includes(value === null || value === void 0 ? void 0 : value.componentType) && tableDs.length > 1;
      if (value && isChooseTypeFlag) {
        record === null || record === void 0 ? void 0 : record.set('childReferenceList', null);
        record === null || record === void 0 ? void 0 : record.set('optionDisplayFieldCode', null);
      }
    }
    if (name === 'associateBusinessObjectFieldCode') {
      setDefOption(record);
    }
    if (name === 'optionType') {
      record === null || record === void 0 ? void 0 : record.set('childReferenceList', null);
      record === null || record === void 0 ? void 0 : record.set('optionDisplayFieldCode', null);
    }
    if (name === 'childReferenceList' && !value) {
      record === null || record === void 0 ? void 0 : record.set('optionDisplayFieldCode', null);
    }

    // 选择值列表 带出默认显示字段
    if (name === 'childReferenceList' && value !== null && value !== void 0 && value.displayFieldCode && (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current2 = baseInfoDS.current) === null || _baseInfoDS$current2 === void 0 ? void 0 : _baseInfoDS$current2.get('physicalModelType')) !== 'API') {
      record === null || record === void 0 ? void 0 : record.set('optionDisplayFieldCode', value === null || value === void 0 ? void 0 : value.displayFieldCode);
    }
  };
  useDataSetEvents(tableDs, ['update'], [handleUpdate]);

  /**
   * 获取关系字段的警告提示
   * @param record
   * @returns
   */
  const getAssociatedFieldWarning = record => {
    const obj1 = record === null || record === void 0 ? void 0 : record.get('relationField');
    const obj2 = conditionFilterFIelds.find(v => v.businessObjectFieldCode === (record === null || record === void 0 ? void 0 : record.get('associateBusinessObjectFieldCode')));
    if (!obj1 || !obj2) {
      return;
    }
    let title = '';
    if ((obj1 === null || obj1 === void 0 ? void 0 : obj1.maxLength) < (obj2 === null || obj2 === void 0 ? void 0 : obj2.maxLength)) {
      title = intl.get('hmde.bo.businessObject.errorTips1').d('关联字段长度小于被关联字段长度，数据保存可能会出现错误');
    } else if (obj1 !== null && obj1 !== void 0 && obj1.requiredFlag && !(obj2 !== null && obj2 !== void 0 && obj2.requiredFlag)) {
      title = intl.get('hmde.bo.businessObject.errorTips2').d('被关联字段非必输，关联字段必输，数据保存可能会出现错误');
    } else if (textType.includes(obj1 === null || obj1 === void 0 ? void 0 : obj1.componentType) && numberType.includes(obj2 === null || obj2 === void 0 ? void 0 : obj2.componentType) || numberType.includes(obj1 === null || obj1 === void 0 ? void 0 : obj1.componentType) && textType.includes(obj2 === null || obj2 === void 0 ? void 0 : obj2.componentType)) {
      title = intl.get('hmde.bo.businessObject.errorTips3').d('关联字段与被关联字段的物理模型类型不一致，数据保存可能会出现错误');
    }
    if (title) {
      return /*#__PURE__*/React.createElement(_Tooltip, {
        title: title,
        placement: "left"
      }, /*#__PURE__*/React.createElement(_Icon, {
        type: "priority_high",
        style: {
          color: 'red',
          cursor: 'pointer'
        }
      }));
    }
  };

  // 禁用状态
  const disabledFlag = isTenantRole && (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current3 = baseInfoDS.current) === null || _baseInfoDS$current3 === void 0 ? void 0 : _baseInfoDS$current3.get('sourceType')) === SourceType.PLATFORM || isPredEfineFlag || readOnlyFlag || !hasPermission;
  const handleDel = record => {
    tableDs.delete(record, false).then(() => {
      typeChange('del');
    });
  };
  const handleAdd = () => {
    tableDs === null || tableDs === void 0 ? void 0 : tableDs.create({
      optionType: 'BUSINESS_OBJECT_OPTION'
    });
    typeChange('add');
  };
  const typeChange = changeType => {
    if ((changeType === 'add' ? [2] : [1]).includes(tableDs.length)) {
      tableDs.forEach(v => {
        var _conditionFilterFIeld, _conditionFilterFIeld2;
        const curComponentType = conditionFilterFIelds === null || conditionFilterFIelds === void 0 ? void 0 : (_conditionFilterFIeld = conditionFilterFIelds.find) === null || _conditionFilterFIeld === void 0 ? void 0 : (_conditionFilterFIeld2 = _conditionFilterFIeld.call(conditionFilterFIelds, item => (item === null || item === void 0 ? void 0 : item.businessObjectFieldCode) === (v === null || v === void 0 ? void 0 : v.get('associateBusinessObjectFieldCode')))) === null || _conditionFilterFIeld2 === void 0 ? void 0 : _conditionFilterFIeld2.componentType;
        if (['LINK_RELATION', 'MASTER_RELATION'].includes(curComponentType)) {
          v === null || v === void 0 ? void 0 : v.set('childReferenceList', null);
          v === null || v === void 0 ? void 0 : v.set('optionDisplayFieldCode', null);
          setDefOption(tableDs === null || tableDs === void 0 ? void 0 : tableDs.get(0), 1);
        }
      });
    }
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: styles.titleTop
  }, /*#__PURE__*/React.createElement("span", null, intl.get('hmde.bo.businessObject.glConfig').d('关联配置')), /*#__PURE__*/React.createElement(BOPermissionButton, {
    onClick: handleAdd,
    icon: "add",
    funcType: "flat",
    color: "primary",
    disabled: paramObjDisabledFlag
  }, intl.get('hmde.bo.businessObject.addGlConfig').d('添加关联配置'))), !!tableDs.length && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: styles.flexBox
  }, /*#__PURE__*/React.createElement("span", null, intl.get('hmde.bo.businessObject.glField').d('关联字段'), /*#__PURE__*/React.createElement(_Tooltip, {
    placement: "top",
    title: intl.get('hmde.bo.businessObject.glTip1').d('可选择文本、下拉单选、下拉多选、单选、复选、电子邮箱、手机号码、自动编号、整数、开关、日期类型字段')
  }, /*#__PURE__*/React.createElement(_Icon, {
    type: "help_outline"
  }))), /*#__PURE__*/React.createElement("span", null, intl.get('hmde.bo.businessObject.bGlField').d('被关联字段'), /*#__PURE__*/React.createElement(_Tooltip, {
    placement: "top",
    title: intl.get('hmde.bo.businessObject.glTip2').d('当关联字段为选项类或开关字段时，无需引用值列表，字段存储本身的独立值集值或自定义选项值；当关联字段字段非选项类或开关字段，且被关联字段非关联、从主字段或无条件单字段高级关系字段时，可引用关联对象的值列表；当关联字段字段非选项类或开关字段，且被关联字段为关联、从主字段或无条件单字段高级关系字段时，可引用被关联字段的关联对象的值列表')
  }, /*#__PURE__*/React.createElement(_Icon, {
    type: "help_outline"
  }))), /*#__PURE__*/React.createElement("span", null, intl.get('hmde.bo.businessObject.optionType').d('视图来源')), /*#__PURE__*/React.createElement("span", null, intl.get('hmde.bo.businessObject.referenceList').d('引用值列表')), /*#__PURE__*/React.createElement("span", null, intl.get('hmde.bo.businessObject.displayField').d('显示字段'), /*#__PURE__*/React.createElement(_Tooltip, {
    placement: "top",
    title: intl.get('hmde.bo.businessObject.glTip3').d('不配置显示字段，查询时字段按引用的值列表的显示字段进行回显；配置显示字段，查询时字段按配置的显示字段进行回显')
  }, /*#__PURE__*/React.createElement(_Icon, {
    type: "help_outline"
  })))), /*#__PURE__*/React.createElement("div", {
    className: styles.formBox
  }, tableDs === null || tableDs === void 0 ? void 0 : tableDs.map(myRecord => {
    var _conditionFilterFIeld3, _conditionFilterFIeld4, _conditionFilterFIeld5, _myRecord$get, _myRecord$get2, _myRecord$get3;
    return /*#__PURE__*/React.createElement(_Form, {
      record: myRecord,
      key: myRecord.index,
      className: styles.flexBox,
      layout: "none"
    }, /*#__PURE__*/React.createElement("span", null, disabledFlag ? /*#__PURE__*/React.createElement(_Output, {
      name: "relationField",
      style: {
        width: '100%'
      }
    }) : /*#__PURE__*/React.createElement(_Select, {
      name: "relationField",
      searchable: true,
      noCache: true,
      style: {
        width: '100%'
      },
      optionsFilter: record => {
        const filterFlag = ![FieldComponentType.LINK_RELATION, FieldComponentType.MASTER_RELATION].includes(record === null || record === void 0 ? void 0 : record.get('componentType'));
        const sqlFlag = (record === null || record === void 0 ? void 0 : record.get('useType')) !== SQL_PARAM_CATEGORY.QUERY_PARAM;
        return filterFlag && sqlFlag;
      },
      searchMatcher: ({
        record,
        text,
        textField,
        valueField
      }) => {
        if (typeof text === 'string') {
          return record.get(textField).toLocaleLowerCase().indexOf(text === null || text === void 0 ? void 0 : text.toLocaleLowerCase()) !== -1 || record.get(valueField).toLocaleLowerCase().indexOf(text === null || text === void 0 ? void 0 : text.toLocaleLowerCase()) !== -1;
        }
        return false;
      },
      disabled: paramObjDisabledFlag
    })), /*#__PURE__*/React.createElement("span", null, disabledFlag ? /*#__PURE__*/React.createElement(_Output, {
      name: "associateBusinessObjectFieldCode",
      style: {
        width: '100%'
      }
    }) : /*#__PURE__*/React.createElement(_Select, {
      name: "associateBusinessObjectFieldCode",
      searchable: true,
      noCache: true,
      style: {
        width: '100%'
      },
      disabled: paramObjDisabledFlag
    }, conditionFilterFIelds === null || conditionFilterFIelds === void 0 ? void 0 : (_conditionFilterFIeld3 = conditionFilterFIelds.filter) === null || _conditionFilterFIeld3 === void 0 ? void 0 : (_conditionFilterFIeld4 = _conditionFilterFIeld3.call(conditionFilterFIelds, v => {
      const flag = !['FORMULA', 'REFERENCE_FIELD', 'MULTIPLE_RELATION'].includes(v === null || v === void 0 ? void 0 : v.componentType);
      const sqlFlag = (v === null || v === void 0 ? void 0 : v.useType) !== SQL_PARAM_CATEGORY.QUERY_PARAM;
      return flag && sqlFlag;
    })) === null || _conditionFilterFIeld4 === void 0 ? void 0 : (_conditionFilterFIeld5 = _conditionFilterFIeld4.map) === null || _conditionFilterFIeld5 === void 0 ? void 0 : _conditionFilterFIeld5.call(_conditionFilterFIeld4, v => /*#__PURE__*/React.createElement(_Select.Option, {
      value: v.businessObjectFieldCode,
      key: v.businessObjectFieldCode
    }, v.businessObjectFieldName)))), /*#__PURE__*/React.createElement("span", null, tableDs.length === 1 || ![FieldComponentType.SWITCH, FieldComponentType.SINGLE_SELECT, FieldComponentType.MULTIPLE_SELECT, FieldComponentType.CHECKBOX, FieldComponentType.RADIO].includes(myRecord === null || myRecord === void 0 ? void 0 : (_myRecord$get = myRecord.get('relationField')) === null || _myRecord$get === void 0 ? void 0 : _myRecord$get.componentType) ? /*#__PURE__*/React.createElement(_Select, {
      name: "optionType",
      disabled: paramObjDisabledFlag
    }) : null), /*#__PURE__*/React.createElement("span", null, tableDs.length === 1 || ![FieldComponentType.SWITCH, FieldComponentType.SINGLE_SELECT, FieldComponentType.MULTIPLE_SELECT, FieldComponentType.CHECKBOX, FieldComponentType.RADIO].includes(myRecord === null || myRecord === void 0 ? void 0 : (_myRecord$get2 = myRecord.get('relationField')) === null || _myRecord$get2 === void 0 ? void 0 : _myRecord$get2.componentType) ? /*#__PURE__*/React.createElement(LovToBoDetail, {
      name: "childReferenceList",
      noCache: true,
      key: "childReferenceList",
      record: myRecord,
      tips: intl.get('hmde.bo.businessObject.openOptionList').d('打开值列表'),
      originKey: "optionList",
      boCode: myRecord === null || myRecord === void 0 ? void 0 : myRecord.get('refBusinessObjectCode'),
      hiddenTips: true,
      style: {
        width: '100%'
      },
      disabled: paramObjDisabledFlag,
      hiddenJumpDetail: (myRecord === null || myRecord === void 0 ? void 0 : myRecord.get('optionType')) === 'LOV_VIEW'
    }) : null), /*#__PURE__*/React.createElement("span", null, tableDs.length === 1 || ![FieldComponentType.SWITCH, FieldComponentType.SINGLE_SELECT, FieldComponentType.MULTIPLE_SELECT, FieldComponentType.CHECKBOX, FieldComponentType.RADIO].includes(myRecord === null || myRecord === void 0 ? void 0 : (_myRecord$get3 = myRecord.get('relationField')) === null || _myRecord$get3 === void 0 ? void 0 : _myRecord$get3.componentType) ? /*#__PURE__*/React.createElement(_Select, {
      name: "optionDisplayFieldCode",
      style: {
        width: '100%'
      },
      optionsFilter: ({
        data
      }) => (data === null || data === void 0 ? void 0 : data.componentType) !== FieldComponentType.MULTIPLE_RELATION
    }) : null), /*#__PURE__*/React.createElement("div", {
      className: styles.flexBoxIcon
    }, getAssociatedFieldWarning(myRecord), (tableDs === null || tableDs === void 0 ? void 0 : tableDs.length) > 1 && /*#__PURE__*/React.createElement(_Icon, {
      type: "delete_black-o",
      style: {
        color: themeColor === null || themeColor === void 0 ? void 0 : themeColor.primary,
        cursor: 'pointer',
        fontSize: '16px'
      },
      onClick: () => handleDel(myRecord)
    })));
  }))));
};
export default formatterCollections({
  code: ['hmde.bo', 'hmde.common']
})(observer(Index));