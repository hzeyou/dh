import React from 'react';
import lovDS from '../stores/lovDS';
import {Col, DataSet, Lov, Row} from 'choerodon-ui/pro';
import formatterCollections from 'utils/intl/formatterCollections';
import {SelectionMode} from 'choerodon-ui/pro/lib/table/enum';


function App() {

  const lovDataSet = new DataSet(lovDS);

  return (
    <Row gutter={10}>
      <Col span={12}>
        <Lov dataSet={lovDataSet}
          name="code"
          tableProps={{ selectionMode: SelectionMode.rowbox }}
        />
      </Col>
      <Col span={12}>
        <Lov dataSet={lovDataSet} name="code_string" />
      </Col>
    </Row>
  );

}

export default formatterCollections({
  code: ['select.common'],
})(App);
