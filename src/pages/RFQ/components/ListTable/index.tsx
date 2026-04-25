import {TableButtonType, TableQueryBarType} from 'choerodon-ui/pro/lib/table/enum';
import {Table} from 'choerodon-ui/pro';
import React from 'react';
import {observer} from 'mobx-react';


const intlPrefix = 'srm.rfq';

function ListTable({dataSet, columns} : any) {
  return (
    <Table
      dataSet={dataSet}
      columns={columns}
      queryBar={TableQueryBarType.professionalBar}
      queryBarProps={{ queryFieldsLimit: 4, }}
    />
  );

}


export default observer(ListTable);
