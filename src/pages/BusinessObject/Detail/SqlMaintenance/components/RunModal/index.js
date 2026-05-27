import _Select from "@hzero-front-ui/c7n-ui/lib/SelectPro";
import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
import _Tag from "@hzero-front-ui/c7n-ui/lib/Tag";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _Switch from "@hzero-front-ui/c7n-ui/lib/SwitchPro";
import _NumberField from "@hzero-front-ui/c7n-ui/lib/NumberFieldPro";
import _DateTimePicker from "@hzero-front-ui/c7n-ui/lib/DateTimePickerPro";
import _DatePicker from "@hzero-front-ui/c7n-ui/lib/DatePickerPro";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _useDataSet from "choerodon-ui/pro/lib/use-data-set";
import _Collapse from "@hzero-front-ui/c7n-ui/lib/Collapse";
import _Table from "@hzero-front-ui/c7n-ui/lib/TablePro";
import _isNil from "lodash/isNil";
import _isArray from "lodash/isArray";
import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import intl from 'utils/intl';
import { operatorRender } from 'utils/renderer';
import { FuncType } from 'choerodon-ui/pro/lib/button/enum';
import useCancelRequest from 'hzero-front-apaas/lib/hooks/useCancelRequest';
import { useSafeState } from 'ahooks';
import { isResponse } from 'hzero-front-apaas/lib/utils/request';
import Empty from 'hzero-front-apaas/lib/components/Empty';
import uuid from 'uuid/v4';
import { executeSql } from "hzero-front-hmde/lib/routes/SQLEditor/services";
import { ApiParamType } from "hzero-front-hmde/lib/constants/businessObject";
import ResultTable from "hzero-front-hmde/lib/routes/SQLEditor/components/Run/components/ResultTable";
import ResultError from "hzero-front-hmde/lib/routes/SQLEditor/components/Run/components/ResultError";
import { getTimeFormat } from "hzero-front-hmde/lib/utils/common";
import sqlRunParamsDS, { SQL_RUN_PARAMS_FN } from "../../datasets/sqlRunParamsDS";
import { filerQueryParamsTypes } from "../../utils/common";
import styles from "./index.less?modules";
var CollapseKeys = /*#__PURE__*/function (CollapseKeys) {
  CollapseKeys["queryParams"] = "queryParams";
  CollapseKeys["run"] = "run";
  return CollapseKeys;
}(CollapseKeys || {});
const Column = _Table.Column;
const Panel = _Collapse.Panel;
const RunModal = ({
  sqlRunParamsDsRef,
  sqlQueryParamsDs,
  sql,
  serviceCode
}) => {
  const sqlRunParamsDs = _useDataSet(() => sqlRunParamsDS(), []);
  const _useState = useState([CollapseKeys.queryParams]),
    _useState2 = _slicedToArray(_useState, 2),
    collapseActiveKeys = _useState2[0],
    setCollapseActiveKeys = _useState2[1];
  const _useSafeState = useSafeState([]),
    _useSafeState2 = _slicedToArray(_useSafeState, 2),
    resultData = _useSafeState2[0],
    setResultData = _useSafeState2[1];
  const _useSafeState3 = useSafeState(false),
    _useSafeState4 = _slicedToArray(_useSafeState3, 2),
    isFirstRun = _useSafeState4[0],
    setIsFirstRun = _useSafeState4[1];
  const resultDom = useRef(null);
  const _useCancelRequest = useCancelRequest(executeSql),
    runExecuteSql = _useCancelRequest.run;
  useEffect(() => {
    sqlRunParamsDsRef.current = sqlRunParamsDs;
    return () => {
      sqlRunParamsDsRef.current = null;
    };
  }, [sqlQueryParamsDs]);
  useEffect(() => {
    const sqlQueryParamsDsData = sqlQueryParamsDs.toData().filter(value => value[SQL_RUN_PARAMS_FN.CODE]);
    // 如果数据类型不存在，则设置文本为默认值
    sqlQueryParamsDsData.forEach(item => {
      if (!item[SQL_RUN_PARAMS_FN.TYPE]) {
        item[SQL_RUN_PARAMS_FN.TYPE] = ApiParamType.String;
      }
      // 如果是开关类型，默认值 false;
      if (item[SQL_RUN_PARAMS_FN.TYPE] === ApiParamType.Byte) {
        item[SQL_RUN_PARAMS_FN.VALUE] = 0;
      }
    });
    sqlRunParamsDs.loadData(sqlQueryParamsDsData);
    sqlRunParamsDs.validate();
  }, [sqlQueryParamsDs]);
  const handleDelete = record => {
    sqlRunParamsDs.remove(record);
  };
  const handleRun = async () => {
    const validateFlag = await sqlRunParamsDs.validate();
    if (validateFlag) {
      const params = {};
      const sqlRunParamsData = sqlRunParamsDs.toData();
      sqlRunParamsData.forEach(item => {
        const key = item[SQL_RUN_PARAMS_FN.CODE];
        const value = item[SQL_RUN_PARAMS_FN.VALUE];
        if (!_isNil(value)) {
          params[key] = value;
        }
      });

      // 校验成功调用接口获取返回结果
      const res = await runExecuteSql({
        serviceCode,
        sql,
        params
      });
      if (isResponse(res) && _isArray(res) && res.length > 0) {
        setIsFirstRun(true);
        // 补充id
        const result = res === null || res === void 0 ? void 0 : res.map(v => ({
          ...v,
          id: uuid()
        }));
        setResultData(result);
        // 展开结果
        if (!collapseActiveKeys.includes(CollapseKeys.run)) {
          setCollapseActiveKeys([...collapseActiveKeys, CollapseKeys.run]);
          setTimeout(() => {
            var _resultDom$current;
            (_resultDom$current = resultDom.current) === null || _resultDom$current === void 0 ? void 0 : _resultDom$current.scrollIntoView({
              behavior: 'smooth'
            });
          }, 200);
        }
      } else {
        setResultData([]);
      }
    }
  };
  const renderOperate = ({
    record
  }) => {
    if (!record) return null;
    const operators = [{
      key: 'delete',
      ele: /*#__PURE__*/React.createElement("a", {
        onClick: () => handleDelete(record)
      }, intl.get(`hzero.common.button.delete`).d('删除')),
      len: 2
    }];
    return operatorRender(operators, record, {
      limit: 3
    });
  };
  const handleParamsCreate = e => {
    e.stopPropagation();
    sqlRunParamsDs.create(undefined, 0);
  };
  const renderValueDynamicComponent = record => {
    var _getTimeFormat, _getTimeFormat2;
    const type = record.get(SQL_RUN_PARAMS_FN.TYPE);
    switch (type) {
      case ApiParamType.LocalDate:
        return /*#__PURE__*/React.createElement(_DatePicker, {
          record: record,
          name: SQL_RUN_PARAMS_FN.VALUE,
          format: (_getTimeFormat = getTimeFormat()) === null || _getTimeFormat === void 0 ? void 0 : _getTimeFormat.date
        });
      case ApiParamType.ZonedDateTime:
        return /*#__PURE__*/React.createElement(_DateTimePicker, {
          record: record,
          name: SQL_RUN_PARAMS_FN.VALUE,
          format: (_getTimeFormat2 = getTimeFormat()) === null || _getTimeFormat2 === void 0 ? void 0 : _getTimeFormat2.time
        });
      case ApiParamType.Long:
        return /*#__PURE__*/React.createElement(_NumberField, {
          record: record,
          name: SQL_RUN_PARAMS_FN.VALUE,
          step: 1,
          precision: 0
        });
      case ApiParamType.BigDecimal:
        return /*#__PURE__*/React.createElement(_NumberField, {
          record: record,
          name: SQL_RUN_PARAMS_FN.VALUE,
          step: 0.5
        });
      case ApiParamType.Byte:
        return /*#__PURE__*/React.createElement(_Switch, {
          record: record,
          name: SQL_RUN_PARAMS_FN.VALUE
        });
      default:
        return /*#__PURE__*/React.createElement(_TextField, {
          record: record,
          name: SQL_RUN_PARAMS_FN.VALUE
        });
    }
  };
  const renderResultExtra = () => {
    const _resultData = _slicedToArray(resultData, 2),
      summarize = _resultData[0],
      resultTable = _resultData[1];
    if (summarize && resultTable) {
      var _summarize$fields, _summarize$content, _summarize$content$, _summarize$fields2, _summarize$content2, _summarize$content2$;
      return /*#__PURE__*/React.createElement("div", {
        className: styles.summarize
      }, resultTable.status === 'SUCCESS' ? /*#__PURE__*/React.createElement(_Tag, {
        color: "green"
      }, intl.get('hmde.common.view.executionSucceeded').d('执行成功')) : /*#__PURE__*/React.createElement(_Tag, {
        color: "red"
      }, intl.get('hmde.common.view.executionFailed').d('执行失败')), /*#__PURE__*/React.createElement("span", {
        className: styles.label
      }, (_summarize$fields = summarize.fields) === null || _summarize$fields === void 0 ? void 0 : _summarize$fields[3]), /*#__PURE__*/React.createElement("span", {
        className: styles.count
      }, (_summarize$content = summarize.content) === null || _summarize$content === void 0 ? void 0 : (_summarize$content$ = _summarize$content[0]) === null || _summarize$content$ === void 0 ? void 0 : _summarize$content$[3]), /*#__PURE__*/React.createElement("span", {
        className: styles.label
      }, (_summarize$fields2 = summarize.fields) === null || _summarize$fields2 === void 0 ? void 0 : _summarize$fields2[4]), /*#__PURE__*/React.createElement("span", {
        className: styles.count
      }, (_summarize$content2 = summarize.content) === null || _summarize$content2 === void 0 ? void 0 : (_summarize$content2$ = _summarize$content2[0]) === null || _summarize$content2$ === void 0 ? void 0 : _summarize$content2$[4]));
    }
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(_Collapse, {
    activeKey: collapseActiveKeys,
    onChange: keys => setCollapseActiveKeys(keys)
  }, /*#__PURE__*/React.createElement(Panel, {
    header: /*#__PURE__*/React.createElement("strong", {
      style: {
        fontSize: 14
      }
    }, intl.get('hmde.bo.sqlBo.queryParams').d('查询参数')),
    key: CollapseKeys.queryParams,
    extra: /*#__PURE__*/React.createElement(_Button, {
      funcType: "link",
      icon: "add",
      onClick: handleParamsCreate
    }, intl.get('hmde.common.button.create').d('新建'))
  }, /*#__PURE__*/React.createElement(_Table, {
    dataSet: sqlRunParamsDs
  }, /*#__PURE__*/React.createElement(Column, {
    name: SQL_RUN_PARAMS_FN.CODE,
    editor: record => record.status !== 'sync',
    width: 400
  }), /*#__PURE__*/React.createElement(Column, {
    name: SQL_RUN_PARAMS_FN.TYPE,
    editor: /*#__PURE__*/React.createElement(_Select, {
      name: SQL_RUN_PARAMS_FN.TYPE,
      optionsFilter: filerQueryParamsTypes
    }),
    width: 100
  }), /*#__PURE__*/React.createElement(Column, {
    name: SQL_RUN_PARAMS_FN.VALUE,
    editor: renderValueDynamicComponent
  }), /*#__PURE__*/React.createElement(Column, {
    header: intl.get('hmde.common.table.column.operate').d('操作'),
    width: 100,
    renderer: renderOperate
  })), /*#__PURE__*/React.createElement("div", {
    className: styles.run
  }, /*#__PURE__*/React.createElement(_Button, {
    onClick: () => handleRun()
  }, intl.get('hmde.common.exe').d('执行')))), isFirstRun && /*#__PURE__*/React.createElement(Panel, {
    key: CollapseKeys.run,
    header: /*#__PURE__*/React.createElement("strong", {
      style: {
        fontSize: 14
      }
    }, intl.get('hmde.common.runResult').d('执行结果')),
    extra: renderResultExtra()
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.result,
    ref: resultDom
  }, (resultData === null || resultData === void 0 ? void 0 : resultData.length) > 1 ? resultData.slice(1).map(item => item.status === 'SUCCESS' ? /*#__PURE__*/React.createElement(ResultTable, {
    key: item.id,
    data: item
  }) : /*#__PURE__*/React.createElement(ResultError, {
    key: item.id,
    data: item
  })) : /*#__PURE__*/React.createElement(Empty, {
    title: intl.get('hmde.common.nodata').d('暂无数据')
  })))));
};
export default observer(RunModal);