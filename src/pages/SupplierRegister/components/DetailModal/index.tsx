import React, { useMemo } from 'react';
import {
  AutoComplete,
  CheckBox,
  DataSet,
  EmailField,
  Form,
  NumberField,
  Output,
  Select,
  SelectBox,
  Spin,
  TextField,
} from 'choerodon-ui/pro';

import intl from 'utils/intl';

import { openModalHelper } from '@/utils/modalHelper';
import { detailDSConf } from '../../stores/detailDS';
import { useEmailAutoComplete } from '@/hooks/useEmailAutoComplete';

function DetailModal({ id, modal, onSubmit }: any) {

  const detailDS = useMemo(() => {
    const _detailDS = new DataSet(detailDSConf());
    if (id) {
      _detailDS.query(undefined, { id });
    } else {
      detailDS?.current?.set('dirty', false);
    }
    return _detailDS;
  }, []);

  const handleSave = async () => {
    const vRes = await detailDS.validate();
    if (vRes) {
      const res = await detailDS.submit();
      if (res?.success) {
        detailDS?.current?.commit();
        detailDS?.current?.setState('isSubmit', 1);
        onSubmit();
      }
    }
    return vRes;
  };

  modal.handleOk(handleSave);

  const isReadOnly = false;

  return (
    <>
      <Form dataSet={detailDS} columns={1}>
        {isReadOnly ? (
          <>
            <Output name="supplierName" />
            <Output name="typeId" />
            <Output name="email" />
            <Output name="level" />
            <Output name="level" />
            <Output name="remark" />
            <Output name="accountCreatedFlag" />
          </>
        ) : (
          <>
            <TextField name="supplierName" />
            <Select name="typeId" />
            <EmailField name="email" />
            <Select name="level" />
            <TextField name="remark" />
            <Select name="accountCreatedFlag" />
          </>
        )}
      </Form>
    </>
  );
}

export default function open(options?: any) {
  return openModalHelper({
    title: options?.id ? '编辑' : '新建',
    content: DetailModal,
    drawer: false,
    ...options,
  });
}
