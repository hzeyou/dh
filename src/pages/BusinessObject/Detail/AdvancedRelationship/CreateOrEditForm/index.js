import _Spin from "@hzero-front-ui/c7n-ui/lib/SpinPro";
import _Tooltip from "@hzero-front-ui/c7n-ui/lib/TooltipPro";
import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _SelectBox from "@hzero-front-ui/c7n-ui/lib/SelectBoxPro";
import _Output from "@hzero-front-ui/c7n-ui/lib/OutputPro";
import _IntlField from "@hzero-front-ui/c7n-ui/lib/IntlFieldPro";
import _Icon from "choerodon-ui/pro/lib/icon";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _EmailField from "@hzero-front-ui/c7n-ui/lib/EmailFieldPro";
import _NumberField from "@hzero-front-ui/c7n-ui/lib/NumberFieldPro";
import _DatePicker from "@hzero-front-ui/c7n-ui/lib/DatePickerPro";
import _Modal from "@hzero-front-ui/c7n-ui/lib/ModalPro";
import _useDataSet from "choerodon-ui/pro/lib/use-data-set";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _Select from "@hzero-front-ui/c7n-ui/lib/SelectPro";
import React, { useEffect, useState, useRef, useMemo } from 'react';
import intl from 'utils/intl';
import { LabelLayout, LabelAlign, FormLayout } from 'choerodon-ui/pro/lib/form/enum';
import { observer } from 'mobx-react-lite';
import { ButtonColor, FuncType } from 'choerodon-ui/pro/lib/button/enum';
import { ShowHelp } from 'choerodon-ui/pro/lib/field/enum';
import notification from 'utils/notification';
import { getResponse, getCurrentLanguage, isTenantRoleLevel } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import { FieldComponentType } from 'hzero-front-apaas/lib/constants/businessObject';
import { queryIdpValue } from 'services/api';
import useDataSetEvents from 'hzero-front-apaas/lib/hooks/useDataSetEvents';
import { SourceType } from "hzero-front-apaas/lib/constants/businessObject";
import LabelTitleRender from "hzero-front-hmde/lib/businessComponents/LabelTitleRender";
import { editAdvanceService, createAdvanceService, getBoField } from "hzero-front-hmde/lib/services/businessObjectService";
import LovToBoDetail from "hzero-front-hmde/lib/businessComponents/LovToBoDetail";
import { useBoStore } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/stores";
import BOPermissionButton from "hzero-front-hmde/lib/routes/BusinessObject/Detail/components/BOPermissionButton";
import FilterCondition from "hzero-front-hmde/lib/businessComponents/FilterCondition";
import AdvancedRelationship from "hzero-front-hmde/lib/components/imageComponents/AdvancedRelationship";
import { SQL_PARAM_CATEGORY } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/SqlMaintenance/datasets/sqlParamsDS";
import advancedDetailDS from "./advancedDetailDS";
import RelationFieldTable from "./components/RelationFieldTable";
import { AssociateType, ConditionType, FN } from "./type";
import advanceStyles from "../index.less?modules";
const Option = _Select.Option;
const isTenantRole = isTenantRoleLevel();
const Index = ({
  type,
  businessObjectId,
  businessObjectName,
  businessObjectCode,
  businessObjectAssociateId,
  advancedListDs,
  baseInfoDS,
  readOnlyFlag,
  showVersion,
  modal,
  okCallback
}) => {
  var _boStore$getState, _baseInfoDS$current, _advanceDetailDs$curr2, _advanceDetailDs$curr4, _baseInfoDS$current3, _advanceDetailDs$curr11, _advanceDetailDs$curr12, _advanceDetailDs$curr13, _baseInfoDS$current4, _advanceDetailDs$curr15, _advanceDetailDs$curr16, _advanceDetailDs$curr17, _advanceDetailDs$curr18, _baseInfoDS$current5, _baseInfoDS$current6, _advanceDetailDs$curr21;
  const boStore = useBoStore();
  const hasPermission = (_boStore$getState = boStore === null || boStore === void 0 ? void 0 : boStore.getState('hasPermission')) !== null && _boStore$getState !== void 0 ? _boStore$getState : true;
  // 预制领域下 高级关系 无法编辑处理
  const isPredEfineFlag = type === 'edit' && (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current = baseInfoDS.current) === null || _baseInfoDS$current === void 0 ? void 0 : _baseInfoDS$current.get('sourceType')) === SourceType.PREDEFINE;
  const _useState = useState([]),
    _useState2 = _slicedToArray(_useState, 2),
    selectList = _useState2[0],
    setSelectList = _useState2[1];
  const hadTipFlag = useRef(false); // 更改关联对象是否已经提示过

  const filterCacheRef = useRef(null);
  const _useState3 = useState([]),
    _useState4 = _slicedToArray(_useState3, 2),
    filterData = _useState4[0],
    setFilterData = _useState4[1];
  const _useState5 = useState([]),
    _useState6 = _slicedToArray(_useState5, 2),
    conditionFilterFIelds = _useState6[0],
    setConditionFilterFIelds = _useState6[1];
  const _useState7 = useState(false),
    _useState8 = _slicedToArray(_useState7, 2),
    relationshipFlag = _useState8[0],
    setRelationshipFlag = _useState8[1];
  const advanceDetailDs = _useDataSet(() => advancedDetailDS({
    type,
    advancedListDs,
    baseInfoDS
  }), [type]);
  // 选择被关联字段ds
  const tableDs = advanceDetailDs.children.businessObjectAssociateFieldList;
  useEffect(() => {
    initData();
  }, []);
  const disabledFlag = useMemo(() => {
    var _baseInfoDS$current2, _advanceDetailDs$curr;
    return (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current2 = baseInfoDS.current) === null || _baseInfoDS$current2 === void 0 ? void 0 : _baseInfoDS$current2.get('businessObjectCategory')) === 'DIMENSION' && (advanceDetailDs === null || advanceDetailDs === void 0 ? void 0 : (_advanceDetailDs$curr = advanceDetailDs.current) === null || _advanceDetailDs$curr === void 0 ? void 0 : _advanceDetailDs$curr.get('operationalFlag')) === false;
  }, [baseInfoDS, advanceDetailDs === null || advanceDetailDs === void 0 ? void 0 : (_advanceDetailDs$curr2 = advanceDetailDs.current) === null || _advanceDetailDs$curr2 === void 0 ? void 0 : _advanceDetailDs$curr2.get('operationalFlag')]);

  // 关联对象字段
  useEffect(() => {
    var _advanceDetailDs$curr3;
    const code = advanceDetailDs === null || advanceDetailDs === void 0 ? void 0 : (_advanceDetailDs$curr3 = advanceDetailDs.current) === null || _advanceDetailDs$curr3 === void 0 ? void 0 : _advanceDetailDs$curr3.get(FN.ASSOCIATE_BUSINESS_OBJECT_CODE);
    if (!code) return;
    getBoField({
      query: {
        businessObjectCodeList: code,
        primaryKeyFlag: true
      }
    }).then(res => {
      if (getResponse(res)) {
        setConditionFilterFIelds(res);
      }
    });
  }, [advanceDetailDs === null || advanceDetailDs === void 0 ? void 0 : (_advanceDetailDs$curr4 = advanceDetailDs.current) === null || _advanceDetailDs$curr4 === void 0 ? void 0 : _advanceDetailDs$curr4.get(FN.ASSOCIATE_BUSINESS_OBJECT_ID)]);

  // 初始化
  const initData = async () => {
    advanceDetailDs.setState('showVersion', showVersion);
    // 编辑
    if (businessObjectAssociateId) {
      advanceDetailDs.setState('businessObjectAssociateId', businessObjectAssociateId);
      const res = await advanceDetailDs.query();
      if (getResponse(res)) {
        var _res$businessObjectAs, _associateFields, _res$businessObjectAs2, _res$businessObjectAs3, _res$businessObjectAs4;
        setRelationshipFlag((res === null || res === void 0 ? void 0 : res.associateType) === AssociateType.SLAVE_MASTER);

        // 关系字段
        let associateFields = res === null || res === void 0 ? void 0 : (_res$businessObjectAs = res.businessObjectAssociateFieldList) === null || _res$businessObjectAs === void 0 ? void 0 : _res$businessObjectAs.filter(item => (item === null || item === void 0 ? void 0 : item.associateFieldType) === ConditionType.FIELD);
        associateFields = (_associateFields = associateFields) === null || _associateFields === void 0 ? void 0 : _associateFields.map(item => {
          Object.assign(item, {
            // 关联字段
            relationField: {
              maxLength: item === null || item === void 0 ? void 0 : item.masterMaxLength,
              requiredFlag: item === null || item === void 0 ? void 0 : item.masterRequiredFlag,
              componentType: item === null || item === void 0 ? void 0 : item.masterComponentType,
              businessObjectFieldName: item === null || item === void 0 ? void 0 : item.masterBusinessObjectFieldName,
              businessObjectFieldCode: item === null || item === void 0 ? void 0 : item.masterBusinessObjectFieldCode
            }
          });
          return item;
        });

        // 关联对象条件处理
        res === null || res === void 0 ? void 0 : (_res$businessObjectAs2 = res.businessObjectAssociateCondList) === null || _res$businessObjectAs2 === void 0 ? void 0 : (_res$businessObjectAs3 = _res$businessObjectAs2.forEach) === null || _res$businessObjectAs3 === void 0 ? void 0 : _res$businessObjectAs3.call(_res$businessObjectAs2, item => {
          // eslint-disable-next-line no-param-reassign
          item.fieldPath = item.businessObjectFieldCode;
        });

        // 找到前置条件
        const prevConditions = res === null || res === void 0 ? void 0 : (_res$businessObjectAs4 = res.businessObjectAssociateFieldList) === null || _res$businessObjectAs4 === void 0 ? void 0 : _res$businessObjectAs4.find(item => (item === null || item === void 0 ? void 0 : item.associateFieldType) === ConditionType.CONSTANT);
        if (prevConditions !== null && prevConditions !== void 0 && prevConditions.masterBusinessObjectFieldCode) {
          await setSelectListByValue(prevConditions);
          Object.assign(res, {
            isShowPrevConditionFields: true,
            prevConditionFields: {
              businessObjectFieldCode: prevConditions === null || prevConditions === void 0 ? void 0 : prevConditions.masterBusinessObjectFieldCode,
              businessObjectFieldName: prevConditions === null || prevConditions === void 0 ? void 0 : prevConditions.masterBusinessObjectFieldName,
              componentType: prevConditions === null || prevConditions === void 0 ? void 0 : prevConditions.masterComponentType
            },
            associateValue: prevConditions === null || prevConditions === void 0 ? void 0 : prevConditions.associateValue
          });
        }
        // businessObjectAssociateFieldList属性覆盖 referenceList回显
        Object.assign(res, {
          referenceList: res !== null && res !== void 0 && res.businessObjectOptionCode ? {
            businessObjectOptionCode: res === null || res === void 0 ? void 0 : res.businessObjectOptionCode,
            businessObjectOptionName: res === null || res === void 0 ? void 0 : res.businessObjectOptionName
          } : null,
          businessObjectAssociateFieldList: associateFields
        });
        advanceDetailDs.loadData([res]);
        setFilterData((res === null || res === void 0 ? void 0 : res.businessObjectAssociateCondList) || []);
      }
    } else {
      var _advanceDetailDs$curr5, _advanceDetailDs$curr6, _advanceDetailDs$curr7;
      // 创建
      (_advanceDetailDs$curr5 = advanceDetailDs.current) === null || _advanceDetailDs$curr5 === void 0 ? void 0 : _advanceDetailDs$curr5.set(FN.MASTER_BUSINESS_OBJECT_ID, businessObjectId);
      (_advanceDetailDs$curr6 = advanceDetailDs.current) === null || _advanceDetailDs$curr6 === void 0 ? void 0 : _advanceDetailDs$curr6.set(FN.MASTER_BUSINESS_OBJECT_NAME, businessObjectName);
      (_advanceDetailDs$curr7 = advanceDetailDs.current) === null || _advanceDetailDs$curr7 === void 0 ? void 0 : _advanceDetailDs$curr7.set(FN.MASTER_BUSINESS_OBJECT_CODE, businessObjectCode);
      tableDs === null || tableDs === void 0 ? void 0 : tableDs.create({});
    }
  };

  /**
   * 更新关联业务对象时的校验信息
   */
  const updateAssociateBoCheck = async () => {
    let cancelFlag = false;
    if (!hadTipFlag.current && type === 'edit') {
      await _Modal.confirm({
        title: intl.get('hmde.bo.businessObject.AssociateBoCheck').d('更改关联对象后可能会对已有记录造成影响，请确认是否修改？'),
        okText: intl.get('hmde.common.button.sure').d('确定'),
        onOk: () => {
          hadTipFlag.current = true;
        },
        onCancel: () => {
          cancelFlag = true;
          hadTipFlag.current = false;
          return true;
        }
      });
      if (cancelFlag) {
        return false;
      }
      return true;
    }
  };

  // ds update事件
  const dsUpdate = ({
    name,
    value,
    record
  }) => {
    if (name === FN.PREV_CONDITION_FIELDS) {
      record === null || record === void 0 ? void 0 : record.set(FN.ASSOCIATE_VALUE, null);
      setSelectListByValue(value);
    }

    // 关联对象处理
    if (name === 'associateBusinessObject' && value) {
      var _advanceDetailDs$curr8;
      tableDs.loadData([{
        associateFieldType: ConditionType.FIELD,
        optionType: 'BUSINESS_OBJECT_OPTION'
      }]);
      setFilterData([]);
      advanceDetailDs === null || advanceDetailDs === void 0 ? void 0 : (_advanceDetailDs$curr8 = advanceDetailDs.current) === null || _advanceDetailDs$curr8 === void 0 ? void 0 : _advanceDetailDs$curr8.set('logicFormula', '');
    }
  };
  useDataSetEvents(advanceDetailDs, 'update', dsUpdate);

  /**
   * 根据所选字段值集信息 获取下拉选项数据
   * @param value
   */
  const setSelectListByValue = async value => {
    if (['SWITCH', 'SINGLE_SELECT', 'RADIO', 'MULTIPLE_SELECT', 'CHECKBOX'].includes(value === null || value === void 0 ? void 0 : value.masterComponentType) || ['SWITCH', 'SINGLE_SELECT', 'RADIO', 'MULTIPLE_SELECT', 'CHECKBOX'].includes(value === null || value === void 0 ? void 0 : value.componentType)) {
      if (value !== null && value !== void 0 && value.lovCode) {
        await queryIdpValue(value === null || value === void 0 ? void 0 : value.lovCode).then(res => {
          setSelectList(res);
        });
      } else {
        var _value$attributeJson, _value$attributeJson$, _value$attributeJson$2;
        const data = value === null || value === void 0 ? void 0 : (_value$attributeJson = value.attributeJson) === null || _value$attributeJson === void 0 ? void 0 : (_value$attributeJson$ = _value$attributeJson.customOptionList) === null || _value$attributeJson$ === void 0 ? void 0 : (_value$attributeJson$2 = _value$attributeJson$.map) === null || _value$attributeJson$2 === void 0 ? void 0 : _value$attributeJson$2.call(_value$attributeJson$, field => {
          var _field$meaning;
          return {
            ...field,
            meaning: (_field$meaning = field.meaning) === null || _field$meaning === void 0 ? void 0 : _field$meaning[getCurrentLanguage()]
          };
        });
        setSelectList(data || []);
      }
    }
  };

  // 获取前置条件值组件类型
  const getAssociateFieldCom = record => {
    var _record$get, _record$get$toString, _record$get$toString$;
    const _ref = (record === null || record === void 0 ? void 0 : record.get(FN.PREV_CONDITION_FIELDS)) || {},
      componentType = _ref.componentType,
      digitalAccuracy = _ref.digitalAccuracy;
    // digitalAccuracy新建时选择的数据的小数位数 associateValue回显时根据小数据位数计算
    const precision = digitalAccuracy || ((_record$get = record.get(FN.ASSOCIATE_VALUE)) === null || _record$get === void 0 ? void 0 : (_record$get$toString = _record$get.toString()) === null || _record$get$toString === void 0 ? void 0 : (_record$get$toString$ = _record$get$toString.split('.')[1]) === null || _record$get$toString$ === void 0 ? void 0 : _record$get$toString$.length) || 0;
    switch (componentType) {
      case FieldComponentType.DATE_SELECTION_BOX:
        return /*#__PURE__*/React.createElement(_DatePicker, {
          name: FN.ASSOCIATE_VALUE,
          placeholder: intl.get(`hmde.common.choosedate`).d('选择日期'),
          className: advanceStyles.advance_select_item
        });
      case FieldComponentType.NUMBER_FIELD:
      case FieldComponentType.FLOAT:
      case FieldComponentType.PERCENTAGE:
      case FieldComponentType.MONEY:
        return /*#__PURE__*/React.createElement(_NumberField, {
          name: FN.ASSOCIATE_VALUE,
          precision: precision,
          className: advanceStyles.advance_select_item
        });
      case FieldComponentType.SWITCH:
      case FieldComponentType.SINGLE_SELECT:
      case FieldComponentType.RADIO:
      case FieldComponentType.MULTIPLE_SELECT:
      case FieldComponentType.CHECKBOX:
        return /*#__PURE__*/React.createElement(_Select, {
          multiple: [FieldComponentType.MULTIPLE_SELECT, FieldComponentType.CHECKBOX].includes(componentType),
          name: FN.ASSOCIATE_VALUE,
          className: advanceStyles.advance_select_item
        }, selectList.map(item => /*#__PURE__*/React.createElement(Option, {
          key: item === null || item === void 0 ? void 0 : item.value,
          value: item === null || item === void 0 ? void 0 : item.value
        }, item === null || item === void 0 ? void 0 : item.meaning)));
      case FieldComponentType.EMAIL:
        return /*#__PURE__*/React.createElement(_EmailField, {
          name: FN.ASSOCIATE_VALUE,
          className: advanceStyles.advance_select_item
        });
      default:
        return /*#__PURE__*/React.createElement(_TextField, {
          name: FN.ASSOCIATE_VALUE,
          className: advanceStyles.advance_select_item
        });
    }
  };

  // 前置条件值如果是多选复选 特殊处理一下
  const getAssociateValue = data => {
    if ([FieldComponentType.MULTIPLE_SELECT, FieldComponentType.CHECKBOX].includes(data === null || data === void 0 ? void 0 : data.componentType)) {
      return JSON.stringify(data === null || data === void 0 ? void 0 : data.associateValue);
    }
    return data === null || data === void 0 ? void 0 : data.associateValue;
  };

  /**
   * 更新高级关系
   */
  modal === null || modal === void 0 ? void 0 : modal.handleOk(async () => {
    var _advanceDetailDs$curr9, _filterCacheRef$curre, _filterCacheRef$curre2;
    if (!hasPermission) return true;
    if ((await ((_advanceDetailDs$curr9 = advanceDetailDs.current) === null || _advanceDetailDs$curr9 === void 0 ? void 0 : _advanceDetailDs$curr9.validate())) && (await (filterCacheRef === null || filterCacheRef === void 0 ? void 0 : (_filterCacheRef$curre = filterCacheRef.current) === null || _filterCacheRef$curre === void 0 ? void 0 : (_filterCacheRef$curre2 = _filterCacheRef$curre.checkValidate) === null || _filterCacheRef$curre2 === void 0 ? void 0 : _filterCacheRef$curre2.call(_filterCacheRef$curre)))) {
      var _filterCacheRef$curre3, _filterCacheRef$curre4, _advanceDetailDs$curr10, _data$businessObjectA, _data$businessObjectA2;
      // 添加关联对象条件
      filterCacheRef === null || filterCacheRef === void 0 ? void 0 : (_filterCacheRef$curre3 = filterCacheRef.current) === null || _filterCacheRef$curre3 === void 0 ? void 0 : (_filterCacheRef$curre4 = _filterCacheRef$curre3.handleSetData) === null || _filterCacheRef$curre4 === void 0 ? void 0 : _filterCacheRef$curre4.call(_filterCacheRef$curre3);
      const service = type === 'edit' ? editAdvanceService : createAdvanceService;
      const data = (_advanceDetailDs$curr10 = advanceDetailDs.current) === null || _advanceDetailDs$curr10 === void 0 ? void 0 : _advanceDetailDs$curr10.toData();
      const businessObjectAssociateFieldList = data.businessObjectAssociateFieldList || [];
      if (data !== null && data !== void 0 && data.masterBusinessObjectFieldCode) {
        // 添加前置条件
        businessObjectAssociateFieldList.push({
          masterBusinessObjectFieldCode: data === null || data === void 0 ? void 0 : data.masterBusinessObjectFieldCode,
          masterBusinessObjectFieldName: data === null || data === void 0 ? void 0 : data.masterBusinessObjectFieldName,
          associateFieldType: ConditionType.CONSTANT,
          associateValue: getAssociateValue(data),
          associateValueMeaning: data === null || data === void 0 ? void 0 : data.associateValueMeaning
        });
      }
      data.businessObjectAssociateFieldList = businessObjectAssociateFieldList;

      // 关联对象条件数据处理
      data === null || data === void 0 ? void 0 : (_data$businessObjectA = data.businessObjectAssociateCondList) === null || _data$businessObjectA === void 0 ? void 0 : (_data$businessObjectA2 = _data$businessObjectA.forEach) === null || _data$businessObjectA2 === void 0 ? void 0 : _data$businessObjectA2.call(_data$businessObjectA, v => {
        // eslint-disable-next-line no-param-reassign
        v.businessObjectFieldCode = v.fieldPath;
      });
      if (type !== 'edit') {
        data.associateCode = `${businessObjectCode}_${isTenantRole ? 'C' : 'S'}_${data.associateCode}`;
      }

      // 删除一些数据 以兼容 后端的兜底逻辑
      delete data.businessObjectOptionCode;
      delete data.businessObjectOptionName;
      delete data.optionDisplayFieldCode;
      delete data.optionDisplayFieldName;
      delete data.optionType;
      return service(data).then(res => {
        if (getResponse(res)) {
          notification.success({
            message: intl.get('hmde.common.handleSuccess').d('操作成功')
          });
          advancedListDs.query();
          baseInfoDS === null || baseInfoDS === void 0 ? void 0 : baseInfoDS.query();
          okCallback === null || okCallback === void 0 ? void 0 : okCallback();
        } else {
          return false;
        }
      });
    }
    return false;
  });
  const relationFieldProps = {
    type,
    readOnlyFlag,
    businessObjectAssociateId,
    baseInfoDS,
    tableDs,
    advanceDetailDs,
    conditionFilterFIelds,
    paramObjDisabledFlag: disabledFlag
  };
  return /*#__PURE__*/React.createElement(_Spin, {
    dataSet: advanceDetailDs
  }, /*#__PURE__*/React.createElement(_Form, {
    dataSet: advanceDetailDs,
    columns: 2
    // useColon={false}
    ,
    labelAlign: "left",
    labelWidth: "auto",
    disabled: type === 'edit' && (isTenantRole && (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current3 = baseInfoDS.current) === null || _baseInfoDS$current3 === void 0 ? void 0 : _baseInfoDS$current3.get('sourceType')) === SourceType.PLATFORM || isPredEfineFlag || readOnlyFlag) || !hasPermission || disabledFlag
  }, /*#__PURE__*/React.createElement(_IntlField, {
    name: FN.ASSOCIATE_NAME,
    suffix: /*#__PURE__*/React.createElement(_Icon, {
      type: "language"
    })
  }), type === 'create' ? /*#__PURE__*/React.createElement(_TextField, {
    name: FN.ASSOCIATE_CODE,
    maxLength: Number(90 - businessObjectCode.length - 3),
    showLengthInfo: true,
    clearButton: true,
    addonBefore: `${businessObjectCode}_${isTenantRole ? 'C' : 'S'}_`
  }) : /*#__PURE__*/React.createElement(_Output, {
    name: FN.ASSOCIATE_CODE
  }), /*#__PURE__*/React.createElement(_Output, {
    name: FN.MASTER_BUSINESS_OBJECT_NAME
  }), /*#__PURE__*/React.createElement(LovToBoDetail, {
    record: advanceDetailDs.current,
    name: FN.MASTER_BUSINESS_OBJECT,
    onBeforeSelect: updateAssociateBoCheck,
    noCache: true,
    style: {
      width: '100%'
    },
    showHelp: "none",
    tooltip: 'none',
    tableProps: {
      queryFieldsLimit: 4
    },
    usedInfo: advanceDetailDs === null || advanceDetailDs === void 0 ? void 0 : (_advanceDetailDs$curr11 = advanceDetailDs.current) === null || _advanceDetailDs$curr11 === void 0 ? void 0 : _advanceDetailDs$curr11.get('usedInfo')
  }), /*#__PURE__*/React.createElement(_SelectBox, {
    name: FN.ASSOCIATE_TYPE
    // 关联可以改重组,  重组不能改关联
    ,
    disabled: type === 'edit' && relationshipFlag,
    label: intl.get('hmde.bo.businessObject.relationship').d('关系')
  }, /*#__PURE__*/React.createElement(Option, {
    value: AssociateType.LINK
  }, intl.get('hmde.common.link').d('关联')), /*#__PURE__*/React.createElement(Option, {
    value: AssociateType.SLAVE_MASTER
  }, intl.get('hmde.common.slaveMaster').d('从主'))), ((_advanceDetailDs$curr12 = advanceDetailDs.current) === null || _advanceDetailDs$curr12 === void 0 ? void 0 : _advanceDetailDs$curr12.get(FN.ASSOCIATE_TYPE)) === AssociateType.SLAVE_MASTER && /*#__PURE__*/React.createElement(_Select, {
    name: FN.LINK_RELATION_TYPE
  })), !!(advanceDetailDs !== null && advanceDetailDs !== void 0 && (_advanceDetailDs$curr13 = advanceDetailDs.current) !== null && _advanceDetailDs$curr13 !== void 0 && _advanceDetailDs$curr13.get(FN.ASSOCIATE_BUSINESS_OBJECT_CODE)) && /*#__PURE__*/React.createElement("div", {
    className: advanceStyles.advancedDetailBottomBox
  }, /*#__PURE__*/React.createElement(RelationFieldTable, relationFieldProps), /*#__PURE__*/React.createElement("div", {
    className: advanceStyles.advance_pre_conditions
  }, /*#__PURE__*/React.createElement(LabelTitleRender, {
    value: intl.get('hmde.bo.businessObject.curConditions').d('当前对象条件'),
    help: /*#__PURE__*/React.createElement(AdvancedRelationship, null),
    isPopupMaxWidthNone: true
  }), /*#__PURE__*/React.createElement(BOPermissionButton, {
    onClick: () => {
      var _advanceDetailDs$curr14;
      return (_advanceDetailDs$curr14 = advanceDetailDs.current) === null || _advanceDetailDs$curr14 === void 0 ? void 0 : _advanceDetailDs$curr14.set(FN.IS_SHOW_PREV_CONDITION_FIELDS, true);
    },
    icon: "add",
    funcType: "flat",
    color: "primary",
    disabled: isTenantRole && (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current4 = baseInfoDS.current) === null || _baseInfoDS$current4 === void 0 ? void 0 : _baseInfoDS$current4.get('sourceType')) === SourceType.PLATFORM || isPredEfineFlag || readOnlyFlag || ((_advanceDetailDs$curr15 = advanceDetailDs.current) === null || _advanceDetailDs$curr15 === void 0 ? void 0 : _advanceDetailDs$curr15.get(FN.IS_SHOW_PREV_CONDITION_FIELDS)) || disabledFlag
  }, intl.get('hmde.common.addCondition').d('添加条件'))), (type === 'edit' && (((_advanceDetailDs$curr16 = advanceDetailDs.current) === null || _advanceDetailDs$curr16 === void 0 ? void 0 : _advanceDetailDs$curr16.get(FN.PREV_CONDITION_FIELDS)) || ((_advanceDetailDs$curr17 = advanceDetailDs.current) === null || _advanceDetailDs$curr17 === void 0 ? void 0 : _advanceDetailDs$curr17.get(FN.IS_SHOW_PREV_CONDITION_FIELDS))) || type === 'create' && ((_advanceDetailDs$curr18 = advanceDetailDs.current) === null || _advanceDetailDs$curr18 === void 0 ? void 0 : _advanceDetailDs$curr18.get(FN.IS_SHOW_PREV_CONDITION_FIELDS))) &&
  /*#__PURE__*/
  // eslint-disable-next-line react/jsx-indent
  React.createElement(_Form, {
    disabled: type === 'edit' && (isTenantRole && (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current5 = baseInfoDS.current) === null || _baseInfoDS$current5 === void 0 ? void 0 : _baseInfoDS$current5.get('sourceType')) === SourceType.PLATFORM || isPredEfineFlag || readOnlyFlag) || !hasPermission || disabledFlag,
    dataSet: advanceDetailDs
    // useColon={false}
    ,
    labelLayout: "placeholder",
    className: advanceStyles.advance_edit_form,
    labelAlign: "left",
    layout: "none"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: advanceStyles.advance_edit_form_lable
  }, intl.get('hmde.common.fieldName').d('字段名称')), /*#__PURE__*/React.createElement("span", {
    className: advanceStyles.advance_edit_form_lable
  }, intl.get('hmde.bo.businessObject.LogicalSymbol').d('逻辑符')), /*#__PURE__*/React.createElement("span", {
    className: advanceStyles.advance_edit_form_lable
  }, intl.get('hmde.bo.businessObject.price').d('值'))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '12px'
    }
  }, /*#__PURE__*/React.createElement(_Select, {
    className: advanceStyles.advance_select_item,
    name: FN.PREV_CONDITION_FIELDS,
    clearButton: false,
    searchable: true,
    noCache: true,
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
    optionsFilter: record => {
      const flag = !['tenantId', 'organizationId'].includes(record === null || record === void 0 ? void 0 : record.get('businessObjectFieldCode'));
      const sqlFlag = (record === null || record === void 0 ? void 0 : record.get('useType')) !== SQL_PARAM_CATEGORY.QUERY_PARAM;
      return flag && sqlFlag;
    }
  }), /*#__PURE__*/React.createElement(_TextField, {
    name: "associateFieldType",
    renderer: () => intl.get('hmde.common.equal').d('等于'),
    disabled: true,
    className: advanceStyles.advance_select_item
  }), getAssociateFieldCom(advanceDetailDs.current), !isPredEfineFlag && !(type === 'edit' && isTenantRole && (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current6 = baseInfoDS.current) === null || _baseInfoDS$current6 === void 0 ? void 0 : _baseInfoDS$current6.get('sourceType')) === SourceType.PLATFORM) && !readOnlyFlag && hasPermission &&
  /*#__PURE__*/
  // <Col span={6} style={{ textAlign: 'right', paddingRight: 24 }}
  React.createElement(BOPermissionButton, {
    componentType: "a",
    onClick: () => {
      var _advanceDetailDs$curr19, _advanceDetailDs$curr20;
      (_advanceDetailDs$curr19 = advanceDetailDs.current) === null || _advanceDetailDs$curr19 === void 0 ? void 0 : _advanceDetailDs$curr19.set('prevConditionFields', null);
      advanceDetailDs === null || advanceDetailDs === void 0 ? void 0 : (_advanceDetailDs$curr20 = advanceDetailDs.current) === null || _advanceDetailDs$curr20 === void 0 ? void 0 : _advanceDetailDs$curr20.set('isShowPrevConditionFields', false);
    },
    className: advanceStyles.advance_select_item_delete,
    disabled: disabledFlag
  }, /*#__PURE__*/React.createElement(_Icon, {
    type: "delete_black-o",
    style: {
      fontSize: 16
    }
  })))), /*#__PURE__*/React.createElement("div", {
    className: advanceStyles.titleTop
  }, /*#__PURE__*/React.createElement("span", null, intl.get('hmde.bo.businessObject.linkObjCondition').d('关联对象条件'), /*#__PURE__*/React.createElement(_Tooltip, {
    placement: "top",
    title: intl.get('hmde.bo.businessObject.linkObjCondition.tip').d('当前对象条件与关联对象条件均成立时，高级关系才生效')
  }, /*#__PURE__*/React.createElement(_Icon, {
    type: "help_outline",
    style: {
      color: 'rgba(0, 0, 0, 0.45)',
      marginLeft: '5px'
    }
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '-45px'
    }
  }, /*#__PURE__*/React.createElement(FilterCondition, {
    filterCacheRef: filterCacheRef,
    data: filterData,
    fieldData: conditionFilterFIelds,
    busObjectCode: advanceDetailDs === null || advanceDetailDs === void 0 ? void 0 : (_advanceDetailDs$curr21 = advanceDetailDs.current) === null || _advanceDetailDs$curr21 === void 0 ? void 0 : _advanceDetailDs$curr21.get(FN.ASSOCIATE_BUSINESS_OBJECT_CODE),
    logicFormulaName: FN.LOGIC_FORMULA,
    detailDsV: advanceDetailDs,
    lookupCode: "HMDE.BUSINESS_OBJECT_ASSOCIATE.COND_TYPE",
    name: "businessObjectAssociateCondList",
    expressionName: "",
    hiddenTipName: true,
    isHighAdvance: true,
    showTopLable: true,
    addDisabled: isPredEfineFlag,
    buttonName: intl.get('hmde.common.addCondition').d('添加条件')
  }), !!(advanceDetailDs !== null && advanceDetailDs !== void 0 && advanceDetailDs.getState('filterDsLength')) && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '8px'
    }
  }, /*#__PURE__*/React.createElement(_Form, {
    dataSet: advanceDetailDs,
    disabled: isPredEfineFlag
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'rgba(0, 0, 0, 0.45)'
    }
  }, intl.get('hmde.common.conditionalRelation').d('条件关系'), /*#__PURE__*/React.createElement(_Tooltip, {
    title: intl.get('hmde.common.conditionalRelation.help').d('使用 AND 和 OR 合并筛选器条件行，示例：(1 AND 2) OR 3'),
    placement: "top"
  }, /*#__PURE__*/React.createElement(_Icon, {
    type: "help_outline",
    style: {
      color: 'rgba(0, 0, 0, 0.45)',
      margin: '-3px 0 0 1px',
      fontWeight: 400
    }
  })), /*#__PURE__*/React.createElement(_TextField, {
    name: FN.LOGIC_FORMULA,
    style: {
      width: 'calc(100% - 93px)',
      marginLeft: '10px'
    }
  })))))));
};
export default formatterCollections({
  code: ['hmde.bo', 'hmde.common']
})(observer(Index));