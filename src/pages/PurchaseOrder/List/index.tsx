import React, { useMemo } from 'react';
import { Button, DataSet, Table } from 'choerodon-ui/pro';
import { Content, Header } from 'components/Page';
import intl from 'utils/intl';
import { filterNullValueObject, getCurrentOrganizationId } from 'utils/utils';
import { ListDSConfig } from '../stores/indexDS';
import { ButtonColor } from 'choerodon-ui/pro/lib/button/enum';
import ExcelExportPro from 'components/ExcelExportPro';
import {
  ColumnLock,
  TableAutoHeightType,
  TableQueryBarType,
} from 'choerodon-ui/pro/lib/table/enum';
import { ListProps } from '@/typings';
import formatterCollections from 'utils/intl/formatterCollections';
import withProps from 'utils/withProps';
import { observer } from 'mobx-react';
import { compose } from '@/utils/util';
import { Buttons } from 'choerodon-ui/pro/lib/table/Table';
import { ColumnProps } from 'choerodon-ui/pro/lib/table/Column';

// import ExcelExport from 'components/ExcelExport';

const intlPrefix = 'srm.purchase';
const organizationId = getCurrentOrganizationId();

function PurchaseList(props: ListProps) {
  const { history, listDS } = props;

  const columns = useMemo((): Array<ColumnProps> => {
    return [
      {
        name: 'purchaseCode',
        renderer: ({ record, value }) => {
          return (
            <a
              onClick={() => {
                history.push(
                  `/srm/purchase-order/detail/${record?.get('purchaseId')}`,
                );
              }}
            >
              {value}
            </a>
          );
        },
      },
      {
        name: 'creationDate',
      },
      {
        name: 'createdByName',
      },
      {
        name: 'action',
        header: '操作',
        lock: ColumnLock.right,
        renderer: ({ record }) => {
          return (
            <a
              onClick={() => {
                console.log(record?.toJSONData());
              }}
            >
              操作
            </a>
          );
        },
      },
    ];
  }, []);

  const buttons: Buttons[] = [
    <Button
      key="exportKpi"
      icon="add"
      onClick={() => {
        console.log('test', listDS.selected);
      }}
    >
      {intl.get('hzero.common.button.aa').d('操作按钮')}
    </Button>,
  ];

  const getExportQueryParams = () => {
    // 勾选导出
    if (listDS.selected.length > 0) {
      return {
        actionHeaderIds: listDS.selected
          .map(record => record.get('actionHeaderId'))
          .join(','),
        needPerControl: '1',
      };
    }

    // 参数导出
    const formData = listDS.queryDataSet?.current?.toJSONData() || {};
    return filterNullValueObject({
      ...formData,
      actionDesc: listDS.getQueryParameter('actionDesc'),
      needPerControl: '1',
    });
  };

  return (
    <>
      <Header title={intl.get(`${intlPrefix}.view.purchase`).d('采购单')}>
        <Button
          icon="add"
          color={ButtonColor.primary}
          onClick={() => {
            history.push('/srm/purchase-order/detail/create');
          }}
        >
          {intl.get('hzero.common.button.create').d('新建')}
        </Button>

        <ExcelExportPro
          defaultSelectAll
          requestUrl={`${process.env.SRM_DEV_HOST}/hsrm/v1/${organizationId}/purchase/export`}
          queryParams={getExportQueryParams}
          method={'GET'}
          exportAsync
        />
      </Header>
      <Content>
        <Table
          border
          virtual
          virtualCell
          dataSet={listDS} //数据配     置
          columns={columns} //展示列
          buttons={buttons} //table 右上角按钮
          queryBar={TableQueryBarType.filterBar} //normal, bar, none, advancedBar, professionalBar, filterBar, comboBar 不同效果
          queryBarProps={{
            queryFieldsLimit: 6,
            fuzzyQueryPlaceholder: intl
              .get(`${intlPrefix}.view.purchaseCode`)
              .d('模糊筛选...'),
            dynamicFilterBar: {
              searchText: 'condition_key',
            },
          }} //filterBar 公共框设置?
          autoHeight={{ type: TableAutoHeightType.maxHeight, diff: 33 }}
        />
      </Content>
    </>
  );
}

export default compose(
  formatterCollections({
    code: [`${intlPrefix}`],
  }),
  withProps(() => {
    const listDS = new DataSet(ListDSConfig());
    return {
      listDS,
    };
  }),
  observer,
)(PurchaseList);
