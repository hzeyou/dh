import _Popconfirm from "@hzero-front-ui/c7n-ui/lib/Popconfirm";
import _Switch from "@hzero-front-ui/c7n-ui/lib/SwitchPro";
import _NumberField from "@hzero-front-ui/c7n-ui/lib/NumberFieldPro";
import _Alert from "@hzero-front-ui/c7n-ui/lib/Alert";
import _Dropdown from "@hzero-front-ui/c7n-ui/lib/DropdownPro";
import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _SelectBox from "@hzero-front-ui/c7n-ui/lib/SelectBoxPro";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _Tooltip from "@hzero-front-ui/c7n-ui/lib/TooltipPro";
import _Output from "@hzero-front-ui/c7n-ui/lib/OutputPro";
import _IntlField from "@hzero-front-ui/c7n-ui/lib/IntlFieldPro";
import _Icon from "choerodon-ui/pro/lib/icon";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _Modal from "@hzero-front-ui/c7n-ui/lib/ModalPro";
import _Select from "@hzero-front-ui/c7n-ui/lib/SelectPro";
import _upperFirst from "lodash/upperFirst";
import _camelCase from "lodash/camelCase";
import _pick from "lodash/pick";
// 下拉单选/多选组件
import React, { useMemo, useImperativeHandle, useState, useEffect, useRef } from 'react';
import { toJS } from 'mobx';
import { LabelLayout, LabelAlign } from 'choerodon-ui/pro/lib/form/enum';
import { FuncType } from 'choerodon-ui/pro/lib/button/enum';
import { Observer } from 'mobx-react-lite';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { getResponse, isTenantRoleLevel } from 'utils/utils';
import { queryIdpValue } from 'services/api';
// import { queryIdpValue } from '@hmde/services/commonService';
import { queryMultiIdpValue } from "hzero-front-hmde/lib/services/commonService";
import { IntlType } from 'choerodon-ui/pro/lib/intl-field/enum';
import useDataSetEvents from 'hzero-front-apaas/lib/hooks/useDataSetEvents';
import notification from 'utils/notification';
import { SourceType } from "hzero-front-apaas/lib/constants/businessObject";
import DimensionConfig from "hzero-front-hmde/lib/businessComponents/DimensionConfig";
import Lov from "hzero-front-hmde/lib/components/LowcodeLov";
import SectionTitle from "hzero-front-apaas/lib/components/SectionTitle";
import MultiIntlField from "hzero-front-hmde/lib/businessComponents/MultiIntlField";
import { renderPopConfirmTitle } from "hzero-front-apaas/lib/utils/render";
import LovDefineModal from "./LovDefineModal";
import LovValuesList from "./LovValuesList";
import SelectDS from "./SelectDS";
import styles from "./index.less?modules";
const Option = _Select.Option;
const createValueListKey = _Modal.key();
const isTenant = isTenantRoleLevel();
// const language = getCurrentLanguage();

function Index(props) {
  const selectedExampleInfo = props.selectedExampleInfo,
    isExtensionField = props.isExtensionField,
    isEditMode = props.isEditMode,
    isFromDomain = props.isFromDomain,
    businessObjectCode = props.businessObjectCode,
    businessObjectId = props.businessObjectId,
    customPrimaryKeyCode = props.customPrimaryKeyCode,
    disabled = props.disabled,
    boSourceType = props.boSourceType,
    componentType = props.componentType,
    domainEnabledFlag = props.domainEnabledFlag,
    extendFieldCreatedFlag = props.extendFieldCreatedFlag,
    extendFieldPrefixRule = props.extendFieldPrefixRule,
    _props$isApiCustomTyp = props.isApiCustomType,
    isApiCustomType = _props$isApiCustomTyp === void 0 ? false : _props$isApiCustomTyp,
    detailData = props.detailData,
    inheritFieldId = props.inheritFieldId,
    businessObjectFieldId = props.businessObjectFieldId,
    inheritId = props.inheritId,
    _props$dimensionFlag = props.dimensionFlag,
    dimensionFlag = _props$dimensionFlag === void 0 ? false : _props$dimensionFlag;
  const _useState = useState([]),
    _useState2 = _slicedToArray(_useState, 2),
    lovData = _useState2[0],
    setLovData = _useState2[1];
  const _useState3 = useState([]),
    _useState4 = _slicedToArray(_useState3, 2),
    defaultFileValueList = _useState4[0],
    setDefaultFileValueList = _useState4[1];
  const _useState5 = useState(false),
    _useState6 = _slicedToArray(_useState5, 2),
    defaultValueMultipleFlag = _useState6[0],
    setDefaultValueMultipleFlag = _useState6[1];
  const _useState7 = useState(true),
    _useState8 = _slicedToArray(_useState7, 2),
    visible = _useState8[0],
    setVisible = _useState8[1];
  const dRef = useRef();
  const selectDs = useMemo(() => new _DataSet(SelectDS({
    isExtensionField,
    type: selectedExampleInfo === null || selectedExampleInfo === void 0 ? void 0 : selectedExampleInfo.value,
    isEditMode,
    businessObjectId,
    isFromDomain,
    customPrimaryKeyCode,
    boSourceType,
    extendFieldCreatedFlag,
    isApiCustomType
  })), [isExtensionField, selectedExampleInfo === null || selectedExampleInfo === void 0 ? void 0 : selectedExampleInfo.value, isEditMode, businessObjectId, isFromDomain, customPrimaryKeyCode, isExtensionField, boSourceType]);
  const valueListDs = useMemo(() => selectDs.children.customOptionList, [isExtensionField, selectedExampleInfo === null || selectedExampleInfo === void 0 ? void 0 : selectedExampleInfo.value, isEditMode]);
  const lovValuesDs = useMemo(() => selectDs.children.lovValues, [isExtensionField, selectedExampleInfo === null || selectedExampleInfo === void 0 ? void 0 : selectedExampleInfo.value, isEditMode]);
  const _useState9 = useState(false),
    _useState10 = _slicedToArray(_useState9, 2),
    showlovValuesListFlag = _useState10[0],
    setF = _useState10[1];
  useDataSetEvents(lovValuesDs, 'load', () => {
    setF(true);
  });
  const closeVisible = () => {
    setVisible(true);
  };
  useEffect(() => {
    selectDs === null || selectDs === void 0 ? void 0 : selectDs.setState('extendFieldPrefixRule', extendFieldPrefixRule);
  }, [selectDs, extendFieldPrefixRule]);
  useEffect(() => {
    document.addEventListener('click', closeVisible);
    return () => {
      document.removeEventListener('click', closeVisible);
    };
  }, []);
  useEffect(() => {
    const multipleFlag = componentType === 'MULTIPLE_SELECT' || componentType === 'CHECKBOX';
    setDefaultValueMultipleFlag(multipleFlag);
  }, [componentType]);
  const handleInit = res => {
    const lovCode = res.lovCode,
      lovName = res.lovName,
      defaultValue = res.defaultValue;
    if (lovCode) {
      var _selectDs$current;
      // eslint-disable-next-line no-unused-expressions
      selectDs === null || selectDs === void 0 ? void 0 : (_selectDs$current = selectDs.current) === null || _selectDs$current === void 0 ? void 0 : _selectDs$current.init('valueList', {
        lovCode,
        lovName
      });
    } else {
      var _selectDs$current2;
      // eslint-disable-next-line no-unused-expressions
      selectDs === null || selectDs === void 0 ? void 0 : (_selectDs$current2 = selectDs.current) === null || _selectDs$current2 === void 0 ? void 0 : _selectDs$current2.init('valueList', undefined);
    }
    if (defaultValue) {
      var _selectDs$current3, _valueList;
      // eslint-disable-next-line no-unused-expressions
      let valueList = (selectDs === null || selectDs === void 0 ? void 0 : (_selectDs$current3 = selectDs.current) === null || _selectDs$current3 === void 0 ? void 0 : _selectDs$current3.toJSONData().defaultValue.split(',')) || [];

      // 多选/下拉多选 => 单选/下拉单选 如果默认是1个以上, 需要特殊处理
      if ((componentType === 'SINGLE_SELECT' || componentType === 'RADIO') && ((_valueList = valueList) === null || _valueList === void 0 ? void 0 : _valueList.length) > 1) {
        var _selectDs$current4, _valueList2;
        // eslint-disable-next-line no-unused-expressions
        selectDs === null || selectDs === void 0 ? void 0 : (_selectDs$current4 = selectDs.current) === null || _selectDs$current4 === void 0 ? void 0 : _selectDs$current4.set('defaultValue', valueList[0]);
        valueList = (_valueList2 = valueList) === null || _valueList2 === void 0 ? void 0 : _valueList2.splice(0, 1);
      }
      valueListDs.forEach(d => {
        valueList.forEach(v => {
          if (d.get('value') === v) {
            d.init('defaultFlag', true);
          }
        });
      });
    }

    // 初始化【默认值】字段
    initDefaultField(res);
  };

  // 维护需要暴露给父组件的api 一般是ds
  useImperativeHandle(props === null || props === void 0 ? void 0 : props.childrenComRef, () => ({
    selectDs,
    // 务必维护和组件名称一致后缀加Ds 方便父组件调用
    getFieldsValue,
    getAttributeJson,
    customInitChild: res => handleInit(res)
  }));
  useEffect(() => {
    detailData && initData();
  }, [selectDs, inheritFieldId, businessObjectFieldId, inheritId, detailData]);
  const initData = () => {
    setTimeout(() => {
      selectDs === null || selectDs === void 0 ? void 0 : selectDs.loadData([detailData]);
      handleInit === null || handleInit === void 0 ? void 0 : handleInit(detailData);
      selectDs === null || selectDs === void 0 ? void 0 : selectDs.setState('tlsParams', {
        businessObjectFieldId,
        inheritFieldId: inheritFieldId || inheritId
      });
    }, 0);
  };
  const getFieldsValue = async _detailData => {
    var _dRef$current, _dRef$current$ds, _dRef$current$ds$vali, _dRef$current2, _dRef$current2$ds, _selectDs$current5, _selectDs$current6;
    if (!(await (dRef === null || dRef === void 0 ? void 0 : (_dRef$current = dRef.current) === null || _dRef$current === void 0 ? void 0 : (_dRef$current$ds = _dRef$current.ds) === null || _dRef$current$ds === void 0 ? void 0 : (_dRef$current$ds$vali = _dRef$current$ds.validate) === null || _dRef$current$ds$vali === void 0 ? void 0 : _dRef$current$ds$vali.call(_dRef$current$ds))) && dimensionFlag) {
      return false;
    }
    if (!(dRef !== null && dRef !== void 0 && (_dRef$current2 = dRef.current) !== null && _dRef$current2 !== void 0 && (_dRef$current2$ds = _dRef$current2.ds) !== null && _dRef$current2$ds !== void 0 && _dRef$current2$ds.length) && dimensionFlag) {
      notification.warning({
        message: intl.get('hmde.bo.businessObject.saveErrorTips').d('至少需要存在一个维度，请维护。')
      });
      return false;
    }
    if (((_selectDs$current5 = selectDs.current) === null || _selectDs$current5 === void 0 ? void 0 : _selectDs$current5.get('optionSettings')) === '_valueList') {
      valueListDs.reset(); // 切换到值集保存时把自定义的list重置一下 防止新增的数据做空校验
    }
    if (await ((_selectDs$current6 = selectDs.current) === null || _selectDs$current6 === void 0 ? void 0 : _selectDs$current6.validate())) {
      var _dRef$current3, _dRef$current3$save, _selectDs$current7, _selectDs$fields, _selectDs$fields$keys, _selectDs$current8, _formValues$attribute, _formValues$attribute2, _formValues8;
      dimensionFlag && (dRef === null || dRef === void 0 ? void 0 : (_dRef$current3 = dRef.current) === null || _dRef$current3 === void 0 ? void 0 : (_dRef$current3$save = _dRef$current3.save) === null || _dRef$current3$save === void 0 ? void 0 : _dRef$current3$save.call(_dRef$current3));
      let formValues;
      formValues = (_selectDs$current7 = selectDs.current) === null || _selectDs$current7 === void 0 ? void 0 : _selectDs$current7.toData();
      const fieldKeys = [...((selectDs === null || selectDs === void 0 ? void 0 : (_selectDs$fields = selectDs.fields) === null || _selectDs$fields === void 0 ? void 0 : (_selectDs$fields$keys = _selectDs$fields.keys) === null || _selectDs$fields$keys === void 0 ? void 0 : _selectDs$fields$keys.call(_selectDs$fields)) || [])];
      formValues = {
        ..._pick(_detailData, fieldKeys),
        ...formValues
      };
      const _lovValues = formValues.lovValues.map(value => {
        var _formValues;
        return {
          ...value,
          metadata: {
            _tls: value === null || value === void 0 ? void 0 : value._tls
          },
          parentLovCode: (_formValues = formValues) === null || _formValues === void 0 ? void 0 : _formValues.parentLovCode
        };
      });
      formValues.lovValues = _lovValues;
      if (((_selectDs$current8 = selectDs.current) === null || _selectDs$current8 === void 0 ? void 0 : _selectDs$current8.get('optionSettings')) === '_custom') {
        var _formValues2, _formValues3, _formValues4, _formValues5;
        formValues.attributeJson.customOptionList = formValues.customOptionList.map(item => {
          var _item$_tls, _window$dvaApp, _window$dvaApp$_store, _window$dvaApp$_store2, _window$dvaApp$_store3, _window$dvaApp$_store4, _window$dvaApp$_store5, _window$dvaApp$_store6, _window$dvaApp$_store7, _window$dvaApp$_store8;
          return {
            value: item === null || item === void 0 ? void 0 : item.value,
            orderSeq: item === null || item === void 0 ? void 0 : item.orderSeq,
            parentValue: item === null || item === void 0 ? void 0 : item.parentValue,
            meaning: (item === null || item === void 0 ? void 0 : (_item$_tls = item._tls) === null || _item$_tls === void 0 ? void 0 : _item$_tls.meaning) || ((_window$dvaApp = window.dvaApp) === null || _window$dvaApp === void 0 ? void 0 : (_window$dvaApp$_store = _window$dvaApp._store) === null || _window$dvaApp$_store === void 0 ? void 0 : (_window$dvaApp$_store2 = _window$dvaApp$_store.getState) === null || _window$dvaApp$_store2 === void 0 ? void 0 : (_window$dvaApp$_store3 = _window$dvaApp$_store2.call(_window$dvaApp$_store)) === null || _window$dvaApp$_store3 === void 0 ? void 0 : (_window$dvaApp$_store4 = _window$dvaApp$_store3.global) === null || _window$dvaApp$_store4 === void 0 ? void 0 : (_window$dvaApp$_store5 = _window$dvaApp$_store4.supportLanguage) === null || _window$dvaApp$_store5 === void 0 ? void 0 : (_window$dvaApp$_store6 = _window$dvaApp$_store5.map) === null || _window$dvaApp$_store6 === void 0 ? void 0 : (_window$dvaApp$_store7 = _window$dvaApp$_store6.call(_window$dvaApp$_store5, ({
              value
            }) => ({
              [value]: item === null || item === void 0 ? void 0 : item.meaning
            }))) === null || _window$dvaApp$_store7 === void 0 ? void 0 : (_window$dvaApp$_store8 = _window$dvaApp$_store7.reduce) === null || _window$dvaApp$_store8 === void 0 ? void 0 : _window$dvaApp$_store8.call(_window$dvaApp$_store7, (obj, lang) => ({
              ...obj,
              ...lang
            }), {}))
          };
        });
        (_formValues2 = formValues) === null || _formValues2 === void 0 ? true : delete _formValues2.lovCode;
        (_formValues3 = formValues) === null || _formValues3 === void 0 ? true : delete _formValues3.lovName;
        (_formValues4 = formValues) === null || _formValues4 === void 0 ? true : delete _formValues4.valueList;
        (_formValues5 = formValues) === null || _formValues5 === void 0 ? true : delete _formValues5.lovValues;
      } else {
        var _formValues6, _formValues6$attribut;
        formValues.updateLov = lovValuesDs === null || lovValuesDs === void 0 ? void 0 : lovValuesDs.dirty;
        (_formValues6 = formValues) === null || _formValues6 === void 0 ? true : (_formValues6$attribut = _formValues6.attributeJson) === null || _formValues6$attribut === void 0 ? true : delete _formValues6$attribut.customOptionList;
        formValues.lovValues.forEach(v => {
          var _formValues7;
          Object.assign(v, {
            parentLovCode: (_formValues7 = formValues) === null || _formValues7 === void 0 ? void 0 : _formValues7.parentLovCode
          });
        });
      }
      formValues.defaultValueType = formValues.defaultValue ? 'NORMAL' : 'none';
      delete formValues.customOptionList;
      (_formValues$attribute = formValues.attributeJson) === null || _formValues$attribute === void 0 ? true : delete _formValues$attribute.optionSettings;
      if ((_formValues$attribute2 = formValues.attributeJson) !== null && _formValues$attribute2 !== void 0 && _formValues$attribute2.optionDirection) {
        var _formValues$attribute3;
        (_formValues$attribute3 = formValues.attributeJson) === null || _formValues$attribute3 === void 0 ? true : delete _formValues$attribute3.optionDirection; // 前后端删除了这个字段 为了防止老数据还提交这个数据导致报错 前端兼容性过滤一下
      }

      // 处理一下 parentLovCode
      formValues.attributeJson && (formValues.attributeJson.parentLovCode = (_formValues8 = formValues) === null || _formValues8 === void 0 ? void 0 : _formValues8.parentLovCode);
      return formValues; // 保存的时候需要把上次的数据也带上，防止有一些表单字段不显示，导致值丢失
    }
  };

  // 获取后端数据库中不存在的字段属性
  const getAttributeJson = () => {
    var _selectDs$current9, _selectDs$current10, _selectDs$current11;
    return {
      // 传给后端数据库中不存在的字段信息
      helpText: (_selectDs$current9 = selectDs.current) === null || _selectDs$current9 === void 0 ? void 0 : _selectDs$current9.get('helpText'),
      // optionDirection: selectDs.current?.get('optionDirection'),
      optionSettings: (_selectDs$current10 = selectDs.current) === null || _selectDs$current10 === void 0 ? void 0 : _selectDs$current10.get('optionSettings'),
      readOnlyFlag: (_selectDs$current11 = selectDs.current) === null || _selectDs$current11 === void 0 ? void 0 : _selectDs$current11.get('readOnlyFlag')
    };
  };

  // 租户查看平台标准字段禁用
  // const tenantStandardDisabled = isTenant && isEditMode && !isExtensionField;

  const queryLovData = async lovCode => {
    const res = await queryIdpValue(lovCode);
    if (getResponse(res)) {
      setLovData(res);
    }
    setVisible(!visible);
  };

  // 监听【选项设置】字段值的变化
  const handleSelectDsUpdate = ({
    name,
    value,
    record
  }) => {
    if (['businessObjectFieldCode', 'extendFieldCode', 'templateFieldCode', 'inheritFieldCode'].includes(name) && value) {
      record === null || record === void 0 ? void 0 : record.set(name, extendFieldPrefixRule ? _upperFirst(_camelCase(value)) : _camelCase(value));
    }
    if (name === 'optionSettings') {
      var _selectDs$current12;
      if (selectDs !== null && selectDs !== void 0 && (_selectDs$current12 = selectDs.current) !== null && _selectDs$current12 !== void 0 && _selectDs$current12.set) {
        var _selectDs$current13;
        if (value === '_custom' && valueListDs !== null && valueListDs !== void 0 && valueListDs.length) {
          const valueL = valueListDs.filter(v => v === null || v === void 0 ? void 0 : v.get('defaultFlag')).map(v => v.get('value'));
          selectDs.current.set('defaultValue', valueL.join());
        } else if (value === '_valueList' && lovValuesDs !== null && lovValuesDs !== void 0 && lovValuesDs.length) {
          const valueL = lovValuesDs.filter(v => v === null || v === void 0 ? void 0 : v.get('defaultFlag')).map(v => v.get('value'));
          selectDs.current.set('defaultValue', valueL.join());
        } else {
          selectDs.current.set('defaultValue', '');
        }
        selectDs === null || selectDs === void 0 ? void 0 : (_selectDs$current13 = selectDs.current) === null || _selectDs$current13 === void 0 ? void 0 : _selectDs$current13.set('parentOptionField', '');
      }
    }
    if (name === 'valueList') {
      handleDefaultValueFocus({});
      lovValuesDs.setState('dirtyFlag', false);
      if (value.parentLovCode) {
        var _selectDs$getField, _selectDs$getField$ca, _selectDs$getField$ca2, _selectDs$current14, _currentItem$get;
        const fieldDs = selectDs === null || selectDs === void 0 ? void 0 : (_selectDs$getField = selectDs.getField) === null || _selectDs$getField === void 0 ? void 0 : (_selectDs$getField$ca = _selectDs$getField.call(selectDs, 'parentOptionField')) === null || _selectDs$getField$ca === void 0 ? void 0 : (_selectDs$getField$ca2 = _selectDs$getField$ca.getOptions) === null || _selectDs$getField$ca2 === void 0 ? void 0 : _selectDs$getField$ca2.call(_selectDs$getField$ca, record);
        const currentItem = fieldDs === null || fieldDs === void 0 ? void 0 : fieldDs.find(v => (v === null || v === void 0 ? void 0 : v.get('lovCode')) === value.parentLovCode);
        (_selectDs$current14 = selectDs.current) === null || _selectDs$current14 === void 0 ? void 0 : _selectDs$current14.set('parentOptionField', currentItem === null || currentItem === void 0 ? void 0 : (_currentItem$get = currentItem.get) === null || _currentItem$get === void 0 ? void 0 : _currentItem$get.call(currentItem, 'businessObjectFieldCode'));
      }
    }
    if (name === 'parentOptionField') {
      var _selectDs$getField2, _selectDs$getField2$c, _selectDs$getField2$c2;
      lovValuesDs === null || lovValuesDs === void 0 ? void 0 : lovValuesDs.forEach(myRecord => myRecord === null || myRecord === void 0 ? void 0 : myRecord.set('parentValue', ''));
      valueListDs === null || valueListDs === void 0 ? void 0 : valueListDs.forEach(myRecord => myRecord === null || myRecord === void 0 ? void 0 : myRecord.set('parentValue', ''));
      const fieldDs = selectDs === null || selectDs === void 0 ? void 0 : (_selectDs$getField2 = selectDs.getField) === null || _selectDs$getField2 === void 0 ? void 0 : (_selectDs$getField2$c = _selectDs$getField2.call(selectDs, 'parentOptionField')) === null || _selectDs$getField2$c === void 0 ? void 0 : (_selectDs$getField2$c2 = _selectDs$getField2$c.getOptions) === null || _selectDs$getField2$c2 === void 0 ? void 0 : _selectDs$getField2$c2.call(_selectDs$getField2$c, record);
      const currentItem = fieldDs === null || fieldDs === void 0 ? void 0 : fieldDs.find(v => (v === null || v === void 0 ? void 0 : v.get('businessObjectFieldCode')) === value);
      setOptions(currentItem);
    }
  };
  const setOptions = currentItem => {
    if (currentItem !== null && currentItem !== void 0 && currentItem.get('lovCode')) {
      var _lovValuesDs$getField, _valueListDs$getField, _lovValuesDs$getField2, _valueListDs$getField2, _selectDs$current15, _selectDs$current15$s;
      lovValuesDs === null || lovValuesDs === void 0 ? void 0 : (_lovValuesDs$getField = lovValuesDs.getField('parentValue')) === null || _lovValuesDs$getField === void 0 ? void 0 : _lovValuesDs$getField.set('lookupCode', currentItem === null || currentItem === void 0 ? void 0 : currentItem.get('lovCode'));
      valueListDs === null || valueListDs === void 0 ? void 0 : (_valueListDs$getField = valueListDs.getField('parentValue')) === null || _valueListDs$getField === void 0 ? void 0 : _valueListDs$getField.set('lookupCode', currentItem === null || currentItem === void 0 ? void 0 : currentItem.get('lovCode'));
      lovValuesDs === null || lovValuesDs === void 0 ? void 0 : (_lovValuesDs$getField2 = lovValuesDs.getField('parentValue')) === null || _lovValuesDs$getField2 === void 0 ? void 0 : _lovValuesDs$getField2.set('options', undefined);
      valueListDs === null || valueListDs === void 0 ? void 0 : (_valueListDs$getField2 = valueListDs.getField('parentValue')) === null || _valueListDs$getField2 === void 0 ? void 0 : _valueListDs$getField2.set('options', undefined);
      selectDs === null || selectDs === void 0 ? void 0 : (_selectDs$current15 = selectDs.current) === null || _selectDs$current15 === void 0 ? void 0 : (_selectDs$current15$s = _selectDs$current15.set) === null || _selectDs$current15$s === void 0 ? void 0 : _selectDs$current15$s.call(_selectDs$current15, 'parentLovCode', (currentItem === null || currentItem === void 0 ? void 0 : currentItem.get('lovCode')) || '');
    } else {
      var _selectDs$current16, _selectDs$current16$s, _lovValuesDs$getField3, _valueListDs$getField3, _currentItem$get2, _currentItem$get2$cal, _lovValuesDs$getField4, _valueListDs$getField4;
      selectDs === null || selectDs === void 0 ? void 0 : (_selectDs$current16 = selectDs.current) === null || _selectDs$current16 === void 0 ? void 0 : (_selectDs$current16$s = _selectDs$current16.set) === null || _selectDs$current16$s === void 0 ? void 0 : _selectDs$current16$s.call(_selectDs$current16, 'parentLovCode', undefined);
      lovValuesDs === null || lovValuesDs === void 0 ? void 0 : (_lovValuesDs$getField3 = lovValuesDs.getField('parentValue')) === null || _lovValuesDs$getField3 === void 0 ? void 0 : _lovValuesDs$getField3.set('lookupCode', undefined);
      valueListDs === null || valueListDs === void 0 ? void 0 : (_valueListDs$getField3 = valueListDs.getField('parentValue')) === null || _valueListDs$getField3 === void 0 ? void 0 : _valueListDs$getField3.set('lookupCode', undefined);
      const _ref = window.dvaApp._store.getState().global || {},
        language = _ref.language;
      const options = toJS((currentItem === null || currentItem === void 0 ? void 0 : (_currentItem$get2 = currentItem.get) === null || _currentItem$get2 === void 0 ? void 0 : (_currentItem$get2$cal = _currentItem$get2.call(currentItem, 'attributeJson')) === null || _currentItem$get2$cal === void 0 ? void 0 : _currentItem$get2$cal.customOptionList) || []);
      options.forEach(v => {
        var _v$meaning;
        Object.assign(v, {
          meaning: v === null || v === void 0 ? void 0 : (_v$meaning = v.meaning) === null || _v$meaning === void 0 ? void 0 : _v$meaning[language]
        });
      });
      const listDs = new _DataSet({
        paging: false,
        data: options
      });
      lovValuesDs === null || lovValuesDs === void 0 ? void 0 : (_lovValuesDs$getField4 = lovValuesDs.getField('parentValue')) === null || _lovValuesDs$getField4 === void 0 ? void 0 : _lovValuesDs$getField4.set('options', listDs);
      valueListDs === null || valueListDs === void 0 ? void 0 : (_valueListDs$getField4 = valueListDs.getField('parentValue')) === null || _valueListDs$getField4 === void 0 ? void 0 : _valueListDs$getField4.set('options', listDs);
    }
  };

  // 绑定ds update
  useEffect(() => {
    selectDs.addEventListener('update', handleSelectDsUpdate);
    return () => {
      selectDs.removeEventListener('update', handleSelectDsUpdate);
    };
  }, [selectDs]);
  useDataSetEvents(selectDs, 'load', () => {
    var _selectDs$current17;
    const parentFid = selectDs === null || selectDs === void 0 ? void 0 : (_selectDs$current17 = selectDs.current) === null || _selectDs$current17 === void 0 ? void 0 : _selectDs$current17.get('parentOptionField');
    if (parentFid) {
      setTimeout(() => {
        var _selectDs$getField3, _selectDs$getField3$c, _selectDs$getField3$c2;
        const fieldDs = selectDs === null || selectDs === void 0 ? void 0 : (_selectDs$getField3 = selectDs.getField) === null || _selectDs$getField3 === void 0 ? void 0 : (_selectDs$getField3$c = _selectDs$getField3.call(selectDs, 'parentOptionField')) === null || _selectDs$getField3$c === void 0 ? void 0 : (_selectDs$getField3$c2 = _selectDs$getField3$c.getOptions) === null || _selectDs$getField3$c2 === void 0 ? void 0 : _selectDs$getField3$c2.call(_selectDs$getField3$c, selectDs.get(0));
        const currentItem = fieldDs === null || fieldDs === void 0 ? void 0 : fieldDs.find(v => (v === null || v === void 0 ? void 0 : v.get('businessObjectFieldCode')) === parentFid);
        setOptions(currentItem);
      }, 1000);
    }
  });

  // 初始化默认值
  const initDefaultField = _initData => {
    const lovCode = _initData.lovCode,
      _initData$attributeJs = _initData.attributeJson,
      attributeJson = _initData$attributeJs === void 0 ? {} : _initData$attributeJs;
    const _ref2 = attributeJson || {},
      optionSettings = _ref2.optionSettings,
      customOptionList = _ref2.customOptionList;
    if (!optionSettings || !attributeJson.componentType) return;
    // if (
    //   _componentType === 'SINGLE_SELECT' ||
    //   _componentType === 'MULTIPLE_SELECT' ||
    //   _componentType === 'RADIO' ||
    //   _componentType === 'CHECKBOX'
    // ) {
    handleDefaultValueFocus({
      _lovCode: lovCode,
      _optionSettings: optionSettings,
      _customOptionList: customOptionList,
      _initData: _initData
    });
    // }
  };

  // 手动获取值集
  const handleDefaultValueFocus = async ({
    _lovCode,
    _optionSettings,
    _customOptionList,
    _initData,
    customData
  }) => {
    var _selectDs$current18;
    const tempOptionSettings = _optionSettings || ((_selectDs$current18 = selectDs.current) === null || _selectDs$current18 === void 0 ? void 0 : _selectDs$current18.get('optionSettings'));
    const isValueList = tempOptionSettings === '_valueList';
    if (isValueList) {
      var _selectDs$current19;
      // 值集
      const lovCode = _lovCode || ((_selectDs$current19 = selectDs.current) === null || _selectDs$current19 === void 0 ? void 0 : _selectDs$current19.get('lovCode'));
      if (!lovCode) return;
      // const res = await queryIdpValue(lovCode, { lang: language });
      const res = await queryMultiIdpValue(lovCode);
      if (getResponse(res)) {
        var _defaultArr;
        setDefaultFileValueList(res);
        // if (!isTenant) {
        // 处理默认值问题
        let defaultArr = [];
        if (_initData) {
          if (['MULTIPLE_SELECT', 'CHECKBOX'].includes(_initData === null || _initData === void 0 ? void 0 : _initData.componentType)) {
            var _initData$defaultValu;
            defaultArr = _initData === null || _initData === void 0 ? void 0 : (_initData$defaultValu = _initData.defaultValue) === null || _initData$defaultValu === void 0 ? void 0 : _initData$defaultValu.split(',');
          } else {
            defaultArr = [_initData === null || _initData === void 0 ? void 0 : _initData.defaultValue];
          }
        }
        if (['RADIO', 'SINGLE_SELECT'].includes(componentType) && ((_defaultArr = defaultArr) === null || _defaultArr === void 0 ? void 0 : _defaultArr.length) > 1) {
          defaultArr = defaultArr.splice(0, 1);
        }
        res.forEach(v => {
          var _defaultArr2;
          if (!['RADIO', 'SINGLE_SELECT'].includes(componentType) || ((_defaultArr2 = defaultArr) === null || _defaultArr2 === void 0 ? void 0 : _defaultArr2.length) <= 1) {
            var _defaultArr3;
            ((_defaultArr3 = defaultArr) === null || _defaultArr3 === void 0 ? void 0 : _defaultArr3.includes(v.value)) && Object.assign(v, {
              defaultFlag: true
            });
          }
          // Object.assign(v, { meaning: { [language]: v.meaning } });

          // customData 生成独立值集进来的时候 需要添加默认值
          if (customData !== null && customData !== void 0 && customData.length) {
            if (customData.find(item => item.value === v.value)) {
              v.defaultFlag = customData.find(item => item.value === v.value).defaultFlag;
            }
          }
        });
        lovValuesDs.loadData(res);
        if (res !== null && res !== void 0 && res.length) {
          var _selectDs$current20, _valueL$join;
          const valueL = res.filter(v => v.defaultFlag).map(v => v.value);
          selectDs === null || selectDs === void 0 ? void 0 : (_selectDs$current20 = selectDs.current) === null || _selectDs$current20 === void 0 ? void 0 : _selectDs$current20.init('defaultValue', (valueL === null || valueL === void 0 ? void 0 : (_valueL$join = valueL.join) === null || _valueL$join === void 0 ? void 0 : _valueL$join.call(valueL)) || '');
        }
        // }
      }
    } else {
      // 自定义
      setDefaultFileValueList(_customOptionList || valueListDs.toData());
    }
  };
  const openCreateValueList = ds => {
    var _selectDs$current21, _selectDs$current22;
    _Modal.open({
      key: createValueListKey,
      title: intl.get('hmde.bo.businessObject.valueList.create').d('值集定义'),
      border: false,
      autoCenter: true,
      children: /*#__PURE__*/React.createElement(LovDefineModal, {
        valueList: ds === null || ds === void 0 ? void 0 : ds.toData(),
        businessObjectCode: businessObjectCode,
        businessObjectId: businessObjectId,
        parentOptionField: selectDs === null || selectDs === void 0 ? void 0 : (_selectDs$current21 = selectDs.current) === null || _selectDs$current21 === void 0 ? void 0 : _selectDs$current21.get('parentOptionField'),
        businessObjectFieldId: selectDs === null || selectDs === void 0 ? void 0 : (_selectDs$current22 = selectDs.current) === null || _selectDs$current22 === void 0 ? void 0 : _selectDs$current22.get('businessObjectFieldId'),
        selectDs: selectDs,
        handleDefaultValueFocus: handleDefaultValueFocus,
        isFromDomain: isFromDomain
      })
    });
  };

  // 因为多语言关系，需要手动转一下值集的meaning
  const getValueListMeaning = val => {
    if (typeof val === 'string') {
      return val;
    } else if (typeof val === 'object') {
      const _ref3 = props || {},
        _language = _ref3.language;
      return val[_language];
    } else {
      return val;
    }
  };
  const handleMenuClick = () => {
    var _selectDs$current23;
    const lovCode = (_selectDs$current23 = selectDs.current) === null || _selectDs$current23 === void 0 ? void 0 : _selectDs$current23.get('lovCode');
    if (visible && lovCode) {
      queryLovData(lovCode);
    } else {
      setVisible(!visible);
    }
  };
  const menu = /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: 450,
      overflow: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => setVisible(true)
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['meaning-value-container']
  }, /*#__PURE__*/React.createElement("span", null, intl.get('hmde.common.value').d('值（用于储存）')), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null, intl.get('hmde.common.meaningShow').d('含义（用于显示）'))), (lovData || []).map(item => /*#__PURE__*/React.createElement("div", {
    className: styles['meaning-value-container']
  }, /*#__PURE__*/React.createElement("span", null, item.value), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null, item.meaning)))));
  const getAddonBefore = useMemo(() => {
    return extendFieldPrefixRule || '';
  }, [extendFieldPrefixRule]);

  // 上级选项字段过滤
  const handleUperiorSelectFilter = record => {
    var _selectDs$current24, _record$get, _selectDs$current25, _selectDs$current26;
    const isF = (selectDs === null || selectDs === void 0 ? void 0 : (_selectDs$current24 = selectDs.current) === null || _selectDs$current24 === void 0 ? void 0 : _selectDs$current24.get('businessObjectFieldCode')) !== (record === null || record === void 0 ? void 0 : record.get('businessObjectFieldCode')) && ((record === null || record === void 0 ? void 0 : (_record$get = record.get('attributeJson')) === null || _record$get === void 0 ? void 0 : _record$get.parentOptionField) !== (selectDs === null || selectDs === void 0 ? void 0 : (_selectDs$current25 = selectDs.current) === null || _selectDs$current25 === void 0 ? void 0 : _selectDs$current25.get('businessObjectFieldCode')) || !isEditMode);
    // 如果当前字段是自定义，父级字段可以选择自定义或者值集，如果当前字段是值集，父级字段只能是值集
    if ((selectDs === null || selectDs === void 0 ? void 0 : (_selectDs$current26 = selectDs.current) === null || _selectDs$current26 === void 0 ? void 0 : _selectDs$current26.get('optionSettings')) === '_valueList') {
      return !!(record !== null && record !== void 0 && record.get('lovCode')) && isF;
    }
    return isF;
  };
  return /*#__PURE__*/React.createElement(Observer, null, () => {
    var _selectDs$current27, _selectDs$current28, _selectDs$current29, _selectDs$current30, _selectDs$current31, _selectDs$current32, _selectDs$current33;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_Form, {
      dataSet: selectDs,
      columns: 2
      // useColon={false}
      ,
      disabled: disabled || boSourceType === SourceType.PREDEFINE && !isTenant && isEditMode
      // labelWidth="auto" // 甄云环境因ued样式文件不同而出现样式错误问题
      ,
      labelLayout: "horizontal",
      labelAlign: "left",
      className: styles['select-form']
    }, !isFromDomain && !isExtensionField && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_IntlField, {
      name: "businessObjectFieldName",
      suffix: /*#__PURE__*/React.createElement(_Icon, {
        type: "language"
      }),
      placeholder: intl.get('hmde.bo.businessObject.enterthefieldname').d('请输入字段名称'),
      showLengthInfo: true,
      disabled: dimensionFlag
    }), isEditMode ? /*#__PURE__*/React.createElement(_Output, {
      name: "businessObjectFieldCode"
    }) : /*#__PURE__*/React.createElement(_TextField, {
      name: "businessObjectFieldCode",
      placeholder: intl.get('hmde.bo.businessObject.enterthefieldcode').d('请输入字段编码'),
      addonBefore: getAddonBefore && /*#__PURE__*/React.createElement(_Tooltip, {
        title: getAddonBefore
      }, getAddonBefore),
      maxLength: 60 - getAddonBefore.length,
      showLengthInfo: true
    })), !isFromDomain && isExtensionField && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_IntlField, {
      name: "inheritFieldName",
      suffix: /*#__PURE__*/React.createElement(_Icon, {
        type: "language"
      }),
      placeholder: intl.get('hmde.bo.businessObject.enterthefieldname').d('请输入字段名称')
    }), boSourceType !== 'TENANT' && domainEnabledFlag && /*#__PURE__*/React.createElement(Lov, {
      name: "businessObjectField",
      hidden: isEditMode,
      placeholder: intl.get('hmde.bo.businessObject.please.SelectExtendedField').d('请选择扩展字段')
    }), isEditMode || isExtensionField && isEditMode ? /*#__PURE__*/React.createElement(_Output, {
      name: "businessObjectFieldCode"
    }) : /*#__PURE__*/React.createElement(_TextField, {
      name: "inheritFieldCode",
      placeholder: intl.get('hmde.bo.businessObject.enterthefieldcode').d('请输入字段编码'),
      addonBefore: getAddonBefore && /*#__PURE__*/React.createElement(_Tooltip, {
        title: getAddonBefore
      }, getAddonBefore),
      maxLength: 60 - getAddonBefore.length,
      showLengthInfo: true
    })), isFromDomain && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_IntlField, {
      name: "templateFieldName",
      suffix: /*#__PURE__*/React.createElement(_Icon, {
        type: "language"
      }),
      placeholder: intl.get('hmde.bo.businessObject.enterthefieldname').d('请输入字段名称')
    }), isEditMode ? /*#__PURE__*/React.createElement(_Output, {
      name: "templateFieldCode"
    }) : /*#__PURE__*/React.createElement(_TextField, {
      name: "templateFieldCode",
      disabled: isEditMode,
      placeholder: intl.get('hmde.bo.businessObject.enterthefieldcode').d('请输入字段编码'),
      maxLength: 60,
      showLengthInfo: true
    })), !dimensionFlag && /*#__PURE__*/React.createElement(_SelectBox, {
      name: "optionSettings",
      disabled: isTenant && boSourceType !== 'TENANT' && isEditMode && !isExtensionField
    }, /*#__PURE__*/React.createElement(Option, {
      value: "_custom"
    }, intl.get('hmde.common.custom').d('自定义')), /*#__PURE__*/React.createElement(Option, {
      value: "_valueList"
    }, intl.get('hmde.common.valueList').d('值集'))), !dimensionFlag && !isFromDomain && /*#__PURE__*/React.createElement(_Select, {
      name: "parentOptionField",
      optionsFilter: record => handleUperiorSelectFilter(record),
      disabled: boSourceType === SourceType.PREDEFINE && !isTenant && isEditMode || isTenant && boSourceType !== 'TENANT' && isEditMode && !isExtensionField
    })), ((_selectDs$current27 = selectDs.current) === null || _selectDs$current27 === void 0 ? void 0 : _selectDs$current27.get('optionSettings')) === '_valueList' && !dimensionFlag && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: styles['row-valueList']
    }, /*#__PURE__*/React.createElement("div", {
      className: styles['row-valueList-lov']
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-block',
        width: 58
      }
    }, intl.get('hmde.common.valueList').d('值集')), /*#__PURE__*/React.createElement(Lov, {
      style: {
        flex: 1
      },
      dataSet: selectDs,
      name: "valueList",
      clearButton: false,
      noCache: true,
      disabled: disabled || boSourceType === SourceType.PREDEFINE && !isTenant && isEditMode || isTenant && boSourceType !== 'TENANT' && isEditMode && !isExtensionField,
      onBeforeSelect: () => {
        if (lovValuesDs.dirty && !lovValuesDs.getState('dirtyFlag') && !isTenant) {
          _Modal.open({
            key: _Modal.key(),
            title: intl.get('hmde.bo.businessObject.warningMes').d('警告信息'),
            border: false,
            autoCenter: true,
            children: intl.get('hmde.bo.businessObject.warnMesDetail').d('值列表【值列表名称】内容已发生更新，若您切换值列表，更新将被舍弃，是否确认切换值列表？'),
            onOk: () => {
              lovValuesDs.setState('dirtyFlag', true);
            }
          });
          return false;
        }
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: styles['valueList-operate']
    }, isTenant && /*#__PURE__*/React.createElement(_Dropdown, {
      overlay: menu,
      hidden: visible
    }, /*#__PURE__*/React.createElement(_Button, {
      onClick: handleMenuClick,
      funcType: "flat",
      icon: "visibility-o"
    }, intl.get('hmde.common.lookup').d('查看'))), /*#__PURE__*/React.createElement(_Button, {
      onClick: () => openCreateValueList(),
      disabled: disabled || boSourceType === SourceType.PREDEFINE && !isTenant && isEditMode || isTenant && boSourceType !== 'TENANT' && isEditMode && !isExtensionField,
      icon: "add",
      funcType: "flat"
    }, intl.get('hmde.bo.businessObject.valueList.add').d('新建值集')))), !isTenant && ((_selectDs$current28 = selectDs.current) === null || _selectDs$current28 === void 0 ? void 0 : _selectDs$current28.get('lovCode')) && (!!lovValuesDs.length || showlovValuesListFlag) && /*#__PURE__*/React.createElement("div", {
      className: styles['row-custom']
    }, /*#__PURE__*/React.createElement("div", {
      className: styles['row-custom-header']
    }, /*#__PURE__*/React.createElement("span", null, intl.get('hmde.bo.businessObject.valueListData').d('值集数据')), /*#__PURE__*/React.createElement(_Button, {
      onClick: () => {
        lovValuesDs.create({});
      },
      disabled: disabled || boSourceType === SourceType.PREDEFINE && !isTenant && isEditMode || isTenant && boSourceType !== 'TENANT' && isEditMode && !isExtensionField,
      funcType: "flat",
      icon: "add"
    }, intl.get('hmde.bo.businessObject.createCodeField').d('新建编码字段'))), /*#__PURE__*/React.createElement(LovValuesList, {
      operateHeaderFlag: false,
      valueListDs: lovValuesDs,
      defaultValueMultipleFlag: defaultValueMultipleFlag,
      parentOptionField: (_selectDs$current29 = selectDs.current) === null || _selectDs$current29 === void 0 ? void 0 : _selectDs$current29.get('parentOptionField'),
      disabled: disabled || boSourceType === SourceType.PREDEFINE && !isTenant && isEditMode || isTenant && boSourceType !== 'TENANT' && isEditMode && !isExtensionField
    }))), ((_selectDs$current30 = selectDs.current) === null || _selectDs$current30 === void 0 ? void 0 : _selectDs$current30.get('optionSettings')) === '_custom' && !dimensionFlag && /*#__PURE__*/React.createElement("div", {
      className: styles['row-custom']
    }, /*#__PURE__*/React.createElement("div", {
      className: styles['row-custom-header']
    }, /*#__PURE__*/React.createElement("span", null, intl.get('hmde.common.custom').d('自定义')), /*#__PURE__*/React.createElement(_Button, {
      disabled: disabled || boSourceType === SourceType.PREDEFINE && !isTenant && isEditMode || isTenant && boSourceType !== 'TENANT' && isEditMode && !isExtensionField,
      onClick: () => {
        valueListDs.create({});
      },
      funcType: "flat",
      icon: "add"
    }, intl.get('hmde.bo.businessObject.addCustomOptions').d('新建自定义选项'))), /*#__PURE__*/React.createElement(LovValuesList, {
      operateHeaderFlag: false,
      valueListDs: valueListDs,
      defaultValueMultipleFlag: defaultValueMultipleFlag,
      parentOptionField: (_selectDs$current31 = selectDs.current) === null || _selectDs$current31 === void 0 ? void 0 : _selectDs$current31.get('parentOptionField'),
      disabled: disabled || boSourceType === SourceType.PREDEFINE && !isTenant && isEditMode || isTenant && boSourceType !== 'TENANT' && isEditMode && !isExtensionField
    }), /*#__PURE__*/React.createElement("div", {
      className: styles['row-custom-footer']
    }, /*#__PURE__*/React.createElement("p", null, intl.get('hmde.bo.businessObject.valueList.custom.create.help').d('生成独立值集操作会将自定义的选项内容转化为独立值集，执行后选项会跳转到值集选项，字段选择创建的值集。')), /*#__PURE__*/React.createElement("a", {
      disabled: disabled || boSourceType === SourceType.PREDEFINE && !isTenant && isEditMode || isTenant && boSourceType !== 'TENANT' && isEditMode && !isExtensionField,
      onClick: async () => {
        if (await valueListDs.validate()) {
          openCreateValueList(valueListDs);
        }
      }
    }, intl.get('hmde.bo.businessObject.valueList.custom.create').d('生成独立值集')))), dimensionFlag && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SectionTitle, {
      title: intl.get('hmde.bo.businessObject.dimensionConfig').d('维度配置')
    }), /*#__PURE__*/React.createElement(_Alert, {
      style: {
        margin: '-4px 0 12px 0'
      },
      message: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, intl.get('hmde.bo.businessObject.dimensionConfig.alert1').d('配置参数的维度及维度值来源，维护参数时可指定参数生效的维度及维度值；')), /*#__PURE__*/React.createElement("div", null, intl.get('hmde.bo.businessObject.dimensionConfig.alert2').d('维度判断存在优先级，按配置顺序由上至下依次判断。'))),
      type: "info",
      showIcon: true
    }), /*#__PURE__*/React.createElement(DimensionConfig, {
      ds: selectDs,
      dRef: dRef
    })), /*#__PURE__*/React.createElement(_Form, {
      dataSet: selectDs,
      columns: 2
      // useColon={false}
      ,
      labelLayout: "horizontal",
      disabled: disabled || boSourceType === SourceType.PREDEFINE && !isTenant && isEditMode,
      labelAlign: "left"
    }, ((_selectDs$current32 = selectDs.current) === null || _selectDs$current32 === void 0 ? void 0 : _selectDs$current32.get('optionSettings')) === '_valueList' && isTenant && /*#__PURE__*/React.createElement(_Select, {
      key: "defaultValue",
      name: "defaultValue",
      searchable: true,
      searchFieldInPopup: true,
      disabled: isTenant && boSourceType !== 'TENANT' && isEditMode && !isExtensionField,
      multiple: defaultValueMultipleFlag,
      onFocus: () => handleDefaultValueFocus({}),
      searchMatcher: ({
        text,
        record
      }) => {
        const meaning = getValueListMeaning(record.toData().meaning || '');
        return meaning.toLowerCase().indexOf(text.toLowerCase()) !== -1;
      },
      placeholder: intl.get('hmde.bo.businessObject.chooseDefault').d('请选择默认值')
    }, defaultFileValueList.map(i => {
      return /*#__PURE__*/React.createElement(Option, {
        key: i === null || i === void 0 ? void 0 : i.value,
        value: i === null || i === void 0 ? void 0 : i.value
      }, getValueListMeaning(i === null || i === void 0 ? void 0 : i.meaning));
    })), /*#__PURE__*/React.createElement(_NumberField, {
      name: "maxLength",
      placeholder: intl.get('hmde.bo.businessObject.please.Entermaximumlength').d('请输入最大长度'),
      disabled: dimensionFlag
    }), /*#__PURE__*/React.createElement(_Switch, {
      key: "requiredFlag",
      name: "requiredFlag",
      disabled: isTenant && isEditMode && !isExtensionField && ((_selectDs$current33 = selectDs.current) === null || _selectDs$current33 === void 0 ? void 0 : _selectDs$current33.get('platformFieldRequiredFlag')) || dimensionFlag
    })), /*#__PURE__*/React.createElement(SectionTitle, {
      title: intl.get('hmde.bo.businessObject.otherprops').d('其他属性')
    }), /*#__PURE__*/React.createElement(_Form, {
      dataSet: selectDs,
      columns: 2
      // useColon={false}
      ,
      disabled: disabled || boSourceType === SourceType.PREDEFINE && !isTenant && isEditMode || dimensionFlag
      // labelWidth="auto" // 甄云环境因ued样式文件不同而出现样式错误问题
      ,
      labelLayout: "horizontal",
      labelAlign: "left"
    }, /*#__PURE__*/React.createElement(_Output, {
      name: "helpText",
      key: "helpText",
      colSpan: 1,
      newLine: true,
      renderer: ({
        record
      }) => {
        return /*#__PURE__*/React.createElement(MultiIntlField, {
          name: "helpText",
          record: record,
          label: intl.get('hmde.common.helpText').d('帮助文本'),
          init: record === null || record === void 0 ? void 0 : record.get('helpText'),
          textFieldStyle: {
            height: '85px'
          },
          disabled: boSourceType === SourceType.PREDEFINE && !isTenant && isEditMode || isTenant && boSourceType !== 'TENANT' && isEditMode && !isExtensionField
        });
      }
    }), /*#__PURE__*/React.createElement(_IntlField, {
      name: "remark",
      colSpan: 1,
      style: {
        height: '85px'
      },
      type: "multipleLine",
      suffix: /*#__PURE__*/React.createElement(_Icon, {
        type: "language"
      }),
      disabled: isTenant && boSourceType !== 'TENANT' && isEditMode && !isExtensionField,
      placeholder: intl.get('hmde.common.remark.placeholder').d('请输入描述')
    }), isTenant && boSourceType !== 'TENANT' && isEditMode && !isExtensionField ? !isApiCustomType && /*#__PURE__*/React.createElement(_Switch, {
      key: "exportableFlag",
      name: "exportableFlag",
      disabled: true
    }) : !isApiCustomType &&
    /*#__PURE__*/
    // eslint-disable-next-line react/jsx-indent
    React.createElement(_Output, {
      name: "exportableFlag",
      key: "exportableFlag",
      style: {
        border: 'none'
      },
      renderer: ({
        record
      }) => {
        return dimensionFlag ? /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(_Switch, {
          name: "exportableFlag",
          readOnly: true
        })) : /*#__PURE__*/React.createElement(_Popconfirm, {
          title: renderPopConfirmTitle(record !== null && record !== void 0 && record.get('exportableFlag') ? intl.get('hmde.bo.businessObject.exportableFlag.closetip').d('关闭开关并发布后，该字段的数据将不允许导出，请确认是否关闭？') : intl.get('hmde.bo.businessObject.exportableFlag.opentip').d('开启开关并发布后，该字段的数据将允许导出，请确认是否开启？'), record !== null && record !== void 0 && record.get('exportableFlag') ? intl.get('hmde.bo.businessObject.isCose').d('是否关闭') : intl.get('hmde.bo.businessObject.isOpen').d('是否开启')),
          okText: intl.get('hmde.common.button.ensure').d('确认'),
          cancelText: intl.get('hmde.common.button.cancel').d('取消'),
          onConfirm: () => record === null || record === void 0 ? void 0 : record.set('exportableFlag', !(record !== null && record !== void 0 && record.get('exportableFlag')))
        }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(_Switch, {
          name: "exportableFlag",
          readOnly: true
        })));
      }
    })), !isFromDomain && !isExtensionField && !isApiCustomType && /*#__PURE__*/React.createElement(_Form, {
      dataSet: selectDs,
      columns: 2
      // useColon={false}
      ,
      labelLayout: "horizontal",
      disabled: isTenant && boSourceType !== 'TENANT' && isEditMode && !isExtensionField || dimensionFlag,
      labelAlign: "left",
      labelWidth: 110
    }, /*#__PURE__*/React.createElement(_Switch, {
      key: "defaultDisplayFieldFlag",
      name: "defaultDisplayFieldFlag"
    })));
  });
}
export default formatterCollections({
  code: ['hmde.common', 'hmde.bo']
})(Index);