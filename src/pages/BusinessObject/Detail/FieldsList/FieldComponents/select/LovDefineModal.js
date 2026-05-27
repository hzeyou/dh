import _extends from "@babel/runtime/helpers/esm/extends";
import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _Select from "@hzero-front-ui/c7n-ui/lib/SelectPro";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _IntlField from "@hzero-front-ui/c7n-ui/lib/IntlFieldPro";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import _noop from "lodash/noop";
import React, { useEffect, useMemo } from 'react';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { observer } from 'mobx-react-lite';
// import { LabelAlign } from 'choerodon-ui/pro/lib/form/enum';

import useDataSetEvents from 'hzero-front-apaas/lib/hooks/useDataSetEvents';
import notification from 'hzero-front/lib/utils/notification';
import { toJS } from 'mobx';
import LovValuesList from "./LovValuesList";
import { lovDefineDS, lovValuesDS } from "./SelectDS";
const Index = ({
  modal,
  valueList = [],
  businessObjectCode,
  businessObjectId,
  parentOptionField,
  selectDs,
  onResponse,
  valuesListProps,
  handleDefaultValueFocus = _noop,
  // businessObjectFieldId,
  isFromDomain
}) => {
  var _lovDefineDs$current6;
  const lovDefineDs = useMemo(() => new _DataSet({
    ...lovDefineDS({
      businessObjectCode,
      selectDs,
      businessObjectId,
      // businessObjectFieldId,
      clearCacheNum: +new Date()
    }),
    children: {
      lovValues: new _DataSet(lovValuesDS())
    }
  }), []);
  useEffect(() => {
    if (parentOptionField) {
      var _lovDefineDs$current;
      lovDefineDs === null || lovDefineDs === void 0 ? void 0 : (_lovDefineDs$current = lovDefineDs.current) === null || _lovDefineDs$current === void 0 ? void 0 : _lovDefineDs$current.set('parentOptionField', parentOptionField);
      setTimeout(() => {
        var _selectDs$getField, _selectDs$getField$ca, _selectDs$getField$ca2;
        const fieldDs = selectDs === null || selectDs === void 0 ? void 0 : (_selectDs$getField = selectDs.getField) === null || _selectDs$getField === void 0 ? void 0 : (_selectDs$getField$ca = _selectDs$getField.call(selectDs, 'parentOptionField')) === null || _selectDs$getField$ca === void 0 ? void 0 : (_selectDs$getField$ca2 = _selectDs$getField$ca.getOptions) === null || _selectDs$getField$ca2 === void 0 ? void 0 : _selectDs$getField$ca2.call(_selectDs$getField$ca, selectDs.get(0));
        const currentItem = fieldDs === null || fieldDs === void 0 ? void 0 : fieldDs.find(v => (v === null || v === void 0 ? void 0 : v.get('businessObjectFieldCode')) === parentOptionField);
        setOptions(currentItem);
      }, 1000);
    }
    lovDefineDs.children.lovValues.loadData(valueList);
  }, []);
  useDataSetEvents(lovDefineDs, 'update', ({
    name,
    value,
    record
  }) => {
    if (name === 'parentOptionField') {
      var _lovDefineDs$children, _lovDefineDs$getField, _lovDefineDs$getField2, _lovDefineDs$getField3;
      (_lovDefineDs$children = lovDefineDs.children.lovValues) === null || _lovDefineDs$children === void 0 ? void 0 : _lovDefineDs$children.forEach(myRecord => myRecord === null || myRecord === void 0 ? void 0 : myRecord.set('parentValue', ''));
      const fieldDs = lovDefineDs === null || lovDefineDs === void 0 ? void 0 : (_lovDefineDs$getField = lovDefineDs.getField) === null || _lovDefineDs$getField === void 0 ? void 0 : (_lovDefineDs$getField2 = _lovDefineDs$getField.call(lovDefineDs, 'parentOptionField')) === null || _lovDefineDs$getField2 === void 0 ? void 0 : (_lovDefineDs$getField3 = _lovDefineDs$getField2.getOptions) === null || _lovDefineDs$getField3 === void 0 ? void 0 : _lovDefineDs$getField3.call(_lovDefineDs$getField2, record);
      const currentItem = fieldDs === null || fieldDs === void 0 ? void 0 : fieldDs.find(v => (v === null || v === void 0 ? void 0 : v.get('businessObjectFieldCode')) === value);
      setOptions(currentItem);
    }
  });
  const setOptions = currentItem => {
    if (currentItem !== null && currentItem !== void 0 && currentItem.get('lovCode')) {
      var _lovDefineDs$children2, _lovDefineDs$children3, _lovDefineDs$children4, _lovDefineDs$children5;
      (_lovDefineDs$children2 = lovDefineDs.children.lovValues) === null || _lovDefineDs$children2 === void 0 ? void 0 : (_lovDefineDs$children3 = _lovDefineDs$children2.getField('parentValue')) === null || _lovDefineDs$children3 === void 0 ? void 0 : _lovDefineDs$children3.set('lookupCode', currentItem === null || currentItem === void 0 ? void 0 : currentItem.get('lovCode'));
      (_lovDefineDs$children4 = lovDefineDs.children.lovValues) === null || _lovDefineDs$children4 === void 0 ? void 0 : (_lovDefineDs$children5 = _lovDefineDs$children4.getField('parentValue')) === null || _lovDefineDs$children5 === void 0 ? void 0 : _lovDefineDs$children5.set('options', undefined);
    } else {
      var _lovDefineDs$children6, _lovDefineDs$children7, _currentItem$get, _currentItem$get$call, _lovDefineDs$children8, _lovDefineDs$children9;
      (_lovDefineDs$children6 = lovDefineDs.children.lovValues) === null || _lovDefineDs$children6 === void 0 ? void 0 : (_lovDefineDs$children7 = _lovDefineDs$children6.getField('parentValue')) === null || _lovDefineDs$children7 === void 0 ? void 0 : _lovDefineDs$children7.set('lookupCode', undefined);
      const _ref = window.dvaApp._store.getState().global || {},
        language = _ref.language;
      const options = toJS((currentItem === null || currentItem === void 0 ? void 0 : (_currentItem$get = currentItem.get) === null || _currentItem$get === void 0 ? void 0 : (_currentItem$get$call = _currentItem$get.call(currentItem, 'attributeJson')) === null || _currentItem$get$call === void 0 ? void 0 : _currentItem$get$call.customOptionList) || []);
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
      (_lovDefineDs$children8 = lovDefineDs.children.lovValues) === null || _lovDefineDs$children8 === void 0 ? void 0 : (_lovDefineDs$children9 = _lovDefineDs$children8.getField('parentValue')) === null || _lovDefineDs$children9 === void 0 ? void 0 : _lovDefineDs$children9.set('options', listDs);
    }
  };
  modal === null || modal === void 0 ? void 0 : modal.handleOk(async () => {
    var _lovDefineDs$current2, _lovDefineDs$getField4, _lovDefineDs$getField5, _lovDefineDs$getField6, _lovDefineDs$current4, _lovDefineDs$current5;
    const curParentOptionField = lovDefineDs === null || lovDefineDs === void 0 ? void 0 : (_lovDefineDs$current2 = lovDefineDs.current) === null || _lovDefineDs$current2 === void 0 ? void 0 : _lovDefineDs$current2.get('parentOptionField');
    const fieldDs = lovDefineDs === null || lovDefineDs === void 0 ? void 0 : (_lovDefineDs$getField4 = lovDefineDs.getField) === null || _lovDefineDs$getField4 === void 0 ? void 0 : (_lovDefineDs$getField5 = _lovDefineDs$getField4.call(lovDefineDs, 'parentOptionField')) === null || _lovDefineDs$getField5 === void 0 ? void 0 : (_lovDefineDs$getField6 = _lovDefineDs$getField5.getOptions) === null || _lovDefineDs$getField6 === void 0 ? void 0 : _lovDefineDs$getField6.call(_lovDefineDs$getField5, lovDefineDs === null || lovDefineDs === void 0 ? void 0 : lovDefineDs.current);
    const currentItem = fieldDs === null || fieldDs === void 0 ? void 0 : fieldDs.find(v => {
      var _lovDefineDs$current3;
      return (v === null || v === void 0 ? void 0 : v.get('businessObjectFieldCode')) === (lovDefineDs === null || lovDefineDs === void 0 ? void 0 : (_lovDefineDs$current3 = lovDefineDs.current) === null || _lovDefineDs$current3 === void 0 ? void 0 : _lovDefineDs$current3.get('parentOptionField'));
    });
    const lovCode = currentItem === null || currentItem === void 0 ? void 0 : currentItem.get('lovCode');
    if (!lovCode && lovDefineDs !== null && lovDefineDs !== void 0 && (_lovDefineDs$current4 = lovDefineDs.current) !== null && _lovDefineDs$current4 !== void 0 && _lovDefineDs$current4.get('parentOptionField')) {
      notification.error({
        message: intl.get('hmde.common.saveError').d('保存失败'),
        description: `上级选项字段【${currentItem === null || currentItem === void 0 ? void 0 : currentItem.get('businessObjectFieldName')}（${currentItem === null || currentItem === void 0 ? void 0 : currentItem.get('businessObjectFieldCode')}）】没有生成独立值集，当前字段不允许生成独立值集`,
        placement: 'bottomRight'
      });
      return false;
    }
    lovDefineDs === null || lovDefineDs === void 0 ? void 0 : (_lovDefineDs$current5 = lovDefineDs.current) === null || _lovDefineDs$current5 === void 0 ? void 0 : _lovDefineDs$current5.set('parentLovCode', lovCode);
    const res = await lovDefineDs.submit();
    if (onResponse) {
      return onResponse(res);
    } else if (res && !(res !== null && res !== void 0 && res.failed)) {
      var _selectDs$children, _selectDs$children$cu, _selectDs$current, _res$content, _selectDs$current2, _selectDs$current3, _selectDs$children2, _selectDs$children2$c;
      const customData = ((_selectDs$children = selectDs.children) === null || _selectDs$children === void 0 ? void 0 : (_selectDs$children$cu = _selectDs$children.customOptionList) === null || _selectDs$children$cu === void 0 ? void 0 : _selectDs$children$cu.toData()) || [];
      (_selectDs$current = selectDs.current) === null || _selectDs$current === void 0 ? void 0 : _selectDs$current.set('valueList', res === null || res === void 0 ? void 0 : (_res$content = res.content) === null || _res$content === void 0 ? void 0 : _res$content[0]);
      (_selectDs$current2 = selectDs.current) === null || _selectDs$current2 === void 0 ? void 0 : _selectDs$current2.set('optionSettings', '_valueList');
      (_selectDs$current3 = selectDs.current) === null || _selectDs$current3 === void 0 ? void 0 : _selectDs$current3.set('parentOptionField', curParentOptionField);
      (_selectDs$children2 = selectDs.children) === null || _selectDs$children2 === void 0 ? void 0 : (_selectDs$children2$c = _selectDs$children2.customOptionList) === null || _selectDs$children2$c === void 0 ? void 0 : _selectDs$children2$c.removeAll();
      handleDefaultValueFocus({
        customData
      });
    } else {
      return false;
    }
  });
  const handleUperiorSelectFilter = record => {
    var _selectDs$current4;
    const isF = (selectDs === null || selectDs === void 0 ? void 0 : (_selectDs$current4 = selectDs.current) === null || _selectDs$current4 === void 0 ? void 0 : _selectDs$current4.get('businessObjectFieldCode')) !== (record === null || record === void 0 ? void 0 : record.get('businessObjectFieldCode'));
    return isF;
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_Form, {
    dataSet: lovDefineDs,
    columns: 1
    // useColon={false} labelAlign={LabelAlign.center}
  }, /*#__PURE__*/React.createElement(_IntlField, {
    name: "lovName"
  }), /*#__PURE__*/React.createElement(_TextField, {
    name: "lovCode",
    maxLength: 60,
    showLengthInfo: true,
    clearButton: true
  }), !isFromDomain && /*#__PURE__*/React.createElement(_Select, {
    name: "parentOptionField",
    optionsFilter: record => handleUperiorSelectFilter(record)
  })), /*#__PURE__*/React.createElement(LovValuesList, _extends({}, valuesListProps, {
    valueListDs: lovDefineDs.children.lovValues,
    operateHeaderFlag: true,
    parentOptionField: lovDefineDs === null || lovDefineDs === void 0 ? void 0 : (_lovDefineDs$current6 = lovDefineDs.current) === null || _lovDefineDs$current6 === void 0 ? void 0 : _lovDefineDs$current6.get('parentOptionField')
  })));
};
export default formatterCollections({
  code: ['hmde.bo', 'hmde.common']
})(observer(Index));