import { compose } from '@/utils/util';
import formatterCollections from 'utils/intl/formatterCollections';
import withProps from 'utils/withProps';
import {Button, DataSet, DateTimePicker, Table, Tabs} from 'choerodon-ui/pro';
import { operatorRender } from 'hzero-front/lib/utils/renderer';
import { observer } from 'mobx-react';
import intl from 'utils/intl';
import { Content, Header } from 'components/Page';
import { ListProps } from '@/typings';
import { Record } from 'choerodon-ui/dataset';
import { ColumnProps } from 'choerodon-ui/pro/lib/table/Column';
import {ColumnLock, TableButtonType, TableQueryBarType} from 'choerodon-ui/pro/lib/table/enum';
import { ButtonColor, FuncType } from 'choerodon-ui/pro/lib/button/enum';
import React, { useState } from 'react';
import TitleCom from '@/pages/Demo/Index/TitleCom';
import {AutoComplete} from 'choerodon-ui/pro';
import {FieldType} from 'choerodon-ui/dataset/data-set/enum';
import ExcelExportPro from 'components/ExcelExportPro';
import { filterNullValueObject, getCurrentOrganizationId } from 'utils/utils';
import PermissionButton from 'components/Permission/Button';
import { ListDSConfig } from '../stores/indexDS';
import {useUrlHistory} from 'components/UrlHistoryProvider';
import {useEmailAutoComplete} from '@/hooks/useEmailAutoComplete';
import ListTable from '@/pages/RFQ/components/ListTable';

const intlPrefix = 'srm.rfq';

const Index = (props: ListProps) => {

  // const _useUrlHistory = useUrlHistory();
  // const urlHistory = _useUrlHistory.urlHistory;

  // console.log('urlHistory==', urlHistory);

  const { history, listDS } = props;

  console.log('组件 Index');

  // useEffect(() => {
  //   if (history.action === 'REPLACE' && history.location.state.status === 1) {
  //     listDS.query(listDS.currentPage);
  //   }
  // }, []);

  function toDetail(mode: 'view' | 'edit' | 'delete', record?: Record | null) {
    if (mode === 'view') {
      history.push('/srm/demo/detail');
      return;
    }
    const id = record?.get('id');
    history.push(`/srm/demo/detail/${id}`);
  }

  async function delItem(record) {

    const res = await listDS.delete(record, intl.get('srm.demo.list.delete.single').d('是否确认删除？'));

    // 刷新
    if (res === false) return;

    listDS.query(listDS.currentPage);

  }

  const { emailOptionDS, handleValueChange } = useEmailAutoComplete();

  const columns: Array<ColumnProps> = [
    {
      width: 200,
      name: 'name',
      help: '主键，区分用户',
    },
    {
      width: 200,
      name: 'age',
      sortable: true,
    },
    {
      width: 200,
      name: 'email',
    },
    {
      name: 'action',
      title: intl.get('hzero.common.button.action').d('操作'),
      width: 120,
      lock: ColumnLock.right,
      renderer: ({ record }) => {
        const operators = [
          {
            key: 'edit', // key
            ele: (
              <a onClick={() => toDetail('edit', record)}>
                {intl.get('hzero.common.button.edit').d('编辑')}
              </a>
            ), // 操作栏的按钮
            len: 2, // 该按钮占相应中文数的宽度
            title: intl.get('hzero.common.button.edit').d('编辑'), // 文字提示的显示文本
          },
          {
            key: 'view', // key
            ele: (
              <a onClick={() => toDetail('edit', record)}>
                {intl.get('hzero.common.button.view').d('查看')}
              </a>
            ), // 操作栏的按钮
            len: 2, // 该按钮占相应中文数的宽度
            title: intl.get('hzero.common.button.view').d('查看'), // 文字提示的显示文本
          },
          {
            key: 'delete', // key
            ele: (
              <a onClick={() => delItem(record)}>
                {intl.get('hzero.common.button.delete').d('删除')}
              </a>
            ), // 操作栏的按钮
            len: 2, // 该按钮占相应中文数的宽度
            title: intl.get('hzero.common.button.delete').d('删除'), // 文字提示的显示文本
          },
        ];
        return operatorRender(operators, record, { limit: 3 }); // operatorRender接受三个参数，第一个是操作列数组，第二个是当前行数据，第三个是配置
      },
    },
  ];

  function getExportQueryParams() {
    // 勾选导出
    if (listDS.selected.length > 0) {
      return {
        actionHeaderIds: listDS.selected.map((record) => record.get('actionHeaderId')).join(','),
        needPerControl: '1',
      };
    }

    // 参数导出
    const formData = listDS.queryDataSet?.current?.toJSONData() || {};

    console.log('formData==', formData);

    return filterNullValueObject({
      ...formData,
      actionDesc: listDS.getQueryParameter('actionDesc'),
      needPerControl: '1',
    });
  }

  const [consoleValue, setConsoleValue]:any = useState('');

  const toDataButton = (
    <Button onClick={() => {
      // toData 转换成普通数据，不包含删除的数据
      setConsoleValue(listDS.toData());
      console.log(listDS.toData());
    }}>
      toData
    </Button>
  );

  const toJSONDataButton = (
    <Button onClick={() => {
      // toJSONData 转换成用于提交的 json 数据
      setConsoleValue(listDS.toJSONData());
      console.log(listDS.toJSONData());
    }}>
      toJSONData
    </Button>
  );

  // setQueryParameter 自定义查询参数
  const setQueryParamButton = (
    <Button onClick={() => listDS.setQueryParameter('customPara', 'test')}>
      设置查询参数
    </Button>
  );

  console.log(listDS.selected);

  return (
    <>
      <Header title={intl.get(`${intlPrefix}.view.title`).d('询报价管理')}>
        <ExcelExportPro
          defaultSelectAll
          requestUrl={`/hpts/v1/${getCurrentOrganizationId()}/action-headers/export`}
          queryParams={getExportQueryParams}
          modalProps={{closable: true}}
          exportAsync
        />
        <Button
          icon="save"
          onClick={() => toDetail('view')}
          color={ButtonColor.primary}
        >
          {intl.get('hzero.common.button.add').d('新增')}
        </Button>
      </Header>
      <Content>

        <Tabs defaultActiveKey="kpi">
          <Tabs.TabPane
            tab={intl.get('pts.pbcBoard.view.tab.kpi').d('全部')}
            key="kpi"
            style={{ height: `calc(100vh - 190px})` }}
          >
            <ListTable dataSet={listDS} columns={columns}/>
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={intl.get('pts.pbcBoard.view.tab.task').d('询价中')}
            key="task"
            style={{ height: `calc(100vh - 190px})` }}
          >
            <ListTable dataSet={listDS} columns={columns}/>
          </Tabs.TabPane>
        </Tabs>


      </Content>
    </>
  );

};


export default compose(
  formatterCollections({
    code: [`${intlPrefix}`],
  }),
  withProps(() => {
    const listDS = new DataSet(ListDSConfig());
    return {
      listDS,
    };
  }, {cacheState: false}),  // 不需要缓存
  observer,
)(Index);
