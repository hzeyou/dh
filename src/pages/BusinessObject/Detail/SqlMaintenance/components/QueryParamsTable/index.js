import _CheckBox from "@hzero-front-ui/c7n-ui/lib/CheckBoxPro";
import _Select from "@hzero-front-ui/c7n-ui/lib/SelectPro";
import _Table from "@hzero-front-ui/c7n-ui/lib/TablePro";
import React from 'react';
import { observer } from 'mobx-react-lite';
import intl from 'utils/intl';
import { operatorRender } from 'utils/renderer';
import { ApiParamType } from "hzero-front-hmde/lib/constants/businessObject";
import { SQL_SOURCE_TYPE, SQL_PARAMS_FN } from "../../datasets/sqlParamsDS";
import { filerQueryParamsTypes } from "../../utils/common";
const Column = _Table.Column;
const QueryParamsTable = ({
  sqlQueryParamsDs,
  disabled
}) => {
  const handleOperate = record => {
    let OperatorKey = /*#__PURE__*/function (OperatorKey) {
      OperatorKey["delete"] = "delete";
      return OperatorKey;
    }({});
    const handleDelete = () => {
      sqlQueryParamsDs.remove(record);
    };
    const operatorsMap = {
      [OperatorKey.delete]: {
        key: OperatorKey.delete,
        ele: /*#__PURE__*/React.createElement("a", {
          onClick: handleDelete
        }, intl.get('hzero.common.button.delete').d('删除')),
        len: 2
      }
    };
    const operatorArray = [OperatorKey.delete];
    const operators = operatorArray.map(key => operatorsMap[key]);
    return operatorRender(operators, record, {
      limit: 3
    });
  };
  return /*#__PURE__*/React.createElement(_Table, {
    dataSet: sqlQueryParamsDs
  }, /*#__PURE__*/React.createElement(Column, {
    name: SQL_PARAMS_FN.CODE,
    editor: record => {
      if (disabled) {
        return false;
      }
      return record.get(SQL_PARAMS_FN.SOURCE_TYPE) === SQL_SOURCE_TYPE.CUSTOM;
    },
    header: intl.get('hmde.common.diyParamName').d('自定义参数名称')
  }), /*#__PURE__*/React.createElement(Column, {
    name: SQL_PARAMS_FN.TYPE,
    editor: () => {
      if (disabled) {
        return false;
      }
      return /*#__PURE__*/React.createElement(_Select, {
        name: SQL_PARAMS_FN.TYPE,
        optionsFilter: filerQueryParamsTypes
      });
    }
  }), /*#__PURE__*/React.createElement(Column, {
    name: SQL_PARAMS_FN.NAME,
    editor: !disabled
  }), /*#__PURE__*/React.createElement(Column, {
    name: SQL_PARAMS_FN.MAX_LENGTH,
    editor: record => {
      if (disabled) {
        return false;
      }
      const dataType = record.get(SQL_PARAMS_FN.TYPE);
      return dataType === ApiParamType.String;
    }
  }), /*#__PURE__*/React.createElement(Column, {
    name: SQL_PARAMS_FN.DECIMAL_DIGITS,
    editor: record => {
      if (disabled) {
        return false;
      }
      const dataType = record.get(SQL_PARAMS_FN.TYPE);
      return dataType === ApiParamType.BigDecimal;
    }
  }), /*#__PURE__*/React.createElement(Column, {
    name: SQL_PARAMS_FN.ENCRYPT_FLAG,
    renderer: ({
      record
    }) => {
      if (disabled) {
        return false;
      }
      if (!record) return null;
      const dataType = record.get(SQL_PARAMS_FN.TYPE);
      if (dataType === ApiParamType.Long) {
        return /*#__PURE__*/React.createElement(_CheckBox, {
          record: record,
          name: SQL_PARAMS_FN.ENCRYPT_FLAG
        });
      }
      return null;
    }
  }), /*#__PURE__*/React.createElement(Column, {
    header: intl.get('hzero.common.action').d('操作'),
    hidden: disabled,
    renderer: ({
      record
    }) => {
      return record && handleOperate(record);
    }
  }));
};
export default observer(QueryParamsTable);