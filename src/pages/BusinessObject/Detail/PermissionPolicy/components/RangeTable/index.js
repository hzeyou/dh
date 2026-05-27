import _Table from "@hzero-front-ui/c7n-ui/lib/TablePro";
import React, { useMemo } from 'react';
import { FieldsNameTypes } from "hzero-front-hmde/lib/stores/BusinessObject/PermissionDistributeDS";
import { TableMode } from 'choerodon-ui/pro/lib/table/enum';
const RangeTable = ({
  dataSet,
  readOnly
}) => {
  // const permissionDistributeDs = useDataSet(() => new DataSet(PermissionDistributeDs()));

  const columns = useMemo(() => {
    return [{
      name: FieldsNameTypes.NAME
    }, {
      name: FieldsNameTypes.CODE
    }, {
      name: FieldsNameTypes.DEFAULT_GRANTED_FLAG,
      editor() {
        return !readOnly;
      }
    }];
  }, []);
  return /*#__PURE__*/React.createElement(_Table, {
    key: "tenantId",
    mode: "tree",
    dataSet: dataSet,
    columns: columns,
    highLightRow: false
  });
};
export default RangeTable;