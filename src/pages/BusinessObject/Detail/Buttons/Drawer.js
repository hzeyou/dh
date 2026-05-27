import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _Spin from "@hzero-front-ui/c7n-ui/lib/SpinPro";
import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _TextArea from "@hzero-front-ui/c7n-ui/lib/TextAreaPro";
import _Switch from "@hzero-front-ui/c7n-ui/lib/SwitchPro";
import _Output from "@hzero-front-ui/c7n-ui/lib/OutputPro";
import _IntlField from "@hzero-front-ui/c7n-ui/lib/IntlFieldPro";
import _extends from "@babel/runtime/helpers/esm/extends";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _Select from "@hzero-front-ui/c7n-ui/lib/SelectPro";
import React, { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import intl from 'utils/intl';
import { EventFlowCategory } from "../EventFlow";
const OptGroup = _Select.OptGroup,
  Option = _Select.Option;
const Drawer = props => {
  const isEdit = props.isEdit,
    detailDS = props.detailDS;
  const _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    hidden = _useState2[0],
    setHidden = _useState2[1];
  const _useState3 = useState(''),
    _useState4 = _slicedToArray(_useState3, 2),
    eventFlowValue = _useState4[0],
    setEventFlowValue = _useState4[1];
  const _useState5 = useState([]),
    _useState6 = _slicedToArray(_useState5, 2),
    eventFlowList = _useState6[0],
    setEventFlowList = _useState6[1];

  /** 获取下拉事件流列表 */
  const getEventFlowList = () => {
    detailDS.getField('eventFlow').fetchLookup(true).then(res => setEventFlowList(res));
  };
  useEffect(() => {
    if (isEdit) {
      detailDS.query().then(res => {
        if (res.sourceType === 'DEFAULT') {
          setHidden(true);
        }
        setEventFlowValue(res.businessObjectFlowCode);
      });
    } else {
      detailDS.create({});
    }
  }, []);
  useEffect(() => {
    getEventFlowList();
  }, []);
  const handleChangeEventFlow = flowCode => {
    var _eventFlowList$find;
    const flowName = ((_eventFlowList$find = eventFlowList.find(item => item.flowCode === flowCode)) === null || _eventFlowList$find === void 0 ? void 0 : _eventFlowList$find.flowName) || '';
    setEventFlowValue(flowCode);
    detailDS.current.set('eventFlow', {
      flowCode,
      flowName
    });
  };
  const optionRenderer = record => {
    var _record$toData;
    const _ref = (record === null || record === void 0 ? void 0 : (_record$toData = record.toData) === null || _record$toData === void 0 ? void 0 : _record$toData.call(record)) || {},
      meaning = _ref.meaning,
      value = _ref.value;
    return `${meaning}(${value})`;
  };
  const CustomSelect = useCallback(selectProps => {
    return /*#__PURE__*/React.createElement(_Select, _extends({
      label: intl.get('hmde.bo.businessObject.tab.eventFlow').d('事件流程'),
      value: eventFlowValue,
      onChange: handleChangeEventFlow,
      optionRenderer: ({
        record
      }) => optionRenderer(record),
      onPopupHiddenChange: visible => {
        if (!visible) {
          getEventFlowList();
        }
      }
    }, selectProps), eventFlowList.reduce((total, item) => {
      switch (item.flowCategory) {
        case EventFlowCategory.STANDARD:
          total[0].options.push(item);
          break;
        case EventFlowCategory.PREDEFINE:
          total[1].options.push(item);
          break;
        default:
          break;
      }
      return total;
    }, [{
      groupName: intl.get('hmde.bo.businessObject.standard.standard').d('系统标准'),
      options: []
    }, {
      groupName: intl.get('hmde.bo.businessObject.standard.predefined').d('平台预置'),
      options: []
    }]).map(({
      groupName,
      options
    }) => /*#__PURE__*/React.createElement(OptGroup, {
      label: groupName
    }, options.map(({
      flowCode,
      flowName
    }) => /*#__PURE__*/React.createElement(Option, {
      value: flowCode
    }, flowName)))));
  }, [eventFlowList, hidden, eventFlowValue]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, isEdit && /*#__PURE__*/React.createElement(_Spin, {
    dataSet: detailDS
  }, /*#__PURE__*/React.createElement(_Form, {
    dataSet: detailDS
    // useColon={false}
  }, /*#__PURE__*/React.createElement(_IntlField, {
    name: "businessObjectButtonName"
  }), /*#__PURE__*/React.createElement(_Output, {
    name: "businessObjectButtonCode"
  }), /*#__PURE__*/React.createElement(_Output, {
    name: "businessObjectButtonType"
  }), /*#__PURE__*/React.createElement(_Switch, {
    name: "enabledFlag"
  }), /*#__PURE__*/React.createElement(_TextArea, {
    name: "remark"
  }), CustomSelect({
    hidden
  }))), !isEdit && /*#__PURE__*/React.createElement(_Form, {
    dataSet: detailDS,
    columns: 2
    // useColon={false}
    ,
    separateSpacing: {
      width: 30,
      height: 2
    }
  }, /*#__PURE__*/React.createElement(_IntlField, {
    name: "businessObjectButtonName"
  }), /*#__PURE__*/React.createElement(_TextField, {
    name: "businessObjectButtonCode"
  }), /*#__PURE__*/React.createElement(_Select, {
    name: "businessObjectButtonType"
  }), /*#__PURE__*/React.createElement(_Switch, {
    name: "enabledFlag"
  }), /*#__PURE__*/React.createElement(_TextArea, {
    name: "remark",
    colSpan: 2,
    rows: 1
  }), CustomSelect({})));
};
export default observer(Drawer);