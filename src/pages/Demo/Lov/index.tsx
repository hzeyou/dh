import React from 'react';
import lovDS from '../stores/lovDS';
import {Col, DataSet, Form, Lov, Row} from 'choerodon-ui/pro';
import formatterCollections from 'utils/intl/formatterCollections';
import {LabelLayout} from 'choerodon-ui/pro/es/form/enum';


function App() {

  const lovDataSet = new DataSet(lovDS);

  return (
    <Row gutter={10}>
      <Col span={12}>
        <Form dataSet={lovDataSet} labelLayout={LabelLayout.horizontal}>
          <Lov name="code" tableProps={{queryFieldsLimit: 100}}/>
        </Form>

      </Col>
      {/*<Col span={12}>
        <Lov dataSet={lovDataSet} name="code_string" />
      </Col>*/}
    </Row>
  );

}

export default formatterCollections({
  code: ['select.common'],
})(App);
