import _Table from "@hzero-front-ui/c7n-ui/lib/TablePro";
import React from 'react';
import formatterCollections from 'utils/intl/formatterCollections';
import { observer } from 'mobx-react-lite';
import { TableQueryBarType } from 'choerodon-ui/pro/lib/table/enum';
import { WHO_FIELD_DS } from "hzero-front-hmde/lib/stores/BusinessObject/BusinessObjectDS";
const App = ({
  ds
}) => {
  const columns = [{
    name: WHO_FIELD_DS.name
  }, {
    name: WHO_FIELD_DS.code
  }, {
    name: WHO_FIELD_DS.type
  }, {
    name: WHO_FIELD_DS.extends
  }];
  return /*#__PURE__*/React.createElement(_Table, {
    dataSet: ds,
    queryBar: "none",
    columns: columns
  });
};
export default formatterCollections({
  code: ['hmde.common', 'hmde.bo']
})(observer(App));