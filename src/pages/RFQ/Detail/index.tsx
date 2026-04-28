import { compose } from '@/utils/util';
import formatterCollections from 'utils/intl/formatterCollections';
import { observer } from 'mobx-react';
import { Header, Content } from 'components/Page';
import { DetailProps } from '@/typings';
import {
  Button,
  DataSet, DatePicker,
  Form, Select, TextField, TextArea, Icon, Upload, Table,
} from 'choerodon-ui/pro';
import { ButtonColor } from 'choerodon-ui/pro/lib/button/enum';
import {filterNullValueObject, getCurrentOrganizationId, intl} from 'utils/utils';
import React, { useMemo } from 'react';
import { ColumnProps } from 'choerodon-ui/pro/lib/table/Column';
import { DetailDSConfig } from '@/pages/RFQ/stores/detailDS';
import { DetailDSConfig as BomDSConfig } from '@/pages/RFQ/stores/bomDS';
import { SupplierDSConfig } from '@/pages/RFQ/stores/supplierDS';
import ScrollTabs from '@/components/ScrollTabs';
import PermissionButton from 'components/Permission/Button';

import styles from './index.less';
import ExcelExportPro from 'components/ExcelExportPro';

const intlPrefix = 'srm.rfq';

function Page(props: DetailProps) {
  const id = props.match.params.id;

  const [detailDS, bomDS, supplierDS] = useMemo(() => {
    const _detailDS = new DataSet(DetailDSConfig());
    const _bomDS = new DataSet(BomDSConfig());
    const _supplierDS = new DataSet(SupplierDSConfig());
    if (id) {
      _detailDS.query(undefined, { id });
      _bomDS.query();
    } else {
      detailDS?.current?.set('dirty', false);
    }
    return [_detailDS, _bomDS, _supplierDS];
  }, []);

  const bomColumns: ColumnProps[] = useMemo(() => [
    { name: 'material_code', width: 150 },
    { name: 'material_name', width: 150 },
    { name: 'spec_description', width: 250 },
    { name: 'pricing_unit', width: 100 },
    { name: 'demand_quantity', width: 100 },
    { name: 'cost_structure', width: 200 },
    { name: 'cost_structure_total', width: 130 },
    { name: 'bom_version', width: 100 },
    { name: 'bom_quotation', width: 120 },
    { name: 'bom_total_price', width: 120 },
    { name: 'inquiry_remark', width: 200 },
    { name: 'inquiry_attachment', width: 150 },
    { name: 'latest_quotation', width: 130 },
    { name: 'lowest_historical_quotation', width: 130 },
  ], []);

  const supplierColumns: ColumnProps[] = useMemo(() => [
    { name: 'supplier_code', width: 150 },
    { name: 'supplier_name', width: 200 },
    { name: 'supplier_status', width: 120 },
    { name: 'buyer', width: 150 },
    { name: 'payment_terms', width: 150 },
    { name: 'payment_method', width: 150 },
  ], []);

  const handleSave = async () => {
    const res = await detailDS.submit();
    if (res?.success) {
      detailDS?.current?.commit();
      detailDS?.current?.setState('isSubmit', 1);
    }
  };

  const handleDelete = async () => {
    const res = await detailDS.delete(
      detailDS.current,
      intl.get('srm.demo.list.delete.single').d('是否确认删除？')
    );
    if (res === false) return;
    history.back();
  };

  function getExportQueryParams() {
    // 勾选导出
    if (bomDS.selected.length > 0) {
      return {
        actionHeaderIds: bomDS.selected.map((record) => record.get('actionHeaderId')).join(','),
        needPerControl: '1',
      };
    }

    // 参数导出
    const formData = bomDS.queryDataSet?.current?.toJSONData() || {};

    console.log('formData==', formData);

    return filterNullValueObject({
      ...formData,
      actionDesc: bomDS.getQueryParameter('actionDesc'),
      needPerControl: '1',
    });
  }

  return (
    <>
      <Header
        title={intl.get(`${intlPrefix}.detail.title`).d('新建询报价')}
        backPath="/srm/rfq/list"
        stateData={{ status: detailDS?.current?.getState('isSubmit') }}
        isChange={detailDS?.dirty}
      >
        <Button icon="save" onClick={handleSave} color={ButtonColor.primary}>
          {intl.get('hzero.common.button.save').d('保存')}
        </Button>
        <Button icon="delete" onClick={handleDelete}>
          {intl.get('hzero.common.button.delete').d('删除')}
        </Button>
      </Header>
      <Content className={styles['rfq-detail-content']}>

        <ScrollTabs>
          <ScrollTabs.ScrollTab tab="id1" label={intl.get('srm.rfq.view.tab.kpi').d('基本信息')}>
            <Form dataSet={detailDS} columns={4}>
              <Select name="business_type" />
              <Select name="company" />
              <Select name="purchaser" />
              <Select name="rfq_type" />
              <Select name="rfq_method" />
              <Select name="category" />
              <Select name="quotation_currency" />
              <Select name="quotation_tax" />
              <Select name="tax_rate" />
              <DatePicker name="inquiry_stop_date" />
              <DatePicker name="price_start_date" />
              <DatePicker name="price_stop_date" />
              <Select name="seal_control" />
              <Select name="purchasing_group" />
              <Select name="product_manager_approved_by" />
              <Select name="procurement_cc" />
              <Select name="product_line" />
              <Select name="project_number" />
              <Select name="project_mode" />
              <TextField name="inquiry_title" />
              <TextArea name="remarks" colSpan={4} />
              <Upload
                colSpan={4}
                name="attachment"
                action={`/kpi-board-import-datas/import`}
                extra={<p>请上传图片文件(jpg, jpeg, png...)</p>}
              >
              </Upload>

            </Form>
          </ScrollTabs.ScrollTab>
          <ScrollTabs.ScrollTab tab="id2" label={intl.get('srm.rfq.view.tab.kpi').d('物料明细')}>
            <Table key="user" pristine dataSet={bomDS} columns={bomColumns} buttons={[
              <PermissionButton
                key="btn-1"
                disabled={!bomDS.selected.length}
                onClick={(event) => {
                  bomDS['delete'](bomDS.selected);
                }}
                type="c7n-pro"
                // permissionList={[{ code: 'hzero.pts.execution-rate.work-order.ps.button.import' }]}
              >
                来源物料主数据
              </PermissionButton>,
              <PermissionButton
                key="btn-2"
                disabled={!bomDS.selected.length}
                onClick={(event) => {
                  bomDS['delete'](bomDS.selected);
                }}
                type="c7n-pro"
                // permissionList={[{ code: 'hzero.pts.execution-rate.work-order.ps.button.import' }]}
              >
                来源临时物料
              </PermissionButton>,
              <PermissionButton
                key="btn-3"
                disabled={!bomDS.selected.length}
                onClick={(event) => {
                  bomDS['delete'](bomDS.selected);
                }}
                type="c7n-pro"
                // permissionList={[{ code: 'hzero.pts.execution-rate.work-order.ps.button.import' }]}
              >
                引入成本结构
              </PermissionButton>,
              <PermissionButton
                key="add-4"
                disabled={!bomDS.selected.length}
                onClick={(event) => {
                  bomDS['delete'](bomDS.selected);
                }}
                type="c7n-pro"
                // permissionList={[{ code: 'hzero.pts.execution-rate.work-order.ps.button.import' }]}
              >
                引入BOM
              </PermissionButton>,
              <PermissionButton
                key="btn-5"
                disabled={!bomDS.selected.length}
                onClick={(event) => {
                  bomDS['delete'](bomDS.selected);
                }}
                type="c7n-pro"
                // permissionList={[{ code: 'hzero.pts.execution-rate.work-order.ps.button.import' }]}
              >
                删除
              </PermissionButton>,
              <ExcelExportPro
                key="btn-6"
                defaultSelectAll
                requestUrl={`/hpts/v1/${getCurrentOrganizationId()}/action-headers/export`}
                queryParams={getExportQueryParams}
                modalProps={{closable: true}}
                exportAsync
              />,
            ]} />
          </ScrollTabs.ScrollTab>
          <ScrollTabs.ScrollTab tab="id3" label={intl.get('srm.rfq.view.tab.kpi').d('供应商信息')}>
            <Table dataSet={supplierDS} columns={supplierColumns} buttons={[
              <PermissionButton
                key="btn-1"
                disabled={!bomDS.selected.length}
                onClick={(event) => {
                  bomDS['delete'](bomDS.selected);
                }}
                type="c7n-pro"
                // permissionList={[{ code: 'hzero.pts.execution-rate.work-order.ps.button.import' }]}
              >
                选择供应商
              </PermissionButton>,
              <PermissionButton
                key="btn-2"
                disabled={!bomDS.selected.length}
                onClick={(event) => {
                  bomDS['delete'](bomDS.selected);
                }}
                type="c7n-pro"
                // permissionList={[{ code: 'hzero.pts.execution-rate.work-order.ps.button.import' }]}
              >
                删除
              </PermissionButton>,
            ]} />
          </ScrollTabs.ScrollTab>
          <ScrollTabs.ScrollTab tab="id4" label={intl.get('srm.rfq.view.tab.kpi').d('询价要求')}>
            <div style={{ height: '500px' }} />
          </ScrollTabs.ScrollTab>
        </ScrollTabs>
      </Content>
    </>
  );
}

export default compose(
  formatterCollections({
    code: [intlPrefix],
  }),
  observer
)(Page);
