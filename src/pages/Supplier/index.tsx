import React, { Fragment, useMemo, useState } from 'react';
import { Button, CheckBox, DataSet, Form, Select, Spin, Table, TextField } from 'choerodon-ui/pro';
import { flow } from 'lodash';
import { Content, Header } from 'components/Page';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { useDataSet } from 'utils/hooks';
import { filterNullValueObject, getCurrentOrganizationId } from 'utils/utils';
import notification from 'utils/notification';
import ExcelExport from 'components/ExcelExport';
import withCustomize from 'hzero-front-cusz/lib/components/Customize';
import { ListDS } from './stores/indexDS';
import styles from './index.less';
import { TableAutoHeightType, TableQueryBarType } from 'choerodon-ui/pro/lib/table/enum';
import { ColumnProps } from 'choerodon-ui/pro/lib/table/Column';
import { compose } from '@/utils/util';
import withProps from 'utils/withProps';
import { ListDSConfig } from '@/pages/PurchaseOrder/stores/indexDS';
import { observer } from 'mobx-react';
import { ListProps } from '@/typings';
import { ButtonColor } from 'choerodon-ui/pro/lib/button/enum';

const intlPrefix = 'srm.supplier';
const organizationId = getCurrentOrganizationId();
const permissionCode = 'hzero.mdm.supplier.ps.button';

function Supplier(props: ListProps) {
  const listDS = useDataSet(() => new DataSet(ListDS()), ['Supplier']);
  const [pageLoading, setPageLoading] = useState(false);
  const [exportAuth, setExportAuth] = useState(false);


  /**
   * 查询
   */
  async function handleQuery() {
    const validateValue = await listDS.queryDataSet?.validate();
    if (!validateValue) return;
    return await listDS.query();
  }

  function handleReset() {
    listDS.queryDataSet?.reset();
  }

  const columns = useMemo((): Array<ColumnProps> => {
    return [
      {
        name: 'supplierCode',
      },
      {
        name: 'supplierName',
      },
      {
        name: 'supplierShortName',
      },
      {
        name: 'unifiedSocialCode',
      },
      {
        name: 'supplierType',
      },
      {
        name: 'supplierLevel',
      },
      {
        name: 'enabledFlag',
      },
      {
        name: 'creationDate',
      },
      {
        name: 'createdByName',
      },
      {
        name: 'lastUpdateDate',
      },
      {
        name: 'lastUpdatedByName',
      },
    ];
  }, []);

  // 获取导出字段查询参数
  function getExportQueryParams() {
    const queryDataDs =
      listDS && listDS.queryDataSet && listDS.queryDataSet.current;
    const queryDataDsValue = queryDataDs
      ? filterNullValueObject(queryDataDs.toData())
      : {};
    return filterNullValueObject({
      ...queryDataDsValue,
    });
  }

  return (
    <Fragment>
      <Spin spinning={pageLoading}>
        <Header title={intl.get(`${intlPrefix}.view.supplier`).d('供应商')}>
          {exportAuth && (
            <ExcelExport
              requestUrl={`/hscm/v1/${organizationId}/suppliers/export`}
              method="GET"
              queryParams={getExportQueryParams}
              defaultSelectAll
            />
          )}
        </Header>
        <Content className={styles['supplier-content']}>
          {/*<div className={styles['search-content']}>*/}
          {/*  <div className={styles['search-condition']}>*/}
          {/*    <Form*/}
          {/*      dataSet={listDS.queryDataSet}*/}
          {/*      columns={4}*/}
          {/*      labelLayout="horizontal"*/}
          {/*    >*/}
          {/*      <TextField name="supplierCode" key="supplierCode" />*/}
          {/*      <TextField name="supplierName" key="supplierName" />*/}
          {/*      <TextField name="supplierShortName" key="supplierShortName" />*/}
          {/*      <Select name="enabledFlag" key="enabledFlag" />*/}
          {/*    </Form>*/}
          {/*  </div>*/}
          {/*  <div className={styles['search-btn']}>*/}
          {/*    <div className={styles.btns}>*/}
          {/*      <Button onClick={handleReset}>重置</Button>*/}
          {/*      <Button color={ButtonColor.primary} onClick={handleQuery}>*/}
          {/*        查询*/}
          {/*      </Button>*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*</div>*/}
          <div style={{ height: 'calc(100vh - 220px)' }}>
            <Table
              border
              virtual
              virtualCell
              dataSet={listDS} //数据配     置
              columns={columns} //展示列
              queryBar={TableQueryBarType.filterBar} //normal, bar, none, advancedBar, professionalBar, filterBar, comboBar 不同效果
              queryBarProps={{
                queryFieldsLimit: 3,
                fuzzyQueryPlaceholder: intl
                  .get(`${intlPrefix}.view.supplierCode`)
                  .d('模糊筛选...'),
                dynamicFilterBar: {
                  searchText: 'condition_key',
                },
              }} //filterBar 公共框设置?
              autoHeight={{ type: TableAutoHeightType.maxHeight, diff: 33 }}
            />
          </div>
        </Content>
      </Spin>
    </Fragment>
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
)(Supplier);
