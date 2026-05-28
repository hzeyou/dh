import React from 'react';
import {
  CheckBox,
  DataSet,
  Form,
  Select,
  Spin,
  TextField,
} from 'choerodon-ui/pro';
import { Record } from 'choerodon-ui/dataset';
import { Divider } from 'choerodon-ui';
import { observer } from 'mobx-react';

import intl from 'utils/intl';

import { openModalHelper } from '@/utils/modalHelper';
import { detailDSConf } from '../../stores/detailDS';

interface OpenSupplierTypeModalProps {
  record?: Record | null;
  onSubmit?: () => void;
}

interface SupplierTypeModalProps {
  dataSet: DataSet;
}

function SupplierTypeModal(props: SupplierTypeModalProps) {
  const { dataSet } = props;
  const showRegisterAuditRule =
    dataSet.current?.get('registrationReview') === 1;
  const showZiZhiAuditRule = dataSet.current?.get('certificate') === 1;

  return (
    <Spin dataSet={dataSet}>
      <Form dataSet={dataSet} columns={1} labelWidth={120}>
        <TextField name="sapCode" />
        <TextField name="typeName" />
        <Select name="status" />
      </Form>
      <Divider orientation="left">
        {intl
          .get('srm.supplier.view.title.admissionRuleConfig')
          .d('准入规则配置')}
      </Divider>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div>
          <CheckBox dataSet={dataSet} name="registrationReview">
            {intl
              .get('srm.supplier.model.supplier.registration_review')
              .d('注册审核')}
          </CheckBox>
          {showRegisterAuditRule && (
            <Select
              dataSet={dataSet}
              name="registrationReviewType"
              searchable
            />
          )}
        </div>
        <div>
          <CheckBox dataSet={dataSet} name="certificate">
            {intl.get('srm.supplier.model.supplier.certificate').d('资质证书')}
          </CheckBox>
          {showZiZhiAuditRule && (
            <Select dataSet={dataSet} name="requiredCertificateType" />
          )}
        </div>
        <div>
          <CheckBox dataSet={dataSet} name="agreement">
            {intl.get('srm.supplier.model.supplier.agreement').d('协议管理')}
          </CheckBox>
        </div>
        <div>
          <CheckBox dataSet={dataSet} name="onsiteAudit">
            {intl.get('srm.supplier.model.supplier.onsite_audit').d('现场审核')}
          </CheckBox>
        </div>
      </div>
    </Spin>
  );
}

const SupplierTypeModalContent = observer(SupplierTypeModal);

export default function open(options?: OpenSupplierTypeModalProps) {
  const { record, onSubmit } = options || {};
  const dataSet = new DataSet(detailDSConf());
  const isCreate = !record;
  const supplierId =
    record?.get('typeId') ||
    record?.get('supplierId') ||
    record?.get('vendorTypeId') ||
    record?.get('id');

  dataSet.setState('supplierId', isCreate ? 'create' : supplierId);

  if (record) {
    dataSet.loadData([record.toJSONData()]);
  } else if (!dataSet.current) {
    dataSet.create({}, 0);
  }

  async function handleSave() {
    const valid = await dataSet.current?.validate(true);
    if (!valid) return false;

    const res = await dataSet.submit();
    if (res === false) return false;

    if (onSubmit) {
      onSubmit();
    }

    return true;
  }

  return openModalHelper({
    title: isCreate
      ? intl.get('hzero.common.button.create').d('新建')
      : intl.get('hzero.common.button.edit').d('编辑'),
    content: SupplierTypeModalContent,
    drawer: false,
    data: { dataSet },
    onOk: handleSave,
  });
}
