import _Tooltip from "@hzero-front-ui/c7n-ui/lib/Tooltip";
import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
import _Switch from "@hzero-front-ui/c7n-ui/lib/SwitchPro";
import _Output from "@hzero-front-ui/c7n-ui/lib/OutputPro";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _DataSet from "choerodon-ui/pro/lib/data-set";
/*
 * @Descripttion: 值列表项——详情
 * @Date: 2021-08-10 22:49:20
 * @Author: ZHIJIAN.XU@HAND-CHINA.COM
 * @version: 0.0.1
 * @copyright: Copyright (c) 2021, Hand
 */
import React, { useEffect, useMemo, useState } from 'react';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import { FormLayout } from 'choerodon-ui/pro/lib/form/enum';
import moment from 'moment';
import { getResponse } from 'utils/utils';
import DrillComponent from 'hzero-front-apaas/lib/components/DrillComponent';
import { SourceType } from "hzero-front-apaas/lib/constants/businessObject";
import TrueOrFalseRender from "hzero-front-hmde/lib/businessComponents/TrueOrFalseRender";
import { formDs } from "hzero-front-hmde/lib/stores/BusinessObject/OptionListDS";
import ImgIcon from "hzero-front-hmde/lib/utils/ImgIcon";
import { getDisplayFields } from "hzero-front-hmde/lib/services/businessObjectService";
import styles from "../index.less?modules";
const Option = ({
  domainId,
  businessObjectId,
  businessObjectCode,
  optionId,
  sourceType,
  businessObjectTenantId
}) => {
  var _optionItemDs$current6, _optionItemDs$current7, _optionItemDs$current8, _optionItemDs$current9, _optionItemDs$current10, _optionItemDs$current11;
  const optionItemDs = useMemo(() => new _DataSet(formDs({
    domainId,
    boId: businessObjectId,
    businessObjectCode,
    optionId,
    businessObjectTenantId
  })), []);
  useEffect(() => {
    initDta();
  }, [optionId]);
  const initDta = () => {
    getDisplayFields({
      businessObjectCode
    }).then(res => {
      if (getResponse(res)) {
        optionItemDs.setState('displayFieldList', res);
      }
    });
    optionItemDs.query();
  };
  const _useMemo = useMemo(() => {
      var _ref, _optionItemDs$current, _optionItemDs$current2, _optionItemDs$current3, _ref2, _ref2$filter, _optionItemDs$current4, _optionItemDs$current5;
      return [(_ref = ((_optionItemDs$current = optionItemDs.current) === null || _optionItemDs$current === void 0 ? void 0 : (_optionItemDs$current2 = _optionItemDs$current.toData) === null || _optionItemDs$current2 === void 0 ? void 0 : (_optionItemDs$current3 = _optionItemDs$current2.call(_optionItemDs$current)) === null || _optionItemDs$current3 === void 0 ? void 0 : _optionItemDs$current3.businessObjectOptionFieldList) || []) === null || _ref === void 0 ? void 0 : _ref.sort((a, b) => (a === null || a === void 0 ? void 0 : a.orderSeq) - (b === null || b === void 0 ? void 0 : b.orderSeq)), (_ref2 = ((_optionItemDs$current4 = optionItemDs.current) === null || _optionItemDs$current4 === void 0 ? void 0 : (_optionItemDs$current5 = _optionItemDs$current4.toData) === null || _optionItemDs$current5 === void 0 ? void 0 : _optionItemDs$current5.call(_optionItemDs$current4).businessObjectOptionFieldList) || []) === null || _ref2 === void 0 ? void 0 : (_ref2$filter = _ref2.filter(({
        queryFieldFlag
      }) => queryFieldFlag)) === null || _ref2$filter === void 0 ? void 0 : _ref2$filter.sort((a, b) => (a === null || a === void 0 ? void 0 : a.queryOrderSeq) - (b === null || b === void 0 ? void 0 : b.queryOrderSeq))];
    }, [(_optionItemDs$current6 = optionItemDs.current) === null || _optionItemDs$current6 === void 0 ? void 0 : _optionItemDs$current6.toData()]),
    _useMemo2 = _slicedToArray(_useMemo, 2),
    fieldsData = _useMemo2[0],
    queryFieldsData = _useMemo2[1];
  const valueTypeHidden = operatorType => {
    return ['IS_NULL', 'IS_NOT_NULL', 'IS_TRUE', 'IS_FALSE'].includes(operatorType);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_Form, {
    dataSet: optionItemDs,
    columns: 2
    // useColon={false}  labelAlign={LabelAlign.left}
  }, /*#__PURE__*/React.createElement(_Output, {
    name: "businessObjectOptionName"
  }), /*#__PURE__*/React.createElement(_Output, {
    name: "businessObjectOptionCode"
  }), /*#__PURE__*/React.createElement(_Output, {
    name: "displayFieldCode"
  }), /*#__PURE__*/React.createElement(_Output, {
    name: "title"
  }), /*#__PURE__*/React.createElement(_Output, {
    name: "pageSize"
  }), sourceType === SourceType.PREDEFINE ? /*#__PURE__*/React.createElement(_Output, {
    name: "enabledFlag",
    renderer: ({
      record
    }) => /*#__PURE__*/React.createElement(TrueOrFalseRender, {
      trueOrFalse: record === null || record === void 0 ? void 0 : record.get('enabledFlag')
    })
  }) : /*#__PURE__*/React.createElement(_Switch, {
    name: "enabledFlag",
    readOnly: true
  }), /*#__PURE__*/React.createElement(_Output, {
    label: intl.get('hmde.bo.businessObject.viewField').d('视图字段'),
    required: true,
    newLine: true,
    renderer: () => /*#__PURE__*/React.createElement(_Button, {
      style: {
        borderStyle: 'dashed',
        display: 'flex',
        alignItems: 'center',
        cursor: 'auto'
      },
      disabled: true
    }, /*#__PURE__*/React.createElement(ImgIcon, {
      name: "settings.svg",
      size: 14,
      style: {
        marginRight: 8
      }
    }), /*#__PURE__*/React.createElement("span", null, intl.get('hmde.bo.businessObject.configField').d('配置字段')))
  })), !!fieldsData.length && /*#__PURE__*/React.createElement("div", {
    className: styles['config-detail']
  }, !!queryFieldsData.length && /*#__PURE__*/React.createElement("div", {
    className: styles['option-query-fields']
  }, queryFieldsData.map(({
    displayName,
    businessObjectFieldName
  }) => {
    var _businessObjectFieldN;
    return /*#__PURE__*/React.createElement("span", {
      className: styles['option-field']
    }, displayName || (businessObjectFieldName === null || businessObjectFieldName === void 0 ? void 0 : businessObjectFieldName.slice((businessObjectFieldName === null || businessObjectFieldName === void 0 ? void 0 : (_businessObjectFieldN = businessObjectFieldName.lastIndexOf) === null || _businessObjectFieldN === void 0 ? void 0 : _businessObjectFieldN.call(businessObjectFieldName, '.')) + 1)));
  })), /*#__PURE__*/React.createElement("div", {
    className: styles['option-columns']
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['option-columns-fields']
  }, fieldsData.map(({
    displayName,
    businessObjectFieldName
  }) => {
    var _businessObjectFieldN2;
    return /*#__PURE__*/React.createElement("span", {
      className: styles['option-field']
    }, displayName || (businessObjectFieldName === null || businessObjectFieldName === void 0 ? void 0 : businessObjectFieldName.slice((businessObjectFieldName === null || businessObjectFieldName === void 0 ? void 0 : (_businessObjectFieldN2 = businessObjectFieldName.lastIndexOf) === null || _businessObjectFieldN2 === void 0 ? void 0 : _businessObjectFieldN2.call(businessObjectFieldName, '.')) + 1)));
  })))), /*#__PURE__*/React.createElement(_Form, {
    dataSet: optionItemDs,
    columns: 2
    // useColon={false} labelAlign={LabelAlign.left}
  }, /*#__PURE__*/React.createElement(_Output, {
    name: "remark",
    colSpan: 2
  }), /*#__PURE__*/React.createElement(_Output, {
    name: "businessObjectOptionCondList",
    renderer: () => /*#__PURE__*/React.createElement(_Button, {
      style: {
        borderStyle: 'dashed',
        display: 'flex',
        alignItems: 'center',
        cursor: 'auto'
      },
      disabled: true
    }, /*#__PURE__*/React.createElement(ImgIcon, {
      name: "create-new.svg",
      size: 14,
      style: {
        marginRight: 8
      }
    }), /*#__PURE__*/React.createElement("span", null, intl.get('hmde.common.addCondition').d('添加条件')))
  })), !!((_optionItemDs$current7 = optionItemDs.current) !== null && _optionItemDs$current7 !== void 0 && (_optionItemDs$current8 = _optionItemDs$current7.getCascadeRecords('businessObjectOptionCondList')) !== null && _optionItemDs$current8 !== void 0 && _optionItemDs$current8.length) && /*#__PURE__*/React.createElement("div", {
    className: styles['config-detail']
  }, (_optionItemDs$current9 = optionItemDs.current) === null || _optionItemDs$current9 === void 0 ? void 0 : (_optionItemDs$current10 = _optionItemDs$current9.getCascadeRecords('businessObjectOptionCondList')) === null || _optionItemDs$current10 === void 0 ? void 0 : (_optionItemDs$current11 = _optionItemDs$current10.sort((a, b) => (a === null || a === void 0 ? void 0 : a.get('orderSeq')) - (b === null || b === void 0 ? void 0 : b.get('orderSeq')))) === null || _optionItemDs$current11 === void 0 ? void 0 : _optionItemDs$current11.map((record, index) => {
    var _toJS, _toJS2;
    return /*#__PURE__*/React.createElement(_Form, {
      record: record,
      className: styles['option-condition']
      // useColon={false}
      ,
      layout: "none"
    }, /*#__PURE__*/React.createElement("span", null, index + 1), /*#__PURE__*/React.createElement(FieldPath, null, /*#__PURE__*/React.createElement(DrillComponent, {
      businessObjectCode: businessObjectCode,
      initValue: (record === null || record === void 0 ? void 0 : record.get('fieldPath')) || '',
      name: "fieldPath",
      readOnly: true
    })), /*#__PURE__*/React.createElement("span", {
      className: styles['condition-line']
    }), /*#__PURE__*/React.createElement(_Output, {
      name: "operatorType"
    }), /*#__PURE__*/React.createElement("span", {
      className: styles['condition-line'],
      hidden: valueTypeHidden(record === null || record === void 0 ? void 0 : record.get('operatorType'))
    }), /*#__PURE__*/React.createElement(_Output, {
      name: "valueType",
      hidden: valueTypeHidden(record === null || record === void 0 ? void 0 : record.get('operatorType'))
    }), /*#__PURE__*/React.createElement("span", {
      className: styles['condition-line'],
      hidden: valueTypeHidden(record === null || record === void 0 ? void 0 : record.get('operatorType'))
    }), (record === null || record === void 0 ? void 0 : record.get('valueType')) === 'FIELD' ? /*#__PURE__*/React.createElement(FieldPath, null, /*#__PURE__*/React.createElement(DrillComponent, {
      businessObjectCode: businessObjectCode,
      initValue: (record === null || record === void 0 ? void 0 : record.get('value')) || '',
      name: "value",
      readOnly: true
    })) : /*#__PURE__*/React.createElement(_Output, {
      name: "value",
      multiple: Array.isArray(toJS(record === null || record === void 0 ? void 0 : record.get('value'))) && !((_toJS = toJS(record === null || record === void 0 ? void 0 : record.get('value'))) !== null && _toJS !== void 0 && _toJS.every(item => moment.isMoment(item))),
      range: Array.isArray(toJS(record === null || record === void 0 ? void 0 : record.get('value'))) && ((_toJS2 = toJS(record === null || record === void 0 ? void 0 : record.get('value'))) === null || _toJS2 === void 0 ? void 0 : _toJS2.every(item => moment.isMoment(item))),
      hidden: valueTypeHidden(record === null || record === void 0 ? void 0 : record.get('operatorType'))
    }));
  })), /*#__PURE__*/React.createElement(_Form, {
    dataSet: optionItemDs,
    columns: 2
    // useColon={false} labelAlign={LabelAlign.left}
  }, /*#__PURE__*/React.createElement(_Output, {
    name: "logicFormula"
  })));
};
const FieldPath = ({
  children
}) => {
  const _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    visible = _useState2[0],
    setVisible = _useState2[1];
  return /*#__PURE__*/React.createElement(_Tooltip, {
    visible: visible,
    title: children,
    arrowPointAtCenter: true
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap'
    },
    onMouseEnter: e => {
      if (e.target.scrollWidth > e.target.offsetWidth) {
        setVisible(true);
      }
    },
    onMouseLeave: () => setVisible(false)
  }, children));
};
export default formatterCollections({
  code: ['hmde.bo', 'hmde.common']
})(observer(Option));