import _Table from "@hzero-front-ui/c7n-ui/lib/TablePro";
import React, { useMemo } from 'react';
import { ColumnAlign, TableQueryBarType } from 'choerodon-ui/pro/lib/table/enum';
import intl from 'utils/intl';
import { observer } from 'mobx-react-lite';
import { batchPublishFN } from "hzero-front-hmde/lib/stores/BusinessObject/BusinessObjectDS";
const Index = ({
  tableDs
}) => {
  const columns = useMemo(() => {
    var _ref;
    return (_ref = [{
      align: "left",
      renderer: ({
        record
      }) => record.index + 1,
      title: intl.get('hmde.bo.businessObject.codeNumber').d('编号'),
      width: 150
    }, {
      name: batchPublishFN.NAME_1,
      align: "left"
    }, {
      name: batchPublishFN.CODE_1,
      align: "left"
    }, {
      name: batchPublishFN.NAME_2,
      align: "left"
    }, {
      name: batchPublishFN.CODE_2,
      align: "left"
    }]) === null || _ref === void 0 ? void 0 : _ref.filter(Boolean);
  }, []);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", {
    style: {
      marginBottom: '5px'
    }
  }, intl.get('hmde.bo.businessObject.cascadePublishListTip').d('以下为即将进行级联发布的对象列表。')), /*#__PURE__*/React.createElement(_Table, {
    dataSet: tableDs,
    columns: columns,
    queryBar: "none"
  }));
};
export default observer(Index);