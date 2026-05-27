import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _Output from "@hzero-front-ui/c7n-ui/lib/OutputPro";
import _DateTimePicker from "@hzero-front-ui/c7n-ui/lib/DateTimePickerPro";
import _DatePicker from "@hzero-front-ui/c7n-ui/lib/DatePickerPro";
import _NumberField from "@hzero-front-ui/c7n-ui/lib/NumberFieldPro";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _Select from "@hzero-front-ui/c7n-ui/lib/SelectPro";
const _excluded = ["__dirty"];
import React, { useMemo, useState, useContext, useEffect, useRef } from 'react';
import { getCurrentLanguage } from 'utils/utils';
import intl from 'utils/intl';
import { FieldIgnore, FieldType } from 'choerodon-ui/pro/lib/data-set/enum';
import { LabelLayout } from 'choerodon-ui/pro/lib/form/enum';
import DrillComponent, { EDrillMainKeyType } from 'hzero-front-apaas/lib/components/DrillComponent';
import ImgIcon from "hzero-front-hmde/lib/utils/ImgIcon";
import Store from "../stores/EventFlowStore";
import styles from "../index.less?modules";
const Option = _Select.Option;
const DataVarItem = props => {
  const nodeCode = props.nodeCode,
    record = props.record,
    deleteVar = props.deleteVar,
    editStatus = props.editStatus;
  const _useContext = useContext(Store),
    businessObjectCode = _useContext.businessObjectCode,
    eventFlowStore = _useContext.eventFlowStore,
    flowVarDS = _useContext.flowVarDS;
  const previousDS = eventFlowStore.previousDS,
    setEditFn = eventFlowStore.setEditFn,
    activeCard = eventFlowStore.activeCard;
  const index = props.index;
  const _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    showState = _useState2[0],
    setShowState = _useState2[1];
  const eleId = `dataVarItem${index}`;
  const eleIdRef = useRef(eleId);
  useEffect(() => {
    eleIdRef.current = eleId;
  }, [eleId]);
  const _useState3 = useState(() => {
      if (editStatus === eleId) {
        return true;
      } else {
        return false;
      }
    }),
    _useState4 = _slicedToArray(_useState3, 2),
    edit = _useState4[0],
    setEdit = _useState4[1];
  const _useState5 = useState(record === null || record === void 0 ? void 0 : record.dataVarSource),
    _useState6 = _slicedToArray(_useState5, 2),
    dataVarSource = _useState6[0],
    setDataVarSource = _useState6[1];
  const fieldName = useRef('');
  const onMouseEnter = () => {
    setShowState(true);
  };
  const onMouseLeave = () => {
    setShowState(false);
  };
  const fn1 = e => {
    e._customFlag = eleIdRef.current;
  };
  const ds = useMemo(() => {
    return new _DataSet({
      autoCreate: true,
      fields: [{
        name: 'key',
        type: "string"
      }, {
        name: 'dataVarName',
        type: "string",
        label: intl.get('hmde.bo.model.variablename').d('变量名'),
        required: true
      }, {
        name: 'componentType',
        type: "string"
      }, {
        name: 'dataVarSource',
        type: "string",
        label: intl.get('hmde.bo.model.variableValueSource').d('变量值来源'),
        required: true
      }, {
        name: 'dataVarValue',
        type: "auto",
        label: intl.get('hmde.bo.businessObject.variableValue').d('变量值'),
        computedProps: {
          required: ({
            record: _record
          }) => _record.get('dataVarSource') !== 'IS_NULL',
          lookupCode: ({
            record: _record
          }) => {
            if (_record.get('lovCode') && _record.get('dataVarSource') === 'FIXED_VALUE') {
              return _record.get('lovCode');
            }
          },
          options: ({
            record: _record
          }) => {
            if (_record.get('dataVarSource') === 'FIXED_VALUE') {
              if (_record.get('customOptionList')) {
                var _ref;
                return new _DataSet({
                  data: (_ref = (_record === null || _record === void 0 ? void 0 : _record.get('customOptionList')) || []) === null || _ref === void 0 ? void 0 : _ref.map(item => {
                    var _item$meaning;
                    return {
                      meaning: item === null || item === void 0 ? void 0 : (_item$meaning = item.meaning) === null || _item$meaning === void 0 ? void 0 : _item$meaning[getCurrentLanguage()],
                      value: item === null || item === void 0 ? void 0 : item.value,
                      order: item === null || item === void 0 ? void 0 : item.order
                    };
                  })
                });
              }
              if (_record.get('componentType') === 'SWITCH') {
                return new _DataSet({
                  data: [{
                    meaning: intl.get('hmde.common.button.open').d('开启'),
                    value: 1
                  }, {
                    meaning: intl.get('hmde.common.button.close').d('关闭'),
                    value: 0
                  }]
                });
              }
            } else if (_record.get('dataVarSource') === 'FLOW_VAR') {
              return new _DataSet({
                data: flowVarDS.toData().map(item => ({
                  value: item.flowVarKey,
                  meaning: item.flowVarKey
                }))
              });
            }
          },
          // multiple: ({ record: _record }) => {
          //   const componentType = _record.get('componentType');
          //   return ['CHECKBOX', 'MULTIPLE_SELECT'].includes(componentType);
          // },
          format: ({
            record: _record
          }) => {
            const componentType = _record.get('componentType');
            if (dataVarSource === 'FIXED_VALUE') {
              if (componentType === 'DATE_SELECTION_BOX') {
                return 'YYYY-MM-DD';
              } else if (componentType === 'DATETIME_SELECTION_BOX') {
                return 'YYYY-MM-DD HH:mm:ss';
              }
            }
          }
        }
      }, {
        name: 'attributeJson',
        type: "object",
        ignore: "always"
      }, {
        name: 'optionSettings',
        type: "string",
        bind: 'attributeJson.optionSettings',
        ignore: "always"
      }, {
        name: 'lovCode',
        type: "string",
        ignore: "always"
      }, {
        name: 'customOptionList',
        type: "object",
        bind: 'attributeJson.customOptionList',
        ignore: "always"
      }],
      events: {
        load: ({
          dataSet
        }) => {
          if (nodeCode) {
            const nodeDataVars = eventFlowStore.getNodeDataVars(nodeCode) || [];
            nodeDataVars[index] = dataSet.current.toData();
            eventFlowStore.setNodeDataVars(nodeCode, nodeDataVars);
          }
        },
        update: ({
          record: _record,
          name,
          value
        }) => {
          if (name === 'dataVarSource') {
            setDataVarSource(value);
          }
          if (name !== 'dataVarValue') {
            _record.set('dataVarValue', undefined);
          }
          if (nodeCode) {
            const nodeDataVars = eventFlowStore.getNodeDataVars(nodeCode) || [];
            const _ref2 = _record.toData() || {},
              __dirty = _ref2.__dirty,
              recordData = _objectWithoutProperties(_ref2, _excluded);
            nodeDataVars[index] = recordData;
            eventFlowStore.setNodeDataVars(nodeCode, nodeDataVars);
          }
        }
      }
    });
  }, []);

  // 组件初始化，组件绑定点击事件
  useEffect(() => {
    var _document, _document$getElementB;
    // eslint-disable-next-line
    (_document = document) === null || _document === void 0 ? void 0 : (_document$getElementB = _document.getElementById(eleId)) === null || _document$getElementB === void 0 ? void 0 : _document$getElementB.addEventListener('click', fn1);
    return () => {
      var _document2, _document2$getElement;
      // eslint-disable-next-line
      (_document2 = document) === null || _document2 === void 0 ? void 0 : (_document2$getElement = _document2.getElementById(eleId)) === null || _document2$getElement === void 0 ? void 0 : _document2$getElement.removeEventListener('click', fn1);
    };
  }, []);

  // 组件初始化，ds加载数据
  useEffect(() => {
    Object.keys(record).forEach(key => {
      if (ds.current) {
        ds.current.set(key, record[key]);
      }
    });
  }, []);
  const handleOk = params => {
    const value = params.value,
      result = params.result;
    if (ds.current) {
      ds.current.set(fieldName.current, value);
      if (fieldName.current === 'dataVarName') {
        ds.current.set('componentType', result === null || result === void 0 ? void 0 : result.componentType);
        if (['RADIO', 'SINGLE_SELECT', 'CHECKBOX', 'MULTIPLE_SELECT'].includes(result === null || result === void 0 ? void 0 : result.componentType)) {
          ds.current.set('attributeJson', result === null || result === void 0 ? void 0 : result.attributeJson);
          ds.current.set('lovCode', result === null || result === void 0 ? void 0 : result.lovCode);
        } else {
          ds.current.set('attributeJson', undefined);
          ds.current.set('lovCode', undefined);
        }
      }
    }
  };
  const drillRenderer = (_fieldName, readOnly = false) => {
    var _ds$current2;
    fieldName.current = _fieldName;
    return /*#__PURE__*/React.createElement(DrillComponent, {
      onOk: handleOk,
      onClear: () => {
        var _ds$current;
        return ds === null || ds === void 0 ? void 0 : (_ds$current = ds.current) === null || _ds$current === void 0 ? void 0 : _ds$current.set(_fieldName, '');
      },
      name: _fieldName,
      initValue: ds === null || ds === void 0 ? void 0 : (_ds$current2 = ds.current) === null || _ds$current2 === void 0 ? void 0 : _ds$current2.get(_fieldName),
      businessObjectCode: businessObjectCode,
      drillMainKeyType: EDrillMainKeyType.ALL,
      readOnly: readOnly
    });
  };
  const fixedValueRenderer = () => {
    const name = 'dataVarValue';
    // const componentType = ds.current?.get('componentType');
    const ele = /*#__PURE__*/React.createElement(_TextField, {
      name: name
    });
    const fixedValueMap = [{
      componentType: ['NUMBER_FIELD', 'FLOAT', 'PERCENTAGE', 'MONEY'],
      // 整数、浮点、百分数、金额
      renderer: () => /*#__PURE__*/React.createElement(_NumberField, {
        name: name
      })
    }, {
      componentType: ['TEXT_FIELD',
      // 文本
      'TEXT_AREA',
      // 长文本
      'RICH_TEXT',
      // 富文本
      'LOCATION',
      // 地图
      'PHONE_NUMBER',
      // 手机号码
      'EMAIL',
      // 电子邮箱
      'CODE_RULE',
      // 编码规则
      'FORMULA',
      // 公式
      'APPENDIX',
      // 附件
      'REFERENCE_FIELD',
      // 引用
      'MASTER_RELATION',
      // 从主
      'LINK_RELATION' //  关联
      ],
      renderer: () => ele
    }, {
      componentType: ['SWITCH', 'RADIO', 'SINGLE_SELECT', 'CHECKBOX', 'MULTIPLE_SELECT'],
      // 下拉单选、下拉多选、单选、复选
      renderer: () => /*#__PURE__*/React.createElement(_Select, {
        name: name
      })
    }, {
      componentType: ['DATE_SELECTION_BOX'],
      // 日期
      renderer: () => {
        var _ds$current3;
        return /*#__PURE__*/React.createElement(_DatePicker, {
          value: ds === null || ds === void 0 ? void 0 : (_ds$current3 = ds.current) === null || _ds$current3 === void 0 ? void 0 : _ds$current3.get(name),
          onChange: val => {
            var _ds$current4, _val$format;
            return ds === null || ds === void 0 ? void 0 : (_ds$current4 = ds.current) === null || _ds$current4 === void 0 ? void 0 : _ds$current4.set(name, val === null || val === void 0 ? void 0 : (_val$format = val.format) === null || _val$format === void 0 ? void 0 : _val$format.call(val, 'YYYY-MM-DD'));
          }
        });
      }
    }, {
      componentType: ['DATETIME_SELECTION_BOX'],
      // 日期时间
      renderer: () => {
        var _ds$current5;
        return /*#__PURE__*/React.createElement(_DateTimePicker, {
          value: ds === null || ds === void 0 ? void 0 : (_ds$current5 = ds.current) === null || _ds$current5 === void 0 ? void 0 : _ds$current5.get(name),
          onChange: val => {
            var _ds$current6, _val$format2;
            return ds === null || ds === void 0 ? void 0 : (_ds$current6 = ds.current) === null || _ds$current6 === void 0 ? void 0 : _ds$current6.set(name, val === null || val === void 0 ? void 0 : (_val$format2 = val.format) === null || _val$format2 === void 0 ? void 0 : _val$format2.call(val, 'YYYY-MM-DD HH:mm:ss'));
          }
        });
      }
    }];
    for (const _ref3 of fixedValueMap) {
      var _ds$current7;
      const componentType = _ref3.componentType;
      const renderer = _ref3.renderer;
      if (componentType.includes((_ds$current7 = ds.current) === null || _ds$current7 === void 0 ? void 0 : _ds$current7.get('componentType'))) {
        return renderer();
      }
    }
    return ele;
  };
  const editFn = () => {
    setEdit(true);
  };

  // 如果此条记录被删除，则对应清空previousDS，setEditFn，activeCard
  useEffect(() => {
    return () => {
      previousDS.current = null;
      setEditFn.current = null;
      activeCard.current = null;
    };
  }, []);
  useEffect(() => {
    if (edit) {
      previousDS.current = ds;
      setEditFn.current = setEdit;
      activeCard.current = eleId;
    }
  }, [edit]);
  const getDataVarSourceText = value => {
    if (value === 'FIXED_VALUE') {
      return intl.get('hmde.common.fixedValue').d('固定值');
    }
    if (value === 'BO_FIELD') {
      return intl.get('hmde.common.busObjField').d('业务对象字段');
    }
    if (value === 'FLOW_VAR') {
      return intl.get('hmde.bo.flow.title.flowVar').d('流程变量');
    }
    if (value === 'IS_NULL') {
      return '空';
    }
    return '';
  };
  const displayArea = () => {
    var _ds$current8, _ds$current9, _ds$current10;
    return /*#__PURE__*/React.createElement("div", {
      className: showState ? styles['data-var-edit'] : '',
      onClick: () => editFn()
    }, showState && /*#__PURE__*/React.createElement("div", {
      "data-log": "delBtn",
      className: styles['del-btn']
    }, /*#__PURE__*/React.createElement(ImgIcon, {
      "data-log": "delBtn",
      className: styles['del-btn-icon'],
      name: "delete-B16@1x.svg",
      size: 20,
      onClick: () => deleteVar(index)
    })), /*#__PURE__*/React.createElement("div", {
      className: styles['first-line']
    }, /*#__PURE__*/React.createElement("span", null, ds !== null && ds !== void 0 && (_ds$current8 = ds.current) !== null && _ds$current8 !== void 0 && _ds$current8.get('dataVarName') ? drillRenderer('dataVarName', true) : '参数KEY(FIELD.amount)')), /*#__PURE__*/React.createElement("div", {
      className: styles['second-line']
    }, /*#__PURE__*/React.createElement("div", null, intl.get('hmde.bo.model.variableValueSource').d('变量值来源')), /*#__PURE__*/React.createElement("div", null, getDataVarSourceText(ds === null || ds === void 0 ? void 0 : (_ds$current9 = ds.current) === null || _ds$current9 === void 0 ? void 0 : _ds$current9.get('dataVarSource')))), /*#__PURE__*/React.createElement("div", {
      className: styles['third-line'],
      hidden: (ds === null || ds === void 0 ? void 0 : (_ds$current10 = ds.current) === null || _ds$current10 === void 0 ? void 0 : _ds$current10.get('dataVarSource')) === 'IS_NULL'
    }, /*#__PURE__*/React.createElement("div", null, intl.get('hmde.bo.businessObject.variableValue').d('变量值')), /*#__PURE__*/React.createElement("div", null, dataVarSource === 'BO_FIELD' ? drillRenderer('dataVarValue', true) : /*#__PURE__*/React.createElement(_Output, {
      dataSet: ds,
      name: "dataVarValue"
    }))));
  };
  const editArea = () => {
    return /*#__PURE__*/React.createElement("div", {
      className: showState ? styles['data-var-edit'] : ''
    }, showState && /*#__PURE__*/React.createElement("div", {
      className: styles['del-btn']
    }, /*#__PURE__*/React.createElement(ImgIcon, {
      className: styles['del-btn-icon'],
      name: "delete-B16@1x.svg",
      size: 20,
      onClick: () => deleteVar(index)
    })), /*#__PURE__*/React.createElement(_Form, {
      labelLayout: "placeholder"
      // useColon={false}
      ,
      dataSet: ds
    }, drillRenderer('dataVarName'), /*#__PURE__*/React.createElement(_Select, {
      name: "dataVarSource"
    }, /*#__PURE__*/React.createElement(Option, {
      value: "FIXED_VALUE"
    }, intl.get('hmde.common.fixedValue').d('固定值')), /*#__PURE__*/React.createElement(Option, {
      value: "BO_FIELD"
    }, intl.get('hmde.common.busObjField').d('业务对象字段')), /*#__PURE__*/React.createElement(Option, {
      value: "FLOW_VAR"
    }, intl.get('hmde.bo.flow.title.flowVar').d('流程变量')), /*#__PURE__*/React.createElement(Option, {
      value: "IS_NULL"
    }, intl.get('hmde.bo.flow.title.empty').d('空'))), dataVarSource === 'FIXED_VALUE' && fixedValueRenderer(), dataVarSource === 'BO_FIELD' && drillRenderer('dataVarValue'), dataVarSource === 'FLOW_VAR' && /*#__PURE__*/React.createElement(_Select, {
      name: "dataVarValue"
    }), !dataVarSource && /*#__PURE__*/React.createElement(_TextField, {
      name: "dataVarValue"
    })));
  };
  return /*#__PURE__*/React.createElement("div", {
    id: eleId,
    className: styles['data-var-item'],
    onMouseEnter: onMouseEnter,
    onMouseLeave: onMouseLeave
    // onClick={globalClick}
  }, edit ? editArea() : displayArea());
};
export default DataVarItem;