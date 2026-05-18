import React, { useMemo } from 'react';
import {
  AutoComplete,
  CheckBox,
  DataSet, EmailField,
  Form, NumberField, Output,
  Select, SelectBox,
  Spin,
  TextField,
} from 'choerodon-ui/pro';

import intl from 'utils/intl';

import { openModalHelper } from '@/utils/modalHelper';
import { detailDSConf } from '../../stores/detailDS';
import { useEmailAutoComplete } from '@/hooks/useEmailAutoComplete';

function DetailModal({ id, modal, onSubmit }: any) {
  console.log('modal==', modal);

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
            <Output name="name" />
            <Output name="content" />
          </>
        ) : (
          <>
            <TextField name="field1" />
            <TextField name="field2" />
            <EmailField name="field3" />
            <TextField name="field4" />
            <TextField name="field5" />
            <Select name="field6" />
          </>
        )}
      </Form>
    </>
  );
}

export default function open (options?: any) {
  return openModalHelper({
    title: '新建',
    content: DetailModal,
    ...options,
  });
}
