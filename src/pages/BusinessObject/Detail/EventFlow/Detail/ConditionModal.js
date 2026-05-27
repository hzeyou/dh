import _Divider from "@hzero-front-ui/c7n-ui/lib/Divider";
import _message from "@hzero-front-ui/c7n-ui/lib/Message";
import _Tooltip from "@hzero-front-ui/c7n-ui/lib/TooltipPro";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _NumberField from "@hzero-front-ui/c7n-ui/lib/NumberFieldPro";
import _DateTimePicker from "@hzero-front-ui/c7n-ui/lib/DateTimePickerPro";
import _DatePicker from "@hzero-front-ui/c7n-ui/lib/DatePickerPro";
import _Output from "@hzero-front-ui/c7n-ui/lib/OutputPro";
import _Select from "@hzero-front-ui/c7n-ui/lib/SelectPro";
import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _SelectBox from "@hzero-front-ui/c7n-ui/lib/SelectBoxPro";
import _Icon from "choerodon-ui/lib/icon";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _Tree from "@hzero-front-ui/c7n-ui/lib/Tree";
import _isEmpty from "lodash/isEmpty";
import React, { useEffect, useRef, useState, useContext } from 'react';
import { getResponse } from 'utils/utils';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import { css } from 'styled-components';
import { ThemeContext, getThemeData } from '@hzero-front-ui/core';
import { GlobalStyle } from '@hzero-front-ui/core/lib/components';
import { observer } from 'mobx-react-lite';
import { ButtonColor, FuncType } from 'choerodon-ui/pro/lib/button/enum';
import DrillComponent, { EDrillMainKeyType } from 'hzero-front-apaas/lib/components/DrillComponent';
import MonacoEditor, { monaco } from "hzero-front-apaas/lib/components/MonacoEditor";
import Popconfirm from "hzero-front-hmde/lib/businessComponents/Popconfirm";
import ImgIcon from "hzero-front-hmde/lib/utils/ImgIcon";
import { ConditionMode } from "hzero-front-apaas/lib/constants/businessObject";
import { BlockReg, DrillFormulaReg } from "hzero-front-apaas/lib/constants/businessObject";
import { dataMapTransfer2, formula2Desc } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/FieldsList/FieldComponents/formula/utils";
import { getNewDrillInfo } from "hzero-front-hmde/lib/services/businessObjectService";
import { arithmetic, fun, funDescMap, classifyComponentType } from "../stores/constants";
import FlowModalLayout from "../components/FlowModalLayout";
import styles from "../index.less?modules";
const DirectoryTree = _Tree.DirectoryTree,
  TreeNode = _Tree.TreeNode;
const getParentKey = (key, tree) => {
  const parentKey = [];
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.meaning.includes(key) || node.children.some(item => item.meaning.includes(key))) {
        parentKey.push(node.value);
      } else if (getParentKey(key, node.children)) {
        parentKey.concat(getParentKey(key, node.children));
      }
    }
  }
  return parentKey;
};
const formulaMappingList = []; // 用于做meaning和value的映射
let provider = {
  dispose: () => {}
};
const Index = ({
  dataSet,
  businessObjectCode,
  enabledDrillFlag,
  businessObjectFieldList,
  modal
}) => {
  var _dataSet$current3, _dataSet$current3$get, _arithmetic$, _fun$, _dataSet$current8, _dataSet$current9, _dataSet$current10, _dataSet$current10$ge, _dataSet$current10$ge2, _dataSet$current12;
  const _useState = useState(() => 'sql'),
    _useState2 = _slicedToArray(_useState, 1),
    language = _useState2[0];
  const _useState3 = useState(),
    _useState4 = _slicedToArray(_useState3, 2),
    code = _useState4[0],
    setCode = _useState4[1];
  useEffect(() => {
    if (enabledDrillFlag) {
      var _dataSet$toData, _dataSet$toData$call;
      const drillCodes = [].concat(...(dataSet === null || dataSet === void 0 ? void 0 : (_dataSet$toData = dataSet.toData) === null || _dataSet$toData === void 0 ? void 0 : (_dataSet$toData$call = _dataSet$toData.call(dataSet)) === null || _dataSet$toData$call === void 0 ? void 0 : _dataSet$toData$call.map(({
        conditionExpression
      }) => {
        var _conditionExpression$;
        return (conditionExpression === null || conditionExpression === void 0 ? void 0 : (_conditionExpression$ = conditionExpression.match) === null || _conditionExpression$ === void 0 ? void 0 : _conditionExpression$.call(conditionExpression, DrillFormulaReg)) || [];
      })));
      if (drillCodes.length > 0) {
        const fn = async () => {
          const res = await getNewDrillInfo({
            referenceFormula: drillCodes.join()
          });
          if (getResponse(res)) {
            if (!res.success) {
              notification.warning({
                message: res.message
              });
            }
            (res.analyzeResultList || []).filter(({
              success
            }) => success).forEach(item => {
              var _item$referenceInfoLi, _item$referenceInfoLi2, _item$referenceInfoLi3;
              formulaMappingList.push({
                value: item.formula,
                meaning: `CASCADE(${(_item$referenceInfoLi = item.referenceInfoList) === null || _item$referenceInfoLi === void 0 ? void 0 : (_item$referenceInfoLi2 = _item$referenceInfoLi.map(({
                  businessObjectName,
                  businessObjectFieldName
                }) => `${businessObjectName}.${businessObjectFieldName}`)) === null || _item$referenceInfoLi2 === void 0 ? void 0 : (_item$referenceInfoLi3 = _item$referenceInfoLi2.join) === null || _item$referenceInfoLi3 === void 0 ? void 0 : _item$referenceInfoLi3.call(_item$referenceInfoLi2)})`
              });
            });
          }
        };
        fn();
      }
    }
  }, []);
  const _useState5 = useState(''),
    _useState6 = _slicedToArray(_useState5, 2),
    searchFieldList = _useState6[0],
    setSearchFieldList = _useState6[1];
  useEffect(() => {
    var _dataSet$current, _dataSet$current$get;
    if (((_dataSet$current = dataSet.current) === null || _dataSet$current === void 0 ? void 0 : (_dataSet$current$get = _dataSet$current.get) === null || _dataSet$current$get === void 0 ? void 0 : _dataSet$current$get.call(_dataSet$current, 'conditionMode')) === ConditionMode.expression) {
      var _dataSet$current2, _dataSet$current2$get;
      const curCode = formula2Desc(((_dataSet$current2 = dataSet.current) === null || _dataSet$current2 === void 0 ? void 0 : (_dataSet$current2$get = _dataSet$current2.get) === null || _dataSet$current2$get === void 0 ? void 0 : _dataSet$current2$get.call(_dataSet$current2, 'conditionExpression')) || '', formulaMappingList.concat(businessObjectFieldList.map(({
        meaning,
        value
      }) => ({
        meaning: `#${meaning}#`,
        value
      }))).sort((a, b) => {
        var _b$value, _a$value;
        return (b === null || b === void 0 ? void 0 : (_b$value = b.value) === null || _b$value === void 0 ? void 0 : _b$value.length) - (a === null || a === void 0 ? void 0 : (_a$value = a.value) === null || _a$value === void 0 ? void 0 : _a$value.length);
      }));
      setCode(curCode);
      setTimeout(() => {
        var _editorIns$current, _editorIns$current$ge, _editorIns$current$ge2, _editorIns$current$ge3;
        // 第一次进来时，不覆盖原有的值，在原有的值之后添加
        const fullModelRange = (editorIns === null || editorIns === void 0 ? void 0 : (_editorIns$current = editorIns.current) === null || _editorIns$current === void 0 ? void 0 : (_editorIns$current$ge = _editorIns$current.getModel) === null || _editorIns$current$ge === void 0 ? void 0 : (_editorIns$current$ge2 = _editorIns$current$ge.call(_editorIns$current)) === null || _editorIns$current$ge2 === void 0 ? void 0 : (_editorIns$current$ge3 = _editorIns$current$ge2.getFullModelRange) === null || _editorIns$current$ge3 === void 0 ? void 0 : _editorIns$current$ge3.call(_editorIns$current$ge2)) || {};
        if (!_isEmpty(fullModelRange)) {
          editorIns.current.setPosition(fullModelRange.getEndPosition());
          setEditorVal(' ');
        }
      }, 500);
    }
  }, [dataSet.current, (_dataSet$current3 = dataSet.current) === null || _dataSet$current3 === void 0 ? void 0 : (_dataSet$current3$get = _dataSet$current3.get) === null || _dataSet$current3$get === void 0 ? void 0 : _dataSet$current3$get.call(_dataSet$current3, 'conditionMode')]);
  modal.handleOk(() => {
    // 校验除默认条件及简易模式条件
    const records = dataSet.filter(record => !(record !== null && record !== void 0 && record.get('defaultFlag') || (record === null || record === void 0 ? void 0 : record.get('conditionMode')) === ConditionMode.simple));
    const errorIndex = records.findIndex(record => {
      var _handleCheck;
      return !((_handleCheck = handleCheck(record === null || record === void 0 ? void 0 : record.get('conditionExpression'))) !== null && _handleCheck !== void 0 && _handleCheck[0]);
    });
    if (errorIndex > -1) {
      var _records$errorIndex, _handleCheck2, _records$errorIndex2;
      notification.error({
        message: `${records === null || records === void 0 ? void 0 : (_records$errorIndex = records[errorIndex]) === null || _records$errorIndex === void 0 ? void 0 : _records$errorIndex.get('conditionName')}${intl.get('hmde.common.message.validationerrorMsg').d('条件表达式校验失败')}`,
        description: ((_handleCheck2 = handleCheck(records === null || records === void 0 ? void 0 : (_records$errorIndex2 = records[errorIndex]) === null || _records$errorIndex2 === void 0 ? void 0 : _records$errorIndex2.get('conditionExpression'))) === null || _handleCheck2 === void 0 ? void 0 : _handleCheck2[1]) || ''
      });
    }
    return errorIndex === -1;
  });
  const monacoInstance = useRef();
  const editorIns = useRef();
  const options = {
    roundedSelection: false,
    readOnly: false,
    cursorStyle: 'line',
    fontSize: 12,
    lineHeight: 20,
    automaticLayout: true,
    selectOnLineNumbers: true,
    renderSideBySide: false,
    wordWrap: 'on',
    lineNumbers: 'off',
    find: {
      seedSearchStringFromSelection: true,
      autoFindInSelection: 'always'
    }
  };
  useEffect(() => () => {
    provider.dispose(); // 弹窗关闭后 销毁编辑器实例
  }, []);
  const Range = monaco.Range,
    Selection = monaco.Selection,
    KeyCode = monaco.KeyCode;
  const _useContext = useContext(ThemeContext),
    resolvedTheme = _useContext.resolvedTheme;
  const _getThemeData = getThemeData({
      data: resolvedTheme
    }, 'common'),
    primary = _getThemeData.primary,
    primary1 = _getThemeData.primary1,
    primary4 = _getThemeData.primary4,
    errorColor = _getThemeData.errorColor;
  const fieldStyle = {
    margin: '0 8px',
    padding: '1px 4px',
    lineHeight: 1.5,
    fontSize: 12,
    color: primary,
    background: primary1,
    border: `1px solid ${primary4}`,
    borderRadius: 2
  };
  useEffect(() => {
    var _primary$slice, _primary1$slice;
    // // Register a new language
    monaco.languages.register({
      id: language
    });

    // // Register a tokens provider for the language
    monaco.languages.setMonarchTokensProvider(language, {
      tokenizer: {
        root: [[/CASCADE\(.*?\)/, 'block'], [/#(.[^#]*)#(?=\s)/, 'block']]
      }
    });

    // Define a new theme that contains only rules that match this language
    monaco.editor.defineTheme('myCoolTheme', {
      base: 'vs',
      inherit: true,
      rules: [{
        token: 'block',
        foreground: primary === null || primary === void 0 ? void 0 : (_primary$slice = primary.slice) === null || _primary$slice === void 0 ? void 0 : _primary$slice.call(primary, 1),
        fontStyle: 'bold',
        background: primary1 === null || primary1 === void 0 ? void 0 : (_primary1$slice = primary1.slice) === null || _primary1$slice === void 0 ? void 0 : _primary1$slice.call(primary1, 1)
      }],
      colors: {
        // 相关颜色属性配置
        'editor.background': '#ffffff' // 背景色
      }
    });
    monaco.editor.setTheme('myCoolTheme');
  }, [editorIns.current, fieldStyle]);
  const setLogicFormula = (deleteFlag = false) => {
    if (dataSet.current) {
      var _dataSet$current4, _dataSet$current4$dat, _dataSet$current4$dat2, _dataSet$current4$dat3, _dataSet$current4$dat4, _dataSet$current$get2, _dataSet$current5, _dataSet$current$get3, _dataSet$current6;
      const conditionLines = (_dataSet$current4 = dataSet.current) === null || _dataSet$current4 === void 0 ? void 0 : (_dataSet$current4$dat = _dataSet$current4.dataSet) === null || _dataSet$current4$dat === void 0 ? void 0 : (_dataSet$current4$dat2 = _dataSet$current4$dat.children) === null || _dataSet$current4$dat2 === void 0 ? void 0 : (_dataSet$current4$dat3 = _dataSet$current4$dat2.conditionLines) === null || _dataSet$current4$dat3 === void 0 ? void 0 : (_dataSet$current4$dat4 = _dataSet$current4$dat3.toData) === null || _dataSet$current4$dat4 === void 0 ? void 0 : _dataSet$current4$dat4.call(_dataSet$current4$dat3);
      dataSet.current.set('conditionLineRelation', deleteFlag ? conditionLines === null || conditionLines === void 0 ? void 0 : conditionLines.map((_, i) => i + 1).join(' AND ') : `${(_dataSet$current$get2 = (_dataSet$current5 = dataSet.current).get) !== null && _dataSet$current$get2 !== void 0 && _dataSet$current$get2.call(_dataSet$current5, 'conditionLineRelation') ? `${(_dataSet$current$get3 = (_dataSet$current6 = dataSet.current).get) === null || _dataSet$current$get3 === void 0 ? void 0 : _dataSet$current$get3.call(_dataSet$current6, 'conditionLineRelation')} AND ` : ''}${conditionLines.length}`);
    }
  };
  const handleAddRecordCondition = () => {
    var _dataSet$current7, _dataSet$current7$dat, _dataSet$current7$dat2, _dataSet$current7$dat3, _dataSet$current7$dat4;
    // eslint-disable-next-line no-unused-expressions
    (_dataSet$current7 = dataSet.current) === null || _dataSet$current7 === void 0 ? void 0 : (_dataSet$current7$dat = _dataSet$current7.dataSet) === null || _dataSet$current7$dat === void 0 ? void 0 : (_dataSet$current7$dat2 = _dataSet$current7$dat.children) === null || _dataSet$current7$dat2 === void 0 ? void 0 : (_dataSet$current7$dat3 = _dataSet$current7$dat2.conditionLines) === null || _dataSet$current7$dat3 === void 0 ? void 0 : (_dataSet$current7$dat4 = _dataSet$current7$dat3.create) === null || _dataSet$current7$dat4 === void 0 ? void 0 : _dataSet$current7$dat4.call(_dataSet$current7$dat3, {});
    setLogicFormula(false);
  };
  const valueTypeHidden = operatorType => {
    return ['IS_NULL', 'IS_NOT_NULL', 'IS_TRUE', 'IS_FALSE'].includes(operatorType);
  };

  /**
   *
   * @param value 值
   * @param valType 类型
   * @param valueList 值列表
   */
  const setEditorVal = value => {
    // 排除 value 为 null 的值
    if (value === undefined || value === null) return;
    if (editorIns !== null && editorIns !== void 0 && editorIns.current && (value || value === '')) {
      var _editorIns$current2, _editorIns$current2$g;
      const selection = editorIns === null || editorIns === void 0 ? void 0 : (_editorIns$current2 = editorIns.current) === null || _editorIns$current2 === void 0 ? void 0 : (_editorIns$current2$g = _editorIns$current2.getSelection) === null || _editorIns$current2$g === void 0 ? void 0 : _editorIns$current2$g.call(_editorIns$current2);
      const range = new monaco.Range(selection === null || selection === void 0 ? void 0 : selection.startLineNumber, selection === null || selection === void 0 ? void 0 : selection.startColumn, selection === null || selection === void 0 ? void 0 : selection.endLineNumber, selection === null || selection === void 0 ? void 0 : selection.endColumn);
      const id = {
        major: 1,
        minor: 1
      };
      const op = {
        identifier: id,
        range,
        text: value || ' ',
        forceMoveMarkers: true
      };
      editorIns.current.executeEdits('', [op]);
      editorIns.current.focus();
    }
  };

  /**
   * 编辑器change回调 conditionExpression
   * @param {String} val 当前编辑器的值
   */
  const onChangeHandle = val => {
    setCode(val);
    const temp = dataMapTransfer2(val, formulaMappingList.concat(businessObjectFieldList.map(item => ({
      meaning: `#${item.meaning}#`,
      value: item.value
    }))), 'meaning', 'value');
    if (dataSet.current) dataSet.current.set('conditionExpression', temp);
  };
  const editorDidMountHandle = (editor, monacoIns) => {
    var _primary$slice2, _primary1$slice2;
    monacoInstance.current = monacoIns;
    editorIns.current = editor;
    const onEvent = (event, stopEventFlag = true) => {
      var _editorIns$current3, _editorIns$current3$g;
      const val = editorIns === null || editorIns === void 0 ? void 0 : (_editorIns$current3 = editorIns.current) === null || _editorIns$current3 === void 0 ? void 0 : (_editorIns$current3$g = _editorIns$current3.getValue) === null || _editorIns$current3$g === void 0 ? void 0 : _editorIns$current3$g.call(_editorIns$current3);
      const matchs = (val.match(DrillFormulaReg) || []).concat(val.match(BlockReg) || []);
      const matchIndex = {
        // match: index,
      };
      const lines = val.split('\n');
      const blockDatas = []; // 注意，这里的块的区域，'#field_标题#'，没算上引号的，但是选中要带上引号，
      lines.forEach((line, lineIndex) => {
        matchs.forEach(block => {
          let startIndex;
          if (matchIndex[block]) {
            startIndex = matchIndex[block];
          }
          const indexBlock = line.indexOf(block, startIndex);
          matchIndex[block] = indexBlock + block.length - 1;
          if (indexBlock > -1) {
            const lineNumber = lineIndex + 1;
            const startColumn = indexBlock + 2;
            blockDatas.push({
              endColumn: startColumn + block.length - 1,
              endLineNumber: lineNumber,
              startColumn,
              startLineNumber: lineNumber
            });
          }
        });
      });
      if (editorIns.current) {
        blockDatas.forEach(bData => {
          var _editorIns$current4, _editorIns$current4$g;
          const rData = [bData === null || bData === void 0 ? void 0 : bData.startLineNumber, bData === null || bData === void 0 ? void 0 : bData.startColumn, bData === null || bData === void 0 ? void 0 : bData.endLineNumber, (bData === null || bData === void 0 ? void 0 : bData.endColumn) + 1 // 加1是加上井号#后面的空格
          ];
          // 块的区域，'#field_标题#'，没算上引号的，但是选中要带上引号，所以startColumn - 1 且 data.endColumn + 1
          const selectData = [bData === null || bData === void 0 ? void 0 : bData.startLineNumber, (bData === null || bData === void 0 ? void 0 : bData.startColumn) - 1, bData === null || bData === void 0 ? void 0 : bData.endLineNumber, (bData === null || bData === void 0 ? void 0 : bData.endColumn) + 1 // 加1是加上井号#后面的空格
          ];
          // @ts-ignore
          const range = new Range(...rData);
          // @ts-ignore
          const selection = new Selection(...selectData);
          const currentPosition = editorIns === null || editorIns === void 0 ? void 0 : (_editorIns$current4 = editorIns.current) === null || _editorIns$current4 === void 0 ? void 0 : (_editorIns$current4$g = _editorIns$current4.getPosition) === null || _editorIns$current4$g === void 0 ? void 0 : _editorIns$current4$g.call(_editorIns$current4);
          if (currentPosition &&
          // 有光标
          range.containsPosition(currentPosition) // 光标在world里面
          ) {
            var _editorIns$current5, _editorIns$current5$g;
            const cS = editorIns === null || editorIns === void 0 ? void 0 : (_editorIns$current5 = editorIns.current) === null || _editorIns$current5 === void 0 ? void 0 : (_editorIns$current5$g = _editorIns$current5.getSelection) === null || _editorIns$current5$g === void 0 ? void 0 : _editorIns$current5$g.call(_editorIns$current5);
            const selectEqual = cS.endColumn === selection.endColumn;
            if (selectEqual &&
            // 当前选中的就是应该要选中的末尾
            currentPosition.column === selection.endColumn &&
            // 光标在最右边
            (event === null || event === void 0 ? void 0 : event.keyCode) === KeyCode.RightArrow // 按了右方向键
            ) {
              const selectMoveRightOneCol = [...selectData];
              selectMoveRightOneCol[3] += 1; // 光标右移
              // eslint-disable-next-line prefer-destructuring
              selectMoveRightOneCol[1] = selectMoveRightOneCol[3]; // 没有选区（start === end
              // @ts-ignore
              editorIns.current.setSelections([new Selection(...selectMoveRightOneCol)]);
              // const cur = editorIns?.current.getSelection();
              // 为了保证代码的美观性，只有表达式位于最后才需要添加空的插入
              const transferStr = val.replace(/\s*$/, '').replace(/\s/g, '*');
              if (transferStr.length === currentPosition.column || (transferStr === null || transferStr === void 0 ? void 0 : transferStr.length) + 1 === currentPosition.column) {
                setEditorVal(''); // 塞入一个空指，保证代码块下一次能触发选中
              }
            } else {
              editorIns.current.setSelections([selection]); // 选中块
            }
          }
        });
        if (stopEventFlag) {
          event.preventDefault();
          event.stopPropagation();
        }
      }
    };
    if (editorIns.current) {
      editorIns.current.onKeyDown(event => {
        // 按下删除按键
        if (event.keyCode === KeyCode.Backspace) {
          onEvent(event, false);
        }
      });
      editorIns.current.onMouseUp(({
        event
      }) => {
        onEvent(event);
      });
      editorIns.current.onMouseMove(({
        event
      }) => {
        onEvent(event);
      });
      editorIns.current.onKeyUp(keyBoardEvent => {
        if (keyBoardEvent.keyCode === KeyCode.UpArrow || keyBoardEvent.keyCode === KeyCode.DownArrow || keyBoardEvent.keyCode === KeyCode.LeftArrow || keyBoardEvent.keyCode === KeyCode.RightArrow) {
          onEvent(keyBoardEvent);
        }
      });
    }

    /**
     * 代码提示
     */
    provider = monaco.languages.registerCompletionItemProvider(language, {
      provideCompletionItems( /* model, position, context, token */
      ) {
        const suggestions = [];

        // 字段的提示
        ['CASEWHEN(expression1, value1, expression2, value2, ..., else_value)', 'CONCAT(str1, str2, ...)', 'ISNULL (expression, defaultValue)', 'DATEDIFF_YEAR(startdate,enddate)', 'DATEDIFF_MONTH(startdate,enddate)', 'DATEDIFF_DAY(startdate,enddate)', 'SUM(expression)', 'AVG(expression)', 'MAX(expression)', 'MIN(expression)', 'COUNT(expression)', 'DISTINCTCOUNT(expression)', 'DISTINCTAVG(expression)', 'DISTINCTSUM(expression)', 'NOW()'].forEach(item => {
          suggestions.push(
          // 添加contact()函数
          {
            label: item,
            // 显示名称
            kind: monaco.languages.CompletionItemKind.Function,
            // 这里Function也可以是别的值，主要用来显示不同的图标
            insertText: item // 实际粘贴上的值
          });
        });
        return {
          suggestions
        };
      }
    });

    // // Register a new language
    monaco.languages.register({
      id: language
    });

    // // Register a tokens provider for the language
    monaco.languages.setMonarchTokensProvider(language, {
      tokenizer: {
        root: [[/CASCADE\(.*?\)/, 'block'], [/#(.[^#]*)#(?=\s)/, 'block']]
      }
    });

    // Define a new theme that contains only rules that match this language
    monaco.editor.defineTheme('myCoolTheme', {
      base: 'vs',
      inherit: true,
      rules: [{
        token: 'block',
        foreground: primary === null || primary === void 0 ? void 0 : (_primary$slice2 = primary.slice) === null || _primary$slice2 === void 0 ? void 0 : _primary$slice2.call(primary, 1),
        fontStyle: 'bold',
        background: primary1 === null || primary1 === void 0 ? void 0 : (_primary1$slice2 = primary1.slice) === null || _primary1$slice2 === void 0 ? void 0 : _primary1$slice2.call(primary1, 1)
      }],
      colors: {
        // 相关颜色属性配置
        'editor.background': '#ffffff' // 背景色
        // 'block.background': step1,
        // 'block.foreground': primary,
        // 'editor.selectionBackground': primary,
        // 'editor.inactiveSelectionBackground': step1,
      }
    });
    monaco.editor.setTheme('myCoolTheme');

    // 编辑器聚焦
    editor.focus();
  };
  const handleCheck = conditionExpression => {
    if (!conditionExpression) {
      return [false, intl.get('hmde.bo.businessObject.expressionNone').d('表达式不能为空')];
    } else {
      var _curFieldCode, _curFieldCode2, _curFieldCode3;
      // 判断表达式的返回值是否为boolean
      let curFieldCode = formula2Desc(conditionExpression, businessObjectFieldList.map(({
        meaning,
        value
      }) => ({
        meaning: `#${meaning}#`,
        value
      })).sort((a, b) => {
        var _b$value2, _a$value2;
        return (b === null || b === void 0 ? void 0 : (_b$value2 = b.value) === null || _b$value2 === void 0 ? void 0 : _b$value2.length) - (a === null || a === void 0 ? void 0 : (_a$value2 = a.value) === null || _a$value2 === void 0 ? void 0 : _a$value2.length);
      }));
      curFieldCode = (_curFieldCode = curFieldCode) === null || _curFieldCode === void 0 ? void 0 : _curFieldCode.replace(BlockReg, '"1"');
      curFieldCode = (_curFieldCode2 = curFieldCode) === null || _curFieldCode2 === void 0 ? void 0 : _curFieldCode2.replace(DrillFormulaReg, '"1"');
      curFieldCode = (_curFieldCode3 = curFieldCode) === null || _curFieldCode3 === void 0 ? void 0 : _curFieldCode3.replace(/[_#][a-zA-Z]*\(.*?\)/g, true);
      try {
        // eslint-disable-next-line no-eval
        // eval(
        //   conditionExpression
        //     .replace(
        //       /(?:_is(Not)?Empty\((CASCADE\((\w+\.\w+,??)*\)|\w+)\))|(?:(CASCADE\((\w+\.\w+,??)*\)|\w+))|(?:#\w+\(.*\))/g,
        //       (item) => `"${item}"`
        //     )
        //     .replace(/(''[^']*'')|(""[^"]*"")/g, (item) => item.slice(1, item.length - 1))
        // ); // 先将表达式的字段及函数转为字符串，这样即可用于js内置String.eval()方法校验其是否为逻辑表达式
        // eslint-disable-next-line no-eval
        const res = eval(curFieldCode);
        if (conditionExpression && typeof res === 'boolean') {
          return [true, intl.get('hmde.common.successValidation').d('校验成功')];
        } else {
          return [false, intl.get('hmde.common.message.expressionTypeError').d('表达式返回类型有误，期望类型：boolean')];
        }
      } catch (error) {
        return [false, error === null || error === void 0 ? void 0 : error.message];
      }
    }
  };

  /**
   * 获取drill数据，回写到editor
   * @param dataSet drill的dataSet
   */
  const handleOk = params => {
    const _ref = params,
      value = _ref.value,
      text = _ref.text;
    formulaMappingList.push({
      value,
      meaning: text
    });
    setEditorVal(`${text} `);
  };
  const drillRenderer = () => {
    return /*#__PURE__*/React.createElement(DrillComponent, {
      onOk: handleOk,
      name: "field",
      businessObjectCode: businessObjectCode,
      selectObjectCheckFlag: true,
      isWriteBack: false,
      renderer: () => /*#__PURE__*/React.createElement("a", {
        className: styles['add-relation-fields']
      }, /*#__PURE__*/React.createElement(_Icon, {
        type: "add"
      }), "\u5173\u8054\u5B57\u6BB5")
    });
  };
  const _useState7 = useState(''),
    _useState8 = _slicedToArray(_useState7, 2),
    searchArith = _useState8[0],
    setSearchArith = _useState8[1];
  const _useState9 = useState([arithmetic === null || arithmetic === void 0 ? void 0 : (_arithmetic$ = arithmetic[0]) === null || _arithmetic$ === void 0 ? void 0 : _arithmetic$.value]),
    _useState10 = _slicedToArray(_useState9, 2),
    expandArithKeys = _useState10[0],
    setExpandArithKeys = _useState10[1];
  const _useState11 = useState(true),
    _useState12 = _slicedToArray(_useState11, 2),
    autoExpandParentArith = _useState12[0],
    setAutoExpandParentArith = _useState12[1];
  const _useState13 = useState(''),
    _useState14 = _slicedToArray(_useState13, 2),
    searchFun = _useState14[0],
    setSearchFun = _useState14[1];
  const _useState15 = useState(funDescMap.get(fun === null || fun === void 0 ? void 0 : (_fun$ = fun[0]) === null || _fun$ === void 0 ? void 0 : _fun$.value)),
    _useState16 = _slicedToArray(_useState15, 2),
    hoverFunDesc = _useState16[0],
    setHoverFunDesc = _useState16[1];
  const treeFilter = (tree, func) => {
    var _tree$map;
    return (_tree$map = tree.map(item => ({
      ...item
    }))) === null || _tree$map === void 0 ? void 0 : _tree$map.filter(item => {
      // eslint-disable-next-line no-param-reassign
      item.children = func(item) ? item.children : treeFilter((item === null || item === void 0 ? void 0 : item.children) || [], func);
      return func(item) || item.children && item.children.length;
    });
  };
  const loop = (data, searchValue = '', fn) => {
    return data === null || data === void 0 ? void 0 : data.map(item => {
      const index = item.meaning.indexOf(searchValue);
      const beforeStr = item.meaning.substring(0, index);
      const afterStr = item.meaning.substring(index + (searchValue === null || searchValue === void 0 ? void 0 : searchValue.length));
      const title = index > -1 ? /*#__PURE__*/React.createElement("span", null, beforeStr, /*#__PURE__*/React.createElement("span", {
        style: {
          color: errorColor
        }
      }, searchValue), afterStr) : /*#__PURE__*/React.createElement("span", null, item.meaning);
      const hoverFn = key => {
        if (funDescMap.has(key)) {
          setHoverFunDesc(funDescMap.get(key));
        }
      };
      if (item.children) {
        return /*#__PURE__*/React.createElement(TreeNode, {
          key: item.value,
          title: title,
          selectable: false
        }, loop(item.children, searchValue, fn));
      }
      return /*#__PURE__*/React.createElement(TreeNode, {
        key: item.value,
        title: /*#__PURE__*/React.createElement("div", {
          onMouseEnter: () => hoverFn(item.value),
          onClick: () => fn(item)
        }, title)
      });
    });
  };
  return /*#__PURE__*/React.createElement(FlowModalLayout, {
    dataSet: dataSet,
    title: intl.get('hmde.bo.businessObject.condition').d('条件'),
    name: "conditionName"
  }, !((_dataSet$current8 = dataSet.current) !== null && _dataSet$current8 !== void 0 && _dataSet$current8.get('defaultFlag')) ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_Form, {
    record: dataSet.current,
    hidden: !dataSet.current,
    useColon: false,
    labelAlign: 'left',
    labelWidth: "auto"
  }, /*#__PURE__*/React.createElement(_SelectBox, {
    name: "conditionMode"
  })), ((_dataSet$current9 = dataSet.current) === null || _dataSet$current9 === void 0 ? void 0 : _dataSet$current9.get('conditionMode')) === ConditionMode.simple && /*#__PURE__*/React.createElement("div", {
    className: styles['flow-simple-condition']
  }, /*#__PURE__*/React.createElement("header", null, /*#__PURE__*/React.createElement("strong", null, intl.get('hmde.bo.businessObject.condition').d('条件')), /*#__PURE__*/React.createElement(_Button, {
    icon: "add",
    funcType: "flat",
    color: "primary",
    onClick: () => handleAddRecordCondition()
  }, intl.get('hmde.bo.flow.button.createCondition').d('新增条件'))), (_dataSet$current10 = dataSet.current) === null || _dataSet$current10 === void 0 ? void 0 : (_dataSet$current10$ge = _dataSet$current10.getCascadeRecords('conditionLines')) === null || _dataSet$current10$ge === void 0 ? void 0 : (_dataSet$current10$ge2 = _dataSet$current10$ge.sort((a, b) => (a === null || a === void 0 ? void 0 : a.get('orderSeq')) - (b === null || b === void 0 ? void 0 : b.get('orderSeq')))) === null || _dataSet$current10$ge2 === void 0 ? void 0 : _dataSet$current10$ge2.map((record, index) => /*#__PURE__*/React.createElement(_Form, {
    record: record,
    key: record.key,
    useColon: false,
    className: styles['flow-condition-item'],
    layout: 'none'
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: primary1,
      color: primary,
      borderRadius: 4,
      minWidth: 16,
      width: 16,
      height: 16,
      lineHeight: '16px',
      textAlign: 'center'
    }
  }, index + 1), /*#__PURE__*/React.createElement(_Select, {
    name: "leftValueType",
    readOnly: !enabledDrillFlag
  }), /*#__PURE__*/React.createElement(_Output, {
    renderer: () => {
      const leftValueType = record === null || record === void 0 ? void 0 : record.get('leftValueType');
      if (leftValueType === 'BO_FIELD') {
        return /*#__PURE__*/React.createElement(DrillComponent, {
          name: "leftValue",
          businessObjectCode: businessObjectCode,
          selectObjectCheckFlag: true,
          drillMainKeyType: EDrillMainKeyType.ALL,
          initValue: (record === null || record === void 0 ? void 0 : record.get('leftValue')) || '',
          onOk: res => {
            var _res$result, _res$result2, _res$result4;
            if (res !== null && res !== void 0 && (_res$result = res.result) !== null && _res$result !== void 0 && _res$result.componentType && ['RADIO', 'SINGLE_SELECT', 'CHECKBOX', 'MULTIPLE_SELECT'].includes(res === null || res === void 0 ? void 0 : (_res$result2 = res.result) === null || _res$result2 === void 0 ? void 0 : _res$result2.componentType)) {
              var _res$result3;
              record === null || record === void 0 ? void 0 : record.set('attributeJson', res === null || res === void 0 ? void 0 : (_res$result3 = res.result) === null || _res$result3 === void 0 ? void 0 : _res$result3.attributeJson);
            } else {
              record === null || record === void 0 ? void 0 : record.set('attributeJson', undefined);
            }
            record === null || record === void 0 ? void 0 : record.set('leftValue', res === null || res === void 0 ? void 0 : res.value);
            if ((res === null || res === void 0 ? void 0 : (_res$result4 = res.result) === null || _res$result4 === void 0 ? void 0 : _res$result4.componentType) === 'FORMULA') {
              var _res$result5, _res$result5$attribut;
              const resultTypes = new Map([['Long', 'NUMBER_FIELD'], ['BigDecimal', 'FLOAT'], ['String', 'TEXT_FIELD'], ['LocalDate', 'DATE_SELECTION_BOX'], ['ZonedDateTime', 'DATETIME_SELECTION_BOX'], ['Boolean', 'SWITCH']]);
              record === null || record === void 0 ? void 0 : record.set('componentType', resultTypes.get(res === null || res === void 0 ? void 0 : (_res$result5 = res.result) === null || _res$result5 === void 0 ? void 0 : (_res$result5$attribut = _res$result5.attributeJson) === null || _res$result5$attribut === void 0 ? void 0 : _res$result5$attribut.resultType));
            } else {
              var _res$result6;
              record === null || record === void 0 ? void 0 : record.set('componentType', res === null || res === void 0 ? void 0 : (_res$result6 = res.result) === null || _res$result6 === void 0 ? void 0 : _res$result6.componentType);
            }
          },
          onClear: () => record === null || record === void 0 ? void 0 : record.set('leftValue', undefined)
        });
      } else {
        return /*#__PURE__*/React.createElement(_Select, {
          name: "leftValue"
        });
      }
    }
  }), /*#__PURE__*/React.createElement(_Select, {
    name: "operatorType",
    optionsFilter: obj => {
      const item = (obj === null || obj === void 0 ? void 0 : obj.get('value')) || '';
      for (const _ref2 of classifyComponentType) {
        const componentType = _ref2.componentType;
        const operatorType = _ref2.operatorType;
        if (componentType.includes(record === null || record === void 0 ? void 0 : record.get('componentType'))) {
          return operatorType.includes(item);
        }
      }
      return false;
    }
  }), /*#__PURE__*/React.createElement(_Select, {
    name: "rightValueType",
    style: valueTypeHidden(record === null || record === void 0 ? void 0 : record.get('operatorType')) ? {
      visibility: 'hidden'
    } : {},
    optionsFilter: obj => {
      const operatorType = record === null || record === void 0 ? void 0 : record.get('operatorType');
      // const componentType = record?.get('componentType');
      const item = (obj === null || obj === void 0 ? void 0 : obj.get('value')) || '';
      // if (operatorType) {
      //   if (!enabledDrillFlag) {
      //     if (componentType === 'SWITCH') {
      //       return item === 'CURRENT_FIELD';
      //     } else {
      //       return item !== 'BO_FIELD';
      //     }
      //   } else if (enabledDrillFlag && componentType === 'SWITCH') {
      //     return item.includes('FIELD');
      //   } else {
      //     return true;
      //   }
      // }
      // return false;
      if (enabledDrillFlag) {
        return !!operatorType;
      } else {
        return !!operatorType && item !== 'BO_FIELD';
      }
    }
  }), /*#__PURE__*/React.createElement(_Output, {
    style: valueTypeHidden(record === null || record === void 0 ? void 0 : record.get('operatorType')) ? {
      visibility: 'hidden'
    } : {},
    renderer: () => {
      const componentType = record === null || record === void 0 ? void 0 : record.get('componentType');
      const operatorType = record === null || record === void 0 ? void 0 : record.get('operatorType');
      const rightValueType = record === null || record === void 0 ? void 0 : record.get('rightValueType');
      if (rightValueType === 'BO_FIELD') {
        return /*#__PURE__*/React.createElement(DrillComponent, {
          name: "rightValue",
          businessObjectCode: businessObjectCode,
          selectObjectCheckFlag: true,
          drillMainKeyType: EDrillMainKeyType.ALL,
          initValue: (record === null || record === void 0 ? void 0 : record.get('rightValue')) || '',
          onOk: res => {
            record === null || record === void 0 ? void 0 : record.set('rightValue', res === null || res === void 0 ? void 0 : res.value);
          },
          onClear: () => record === null || record === void 0 ? void 0 : record.set('rightValue', undefined)
        });
      } else if (rightValueType === 'CURRENT_FIELD') {
        return /*#__PURE__*/React.createElement(_Select, {
          name: "rightValue",
          optionsFilter: obj => {
            const item = obj.get('componentType') || '';
            const _ref3 = classifyComponentType.find(({
                componentType: type
              }) => type.includes(componentType)) || {},
              _ref3$componentType = _ref3.componentType,
              sameTypeList = _ref3$componentType === void 0 ? [] : _ref3$componentType;
            return sameTypeList.includes(item);
          }
        });
      } else if (rightValueType === 'FIXED') {
        // 日期
        if (componentType === 'DATE_SELECTION_BOX') {
          return /*#__PURE__*/React.createElement(_DatePicker, {
            name: "rightValue",
            format: "YYYY-MM-DD",
            style: {
              width: '100%'
            }
          });
        }
        // 日期时间
        if (componentType === 'DATETIME_SELECTION_BOX') {
          return /*#__PURE__*/React.createElement(_DateTimePicker, {
            // name="rightValue"
            value: record === null || record === void 0 ? void 0 : record.get('rightValue'),
            onChange: val => record === null || record === void 0 ? void 0 : record.set('rightValue', val),
            required: true,
            format: "YYYY-MM-DD HH:mm:ss",
            style: {
              width: '100%'
            }
          });
        }
        // 数字
        if (['NUMBER_FIELD', 'FLOAT', 'PERCENTAGE', 'MONEY'].includes(componentType) && ['EQUAL', 'NOT_EQUAL', 'LESS_THAN', 'LESS_THAN_OR_EQUAL_TO', 'GREATER_THAN', 'GREATER_THAN_OR_EQUAL_TO'].includes(operatorType)) {
          return /*#__PURE__*/React.createElement(_NumberField, {
            name: "rightValue",
            style: {
              width: '100%'
            }
          });
        }
        // 单选、下拉单选、多选、复选、开关(开启/关闭)
        if (['RADIO', 'SINGLE_SELECT', 'CHECKBOX', 'MULTIPLE_SELECT', 'SWITCH'].includes(componentType)) {
          if (['EQUAL', 'NOT_EQUAL'].includes(operatorType)) {
            return /*#__PURE__*/React.createElement(_Select, {
              name: "rightValue",
              style: {
                width: '100%'
              }
            });
          }
        }
      }
      return /*#__PURE__*/React.createElement(_TextField, {
        name: "rightValue",
        style: {
          width: '100%'
        }
      });
    }
  }), /*#__PURE__*/React.createElement(Popconfirm, {
    title: intl.get('hmde.bo.businessObject.deletetip').d('是否删除'),
    content: intl.get('hmde.bo.view.deletethisdata').d('确定删除该条数据吗？'),
    placement: "topRight",
    arrowPointAtCenter: true,
    handleOk: () => {
      var _dataSet$current11, _dataSet$current11$da, _dataSet$current11$da2, _dataSet$current11$da3;
      // eslint-disable-next-line no-unused-expressions
      (_dataSet$current11 = dataSet.current) === null || _dataSet$current11 === void 0 ? void 0 : (_dataSet$current11$da = _dataSet$current11.dataSet) === null || _dataSet$current11$da === void 0 ? void 0 : (_dataSet$current11$da2 = _dataSet$current11$da.children) === null || _dataSet$current11$da2 === void 0 ? void 0 : (_dataSet$current11$da3 = _dataSet$current11$da2.conditionLines) === null || _dataSet$current11$da3 === void 0 ? void 0 : _dataSet$current11$da3.delete(record, false).then(() => setLogicFormula(true));
    }
  }, /*#__PURE__*/React.createElement(ImgIcon, {
    name: "delete-B16@1x.svg",
    size: 16
  })))), /*#__PURE__*/React.createElement(_Form, {
    record: dataSet.current,
    hidden: !dataSet.current,
    useColon: false,
    labelAlign: 'left',
    labelWidth: "auto",
    columns: 5
  }, /*#__PURE__*/React.createElement(_TextField, {
    name: "conditionLineRelation",
    colSpan: 3
  }))), ((_dataSet$current12 = dataSet.current) === null || _dataSet$current12 === void 0 ? void 0 : _dataSet$current12.get('conditionMode')) === ConditionMode.expression && /*#__PURE__*/React.createElement("div", {
    className: styles['flow-expression-condition']
  }, /*#__PURE__*/React.createElement("p", null, intl.get('hmde.bo.businessObject.example').d('示例'), /*#__PURE__*/React.createElement("span", {
    style: fieldStyle
  }, "#", intl.get('hmde.common.text.age').d('年龄'), "#", '>', "20"), intl.get('hmde.common.text.conditionModeMsg1').d('如果年龄大于20则条件生效，且输入公式后单击“检查语法”可检查错误')), /*#__PURE__*/React.createElement("div", {
    className: styles.editor
  }, /*#__PURE__*/React.createElement("header", null, /*#__PURE__*/React.createElement("strong", null, intl.get('hmde.bo.flow.model.formula').d('公式')), /*#__PURE__*/React.createElement(_Tooltip, {
    title: /*#__PURE__*/React.createElement("span", null, intl.get('hmde.common.text.conditionModeMsg2').d('支持js内置的数学运算方法，如: Math.max(1, 2, 3)'), ";", /*#__PURE__*/React.createElement("br", null), intl.get('hmde.common.text.conditionModeMsg3').d('支持手写操作符'), ": ==\u3001!=\u3001", '>', "=\u3001", '<', "=\u3001", '>', "\u3001", '<', "\u3001 &&\u3001||\u3001 ()\u3001!\u3001+\u3001-\u3001*\u3001\\;", /*#__PURE__*/React.createElement("br", null), intl.get('hmde.common.text.conditionModeMsg4').d('条件需满足运算结果为布尔值，需要通过检查'))
  }, /*#__PURE__*/React.createElement(ImgIcon, {
    name: "tishi.svg",
    size: 12,
    style: {
      marginLeft: 5,
      marginTop: 2
    }
  }))), /*#__PURE__*/React.createElement(MonacoEditor, {
    width: "100%",
    height: "calc(100% - 28px)",
    language: language,
    value: code,
    options: options,
    onChange: onChangeHandle,
    editorDidMount: editorDidMountHandle,
    theme: "myCoolTheme"
  }), /*#__PURE__*/React.createElement(GlobalStyle, {
    css: getBlockCss
  }), /*#__PURE__*/React.createElement(ImgIcon, {
    name: "check_formula.svg",
    size: 14,
    onClick: () => {
      const _handleCheck3 = handleCheck(dataSet.current.get('conditionExpression')),
        _handleCheck4 = _slicedToArray(_handleCheck3, 2),
        isValid = _handleCheck4[0],
        result = _handleCheck4[1];
      if (isValid) {
        _message.success(intl.get('hmde.common.successValidation').d('校验成功'), 3, () => {}, 'top');
      } else {
        notification.error({
          message: intl.get('hmde.common.message.validationerrorMsg').d('条件表达式校验失败'),
          description: result
        });
      }
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: styles['condition-editor-config']
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("header", null, /*#__PURE__*/React.createElement(ImgIcon, {
    name: "option-field-props.svg",
    size: 14
  }), /*#__PURE__*/React.createElement("strong", null, intl.get('hmde.common.fieldList').d('字段列表')), enabledDrillFlag && drillRenderer()), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(_TextField, {
    value: searchFieldList,
    onChange: val => setSearchFieldList(val),
    prefix: /*#__PURE__*/React.createElement(ImgIcon, {
      name: "search@v4.0.svg",
      size: 14
    }),
    placeholder: intl.get('hmde.bo.view.pleaseSearch').d('请搜索')
  }), /*#__PURE__*/React.createElement(DirectoryTree, {
    blockNode: true,
    showIcon: false,
    selectable: false,
    switcherIcon: undefined,
    className: styles['no-switcher-tree']
  }, loop(treeFilter(businessObjectFieldList, item => item.meaning.indexOf(searchFieldList) > -1 || !searchFieldList), searchFieldList, field => handleOk({
    text: `#${field.meaning}#`,
    value: `${field.value}`
  }))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("header", null, /*#__PURE__*/React.createElement(ImgIcon, {
    name: "option-field-props.svg",
    size: 14
  }), /*#__PURE__*/React.createElement("strong", null, intl.get('hmde.bo.businessObject.formula.operator').d('运算符'))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(_TextField, {
    value: searchArith,
    onChange: val => {
      const parentKeys = getParentKey(val, arithmetic);
      setExpandArithKeys(parentKeys);
      setAutoExpandParentArith(true);
      setSearchArith(val);
    },
    prefix: /*#__PURE__*/React.createElement(ImgIcon, {
      name: "search@v4.0.svg",
      size: 14
    }),
    placeholder: intl.get('hmde.bo.view.pleaseSearch').d('请搜索')
  }), /*#__PURE__*/React.createElement(DirectoryTree, {
    onExpand: keys => {
      setExpandArithKeys(keys);
      setAutoExpandParentArith(false);
    },
    expandedKeys: expandArithKeys,
    autoExpandParent: autoExpandParentArith,
    blockNode: true,
    selectable: false,
    showIcon: false
  }, loop(treeFilter(arithmetic, item => item.meaning.indexOf(searchArith) > -1 || !searchArith), searchArith, item => setEditorVal(item.value))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("header", null, /*#__PURE__*/React.createElement(ImgIcon, {
    name: "option-field-props.svg",
    size: 14
  }), /*#__PURE__*/React.createElement("strong", null, intl.get('hmde.bo.businessObject.functionList').d('函数列表'))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(_TextField, {
    value: searchFun,
    onChange: val => setSearchFun(val),
    prefix: /*#__PURE__*/React.createElement(ImgIcon, {
      name: "search@v4.0.svg",
      size: 14
    }),
    placeholder: intl.get('hmde.bo.view.pleaseSearch').d('请搜索')
  }), /*#__PURE__*/React.createElement(DirectoryTree, {
    className: styles['no-switcher-tree'],
    blockNode: true,
    selectable: false,
    showIcon: false,
    switcherIcon: undefined
  }, loop(treeFilter(fun, item => item.meaning.indexOf(searchFun) > -1 || !searchFun), searchFun, item => setEditorVal(item.value))))), /*#__PURE__*/React.createElement(_Divider, {
    type: "vertical",
    style: {
      height: 'calc(100% - 32px)',
      top: 16
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("header", null, /*#__PURE__*/React.createElement(ImgIcon, {
    name: "option-field-props.svg",
    size: 14
  }), /*#__PURE__*/React.createElement("strong", null, intl.get('hmde.bo.view.comment').d('注释说明'))), /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: 'hidden auto',
      whiteSpace: 'pre-line',
      wordWrap: 'break-word',
      wordBreak: 'break-all'
    }
  }, hoverFunDesc)))))) : /*#__PURE__*/React.createElement(React.Fragment, null));
};
export default formatterCollections({
  code: ['hmde.bo']
})(observer(Index));
export const getBlockCss = props => {
  const _getThemeData2 = getThemeData(props, 'common'),
    primary = _getThemeData2.primary,
    primary1 = _getThemeData2.primary1,
    primary4 = _getThemeData2.primary4;
  return css`
    .mtk8.mtkb {
      padding: 2px 0;
      color: ${primary};
      font-weight: 400;
      background: ${primary1}; ${primary4};
      // border: 1px
      border-radius: 2px;
      box-shadow: 0 0 0 1px ${primary4};
    }
  `;
};