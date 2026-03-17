import React, {useCallback} from 'react';
import selectDS from '../stores/selectDS';
import {DataSet, Select, Row, Col, Button} from 'choerodon-ui/pro';
import formatterCollections from 'utils/intl/formatterCollections';
import {DataSetSelection, FieldType} from 'choerodon-ui/dataset/data-set/enum';


function App() {

  const selectDataSet = new DataSet(selectDS);

  const changeOptions = useCallback(() => {
    selectDataSet.addField('account', {
      name: 'account',
      type: FieldType.string,
      label: '账户',
      options: new DataSet({
        selection: DataSetSelection.single,
        data: [
          {
            'meaning': '用户1',
            'value': '1',
          },
          {
            'meaning': '用户2',
            'value': '2',
          },
          {
            'meaning': '用户3',
            'value': '3',
          }
        ]
      }),
    });
  }, [selectDataSet]);

  return (
    <Row gutter={10}>
      <Col  span={24}>
        <Select
          dataSet={selectDataSet}
          name="sex"
          placeholder="请选择"
        />
      </Col>
      <Col  span={12}>
        <Select
          multiple
          dataSet={selectDataSet}
          name="account"
          placeholder="请选择"
        />
      </Col>
      <Col span={12}>
        <Button onClick={changeOptions}>Account 加载数据</Button>
      </Col>
      <Col  span={8}>
        <Select
          dataSet={selectDataSet}
          name="sheng"
          placeholder="请选择"
        />
      </Col>
      <Col  span={8}>
        <Select
          dataSet={selectDataSet}
          name="shi"
          placeholder="请选择"
        />
      </Col>
      <Col  span={8}>
        <Select
          dataSet={selectDataSet}
          name="street"
          placeholder="请选择"
        />
      </Col>
    </Row>
  );

}

export default formatterCollections({
  code: ['select.common'],
})(App);
