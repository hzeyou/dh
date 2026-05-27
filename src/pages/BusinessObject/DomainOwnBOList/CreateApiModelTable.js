import _Table from "@hzero-front-ui/c7n-ui/lib/TablePro";
import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
import _Select from "@hzero-front-ui/c7n-ui/lib/SelectPro";
import React, { useMemo } from 'react';
import formatterCollections from 'utils/intl/formatterCollections';
import { observer } from 'mobx-react-lite';
import intl from 'utils/intl';
import { TableQueryBarType, ColumnAlign, TableColumnTooltip, ColumnLock } from 'choerodon-ui/pro/lib/table/enum';
import { operatorRender } from 'utils/renderer';
const App = ({
  ds,
  type
}) => {
  const handleDelete = record => {
    ds.delete(record, false);
  };
  const handleAdd = () => {
    ds.create({}, 0);
  };
  const handleOptionsFilterXW = (option, r) => {
    // 过滤已经选过的
    if (ds !== null && ds !== void 0 && ds.some(v => (v === null || v === void 0 ? void 0 : v.get('type')) === (option === null || option === void 0 ? void 0 : option.get('value')) && (v === null || v === void 0 ? void 0 : v.id) !== (r === null || r === void 0 ? void 0 : r.id))) {
      return false;
    }
    return option;
  };
  const columns = useMemo(() => {
    return [{
      name: 'type',
      align: "left",
      tooltip: "overflow",
      editor: r => type !== 'copy' && /*#__PURE__*/React.createElement(_Select, {
        name: "type",
        optionsFilter: options => handleOptionsFilterXW(options, r)
      })
    }, {
      name: 'apiObj',
      align: "left",
      tooltip: "overflow",
      editor: type !== 'copy'
    }, type !== 'copy' && {
      header: intl.get('hmde.common.table.column.operate').d('操作'),
      align: "left",
      width: 200,
      renderer: ({
        record
      }) => {
        const operators = [{
          key: 'delete',
          ele: /*#__PURE__*/React.createElement("a", {
            onClick: () => handleDelete(record)
          }, intl.get('hmde.common.button.delete').d('删除')),
          len: 2,
          title: intl.get('hmde.common.button.delete').d('删除')
        }].filter(Boolean);
        return operatorRender(operators, record, {
          limit: 3
        });
      },
      lock: "right"
    }].filter(Boolean);
  }, []);
  const buttons = [type !== 'copy' && /*#__PURE__*/React.createElement(_Button, {
    key: "add",
    icon: "add",
    disabled: ds.length >= 10,
    onClick: () => handleAdd()
  }, intl.get('hmde.common.add').d(`新增`))].filter(Boolean);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      paddingLeft: '70px'
    }
  }, /*#__PURE__*/React.createElement(_Table, {
    dataSet: ds,
    queryBar: "none",
    buttons: buttons,
    columns: columns,
    style: {
      overflow: 'auto'
    }
  }));
};
export default formatterCollections({
  code: ['hmde.common', 'hmde.bo']
})(observer(App));