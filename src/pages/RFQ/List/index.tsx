import {compose} from '@/utils/util';
import formatterCollections from 'utils/intl/formatterCollections';
import withProps from 'utils/withProps';
import {Button, DataSet, Tabs} from 'choerodon-ui/pro';
import {operatorRender} from 'hzero-front/lib/utils/renderer';
import {observer} from 'mobx-react';
import intl from 'utils/intl';
import {Content, Header} from 'components/Page';
import {ListProps} from '@/typings';
import {Record} from 'choerodon-ui/dataset';
import {ColumnProps} from 'choerodon-ui/pro/lib/table/Column';
import {ColumnLock} from 'choerodon-ui/pro/lib/table/enum';
import {ButtonColor} from 'choerodon-ui/pro/lib/button/enum';
import React from 'react';
import ExcelExportPro from 'components/ExcelExportPro';
import {filterNullValueObject, getCurrentOrganizationId} from 'utils/utils';
import {ListDSConfig} from '../stores/indexDS';
import ListTable from '@/pages/RFQ/components/ListTable';
import RFQMethodChangeModalOpen from '@/pages/RFQ/components/RFQMethodChangeModal';

const intlPrefix = 'srm.rfq';

const Index = (props: ListProps) => {

  const { history, listDS } = props;

  console.log('组件 Index');

  // useEffect(() => {
  //   if (history.action === 'REPLACE' && history.location.state.status === 1) {
  //     listDS.query(listDS.currentPage);
  //   }
  // }, []);

  function toDetail(mode: 'view' | 'edit' | 'delete', record?: Record | null) {
    if (mode === 'view') {
      history.push('/srm/rfq/detail');
      return;
    }
    const id = record?.get('id');
    history.push(`/srm/rfq/detail/${id}`);
  }

  async function delItem(record) {

    const res = await listDS.delete(record, intl.get('srm.demo.list.delete.single').d('是否确认删除？'));

    // 刷新
    if (res === false) return;

    listDS.query(listDS.currentPage);

  }

  const tabList = [
    { label: '全部', value: 'all' },
    { label: '询价中', value: 'inquiry_ing' },
    { label: '询价截止', value: 'inquiry_stop' },
    { label: '议价中', value: 'dicker_ing' },
    { label: '议价截止', value: 'dicker_stop' },
    { label: '定价中', value: 'pricing' },
    { label: '定价完成', value: 'pricing_stop' },
    { label: '询价取消', value: 'inquiry_cancel' },
    { label: '待审批(询价方式变更/重新询价)', value: 'pending' },
    { label: '审批拒绝(询价方式变更/重新询价)', value: 'refuse' },
    { label: '待审批过期(询价方式变更/重新询价)', value: 'expired' },
  ];

  const columns: Array<ColumnProps> = [
    {
      name: 'rfq_number',
      lock: ColumnLock.left,
    },
    {
      name: 'pricing_number',
    },
    {
      name: 'company',
    },
    {
      name: 'business_type',
    },
    {
      name: 'rfq_title',
    },
    {
      name: 'rfq_status',
    },
    {
      name: 'supplier_response_status',
    },
    {
      name: 'rfq_type',
    },
    {
      name: 'action',
      title: intl.get('hzero.common.button.action').d('操作'),
      lock: ColumnLock.right,
      width: 370,
      renderer: ({ record }) => {
        const operators = [
          {
            key: 'action1', // key
            ele: (
              <a onClick={() => toDetail('edit', record)}>
                {intl.get('hzero.common.button.edit1').d('定价')}
              </a>
            ), // 操作栏的按钮
            len: 2,
          },
          {
            key: 'action2', // key
            ele: (
              <a onClick={() => RFQMethodChangeModalOpen({ data: { record, onSubmit: () => listDS.query(listDS.currentPage)}})}>
                {intl.get('hzero.common.button.view1').d('方式变更')}
              </a>
            ),
            len: 4,
          },
          {
            key: 'action3', // key
            ele: (
              <a onClick={() => delItem(record)}>
                {intl.get('hzero.common.button.stop1').d('询价截止')}
              </a>
            ),
            len: 4,
          },
          {
            key: 'action4', // key
            ele: (
              <a onClick={() => delItem(record)}>
                {intl.get('hzero.common.button.delete1').d('邀请供应商')}
              </a>
            ),
            len: 5,
          },
          {
            key: 'action5', // key
            ele: (
              <a onClick={() => delItem(record)}>
                {intl.get('hzero.common.button.time').d('调整时间')}
              </a>
            ),
            len: 4,
          },
          {
            key: 'action6', // key
            ele: (
              <a onClick={() => delItem(record)}>
                {intl.get('hzero.common.button.cac').d('取消')}
              </a>
            ),
            len: 2,
          },
          {
            key: 'action7', // key
            ele: (
              <a onClick={() => delItem(record)}>
                {intl.get('hzero.common.button.rerfq').d('重新询价')}
              </a>
            ),
            len: 4,
          },
          {
            key: 'action8', // key
            ele: (
              <a onClick={() => delItem(record)}>
                {intl.get('hzero.common.button.copy').d('复制')}
              </a>
            ),
            len: 2,
          },
        ];
        return operatorRender(operators, record, { limit: 6 }); // operatorRender接受三个参数，第一个是操作列数组，第二个是当前行数据，第三个是配置
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

  const onChange = async (activeKey: string) => {
    await listDS.query(1, {status: activeKey});
  };



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

        <Tabs defaultActiveKey="all" onChange={onChange}>
          {
            tabList.map(item => (
              <Tabs.TabPane
                tab={intl.get('pts.pbcBoard.view.tab.kpi').d(item.label)}
                key={item.value}
                style={{ height: `calc(100vh - 190px})` }}
              >
              </Tabs.TabPane>
            ))
          }
        </Tabs>

        <ListTable dataSet={listDS} columns={columns}/>


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
