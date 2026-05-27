import _Table from "@hzero-front-ui/c7n-ui/lib/TablePro";
import _DataSet from "choerodon-ui/pro/lib/data-set";
/* eslint-disable no-param-reassign */
import React, { useEffect, useMemo } from 'react';
import formatterCollections from 'utils/intl/formatterCollections';
import { observer } from 'mobx-react-lite';
import { TableQueryBarType, ColumnAlign, TableColumnTooltip, TableMode } from 'choerodon-ui/pro/lib/table/enum';
import { addFieldADataSet, ParamsTableFN } from "../datasets";
const App = ({
  data,
  modal,
  ds
}) => {
  const tableListDs = useMemo(() => {
    return new _DataSet(addFieldADataSet());
  }, []);
  useEffect(() => {
    // 数据过滤
    let fieldList = data || [];
    const tableList = (ds === null || ds === void 0 ? void 0 : ds.toData()) || [];
    // eslint-disable-next-line array-callback-return
    fieldList = fieldList.filter(v => {
      if (!(tableList !== null && tableList !== void 0 && tableList.find(item => {
        var _v$paramType;
        return item.paramName === v.paramName && (!v.parentId1 || v.parentId1 && item.parentId1) && ((_v$paramType = v.paramType) === null || _v$paramType === void 0 ? void 0 : _v$paramType.toLocaleLowerCase()) !== 'array';
      }))) {
        return true;
      }
    });
    if (!fieldList.find(it => it.parentId1)) {
      fieldList = fieldList.filter(it => {
        var _it$paramType;
        return ((_it$paramType = it.paramType) === null || _it$paramType === void 0 ? void 0 : _it$paramType.toLocaleLowerCase()) !== 'array';
      });
    }
    tableListDs === null || tableListDs === void 0 ? void 0 : tableListDs.loadData(fieldList);
  }, []);
  modal === null || modal === void 0 ? void 0 : modal.handleOk(async () => {
    var _tableListDs$selected, _selectedData;
    let selectedData = tableListDs === null || tableListDs === void 0 ? void 0 : (_tableListDs$selected = tableListDs.selected) === null || _tableListDs$selected === void 0 ? void 0 : _tableListDs$selected.map(v => v === null || v === void 0 ? void 0 : v.toData());

    // 选子, 不选父, 自动加上父
    selectedData.filter(v => v.parentId1).forEach(v => {
      if (!selectedData.some(item => item.id1 === v.parentId1)) {
        var _tableListDs$find;
        selectedData.push((_tableListDs$find = tableListDs.find(item => item.get('id1') === v.parentId1)) === null || _tableListDs$find === void 0 ? void 0 : _tableListDs$find.toData());
      }
    });
    const fatherItem = selectedData.find(v => {
      var _v$paramType2;
      return (v === null || v === void 0 ? void 0 : (_v$paramType2 = v.paramType) === null || _v$paramType2 === void 0 ? void 0 : _v$paramType2.toLocaleLowerCase()) === 'array';
    });
    const tableFatherItem = ds.find(v => {
      var _v$get;
      return (v === null || v === void 0 ? void 0 : (_v$get = v.get('paramType')) === null || _v$get === void 0 ? void 0 : _v$get.toLocaleLowerCase()) === 'array';
    });
    if (fatherItem && tableFatherItem) {
      selectedData.forEach(v => {
        if (v.parentId1 === fatherItem.id1) {
          v.parentId1 = tableFatherItem === null || tableFatherItem === void 0 ? void 0 : tableFatherItem.get('id1');
        }
      });
      selectedData = selectedData.filter(v => {
        var _v$paramType3;
        return (v === null || v === void 0 ? void 0 : (_v$paramType3 = v.paramType) === null || _v$paramType3 === void 0 ? void 0 : _v$paramType3.toLocaleLowerCase()) !== 'array';
      });
    }
    ((_selectedData = selectedData) === null || _selectedData === void 0 ? void 0 : _selectedData.length) && ds.appendData(selectedData);
  });
  const columns = useMemo(() => {
    return [{
      name: ParamsTableFN.PARAMS_NAME,
      align: "left",
      tooltip: "overflow"
    }, {
      name: ParamsTableFN.PARAMS_REMARK,
      align: "left",
      tooltip: "overflow"
    }, {
      name: ParamsTableFN.REQUIRE_TYPE,
      align: "left",
      tooltip: "overflow"
    }, {
      name: ParamsTableFN.MAN_LENGTH,
      align: "left",
      tooltip: "overflow"
    }, {
      name: ParamsTableFN.DECIMALS,
      align: "left",
      tooltip: "overflow"
    }, {
      name: ParamsTableFN.IS_REQUIRED,
      align: "left",
      tooltip: "overflow"
    }, {
      name: ParamsTableFN.BEHAVIOR,
      align: "left",
      tooltip: "overflow"
    }].filter(Boolean);
  }, []);
  return /*#__PURE__*/React.createElement(_Table, {
    dataSet: tableListDs,
    mode: "tree",
    defaultRowExpanded: true,
    virtualCell: false,
    queryBar: "none",
    columns: columns,
    style: {
      overflow: 'auto'
    }
  });
};
export default formatterCollections({
  code: ['hmde.bo', 'hmde.common']
})(observer(App));