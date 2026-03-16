import React from 'react';
import treeDS from '../stores/treeDS';
import { DataSet, Tree } from 'choerodon-ui/pro';
import {NodeRenderer} from 'choerodon-ui/pro/lib/tree/util';
import formatterCollections from 'utils/intl/formatterCollections';


function App() {

  const treeDataSet = new DataSet(treeDS);

  const renderer:NodeRenderer = ({ record }) => {
    return record?.get('text');
  };

  return (
    <Tree dataSet={treeDataSet}
      checkable
      renderer={renderer}>

    </Tree>
  );

}

export default formatterCollections({
  code: ['tree.common'],
})(App);
