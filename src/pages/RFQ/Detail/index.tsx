import {compose, LovSyncTable} from '@/utils/util';
import formatterCollections from 'utils/intl/formatterCollections';
import { observer } from 'mobx-react';
import { Header, Content } from 'components/Page';
import RichTextEditor from 'components/RichTextEditor';
import { DetailProps } from '@/typings';
import {
  Button,
  DataSet, DatePicker,
  Form, Select, TextField, TextArea, Icon, Upload, Table, RichText, Lov, AutoComplete,
} from 'choerodon-ui/pro';
import { ButtonColor, FuncType } from 'choerodon-ui/pro/lib/button/enum';
import {filterNullValueObject, getCurrentOrganizationId, intl} from 'utils/utils';
import React, { useMemo } from 'react';
import { ColumnProps } from 'choerodon-ui/pro/lib/table/Column';
import { DetailDSConfig } from '@/pages/RFQ/stores/detailDS';
import { DetailDSConfig as BomDSConfig } from '@/pages/RFQ/stores/bomDS';
import { SupplierDSConfig } from '@/pages/RFQ/stores/supplierDS';
import ScrollTabs from '@/components/ScrollTabs';
import PermissionButton from 'components/Permission/Button';

import ExcelExportPro from 'components/ExcelExportPro';
import { ColumnLock, TableButtonType, TableQueryBarType } from 'choerodon-ui/pro/lib/table/enum';
import { ViewMode } from 'choerodon-ui/pro/lib/lov/enum';
import notification from 'utils/notification';
import { FieldIgnore, FieldType } from 'choerodon-ui/dataset/data-set/enum';
import styles from './index.less';
import { LovSupplierDSConfig } from '@/pages/RFQ/stores/lovSupplierDS';

const intlPrefix = 'srm.rfq';

function Page(props: DetailProps) {
  const id = props.match.params.id;

  const [detailDS, bomDS, supplierDS, lovSupplierDS] = useMemo(() => {
    const _detailDS = new DataSet(DetailDSConfig());
    const _bomDS = new DataSet(BomDSConfig());
    const _supplierDS = new DataSet(SupplierDSConfig());
    const _lovSupplierDS = new DataSet(LovSupplierDSConfig());
    _supplierDS.setState('lovDS', _lovSupplierDS);
    _lovSupplierDS.setState('tableDS', _supplierDS);

    if (id) {
      _detailDS.query(undefined, { id });
    } else {
      detailDS?.current?.set('dirty', false);
    }
    return [_detailDS, _bomDS, _supplierDS, _lovSupplierDS];
  }, []);

  const bomColumns: ColumnProps[] = useMemo(() => [
    // renderer: ({ record }) => record?.get('material_code') || '-'
    { name: 'material_code', width: 150,  },
    { name: 'material_name', width: 150, editor: true, },
    { name: 'spec_description', width: 250, editor: true, },
    { name: 'pricing_unit', width: 100 },
    { name: 'demand_quantity', width: 100 },
    { name: 'cost_structure', width: 200, renderer: ({record}) => {
      if (!record) return;
      // 设置查询参数
      record?.getField('cost_struct_code')?.set('lovPara', {a: 1});
      return (
        <Lov
          clearButton={false}
          record={record}
          name="cost_struct_code"
          mode={ViewMode.button}
        >
          使用
        </Lov>
      );
    },
    },
    { name: 'cost_structure_total', width: 130 },
    { name: 'bom_version', width: 100 },
    { name: 'bom_quotation', width: 120, renderer: ({record}) => {
      if (!record) return;
      return (
        <Lov
          clearButton={false}
          record={record}
          name="cost_struct_code"
          mode={ViewMode.button}
        >
            使用
        </Lov>
      );
    },
    },
    { name: 'bom_total_price', width: 120 },
    { name: 'inquiry_remark', width: 200 },
    { name: 'inquiry_attachment', width: 150 },
    { name: 'latest_quotation', width: 130 },
    { name: 'lowest_historical_quotation', width: 130 },
  ], []);

  const supplierColumns: ColumnProps[] = useMemo(() => [
    { name: 'supplier_code', width: 150 },
    { name: 'supplier_name' },
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

  console.log('detailDS==', detailDS?.dirty);
  console.log('bomDS==', bomDS);
  console.log('supplierDS.toData==', supplierDS.toData());

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
                accept={['jpg', 'jpeg', 'png']}
                name="attachment"
                action={'/kpi-board-import-datas/import'}
                extra={<div>请上传图片文件(jpg, jpeg, png...)</div>}
              >
              </Upload>

            </Form>
          </ScrollTabs.ScrollTab>
          <ScrollTabs.ScrollTab tab="id2" label={intl.get('srm.rfq.view.tab.kpi').d('物料明细')}>
            <Table key="bom" dataSet={bomDS} columns={bomColumns} buttons={[
              <PermissionButton
                key="btn-1"
                type="c7n-pro"
                // permissionList={[{ code: 'hzero.pts.execution-rate.work-order.ps.button.import' }]}
              >
                <Lov
                  dataSet={bomDS}
                  name="bom_main_code"
                  clearButton={false}
                  mode={ViewMode.button}
                >
                来源物料主数据
                </Lov>
              </PermissionButton>,
              <PermissionButton
                key="btn-2"
                onClick={(event) => bomDS.create({}, 0)}
                type="c7n-pro"
                // permissionList={[{ code: 'hzero.pts.execution-rate.work-order.ps.button.import' }]}
              >
                来源临时物料
              </PermissionButton>,
              <PermissionButton
                key="btn-3"
                type="c7n-pro"
                // permissionList={[{ code: 'hzero.pts.execution-rate.work-order.ps.button.import' }]}
              >
                <Lov
                  dataSet={bomDS}
                  name="cost_struct_code"
                  clearButton={false}
                  mode={ViewMode.button}
                  onClick={(event) => {
                    if (!bomDS.selected.length) {
                      notification.error({ message: '请至少选择一条明细！' });
                      event.preventDefault();
                    }
                  }}
                >
                  引入成本结构
                </Lov>
              </PermissionButton>,
              <PermissionButton
                key="add-4"
                type="c7n-pro"
                // permissionList={[{ code: 'hzero.pts.execution-rate.work-order.ps.button.import' }]}
              >
                <Lov
                  dataSet={bomDS}
                  tableProps={{
                    queryFieldsLimit: 2,
                    queryFields: {
                      supplierCode: (<div>123</div>)
                    },
                  }}
                  name="cost_struct_code"
                  clearButton={false}
                  mode={ViewMode.button}
                  onClick={(event) => {
                    if (!bomDS.selected.length) {
                      notification.error({ message: '请至少选择一条明细！' });
                      event.preventDefault();
                    }
                  }}
                >
                  引入BOM
                </Lov>
              </PermissionButton>,
              <PermissionButton
                key="btn-5"
                disabled={!bomDS.selected.length}
                onClick={(event) => {
                  bomDS.delete(bomDS.selected);
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
            <Table queryBar={TableQueryBarType.filterBar} dataSet={supplierDS} columns={supplierColumns} buttons={[
              <PermissionButton
                key="btn-1"
                type="text"
                // permissionList={[{ code: 'hzero.pts.execution-rate.work-order.ps.button.import' }]}
              >
                <Lov
                  dataSet={lovSupplierDS}
                  name="lov_supplier_code"
                  clearButton={false}
                  mode={ViewMode.button}
                  funcType={FuncType.flat}
                  onChange={(value) => {
                    LovSyncTable.add(supplierDS, lovSupplierDS, 'lov_supplier_code', 'supplierId');
                    // LovSyncTable.add(value, supplierDS, 'lov_supplier_code');
                  }}
                >
                  选择供应商
                </Lov>
              </PermissionButton>,
              <PermissionButton
                key="btn-2"
                onClick={async (event) => {
                  if (!supplierDS.selected.length) {
                    notification.error({ message: '请至少选择一条明细！' });
                    return;
                  }
                  await supplierDS.delete(supplierDS.selected);
                }}
                type="c7n-pro"
                // permissionList={[{ code: 'hzero.pts.execution-rate.work-order.ps.button.import' }]}
              >
                删除
              </PermissionButton>,
            ]} />
          </ScrollTabs.ScrollTab>
          <ScrollTabs.ScrollTab tab="id4" label={intl.get('srm.rfq.view.tab.kpi').d('询价要求')}>
            <Form dataSet={detailDS} columns={4}>
              <RichTextEditor colSpan={4} name="inquiry_requirement" />
            </Form>
          </ScrollTabs.ScrollTab>
          <ScrollTabs.ScrollTab tab="id5" label={intl.get('srm.rfq.view.tab.kpi').d('询价公告')}>
            <div className={styles['hidden-label']}>
              <Form dataSet={detailDS} columns={4}>
                <Form.Item label="" labelWidth={0} colSpan={4}>
                  <TextField name="announcement_title"  />
                </Form.Item>
                <Form.Item label="" labelWidth={0} colSpan={4}>
                  <RichTextEditor name="announcement_content" />
                </Form.Item>
                <Upload
                  colSpan={4}
                  name="announcement_attachment"
                  action={'/kpi-board-import-datas/import'}
                  extra={<div>请上传图片文件(jpg, jpeg, png...)</div>}
                >
                </Upload>
              </Form>
            </div>
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
