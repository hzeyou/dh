import {
  DataSet,
  Form,
  Select,
} from 'choerodon-ui/pro';
import {openModalHelper} from '@/utils/modalHelper';
import React, {useMemo} from 'react';
import {DetailDSConfig} from '@/pages/RFQ/stores/RFQMethodChangeDS';

const App = ({ record, modal, onSubmit }: any) => {

  const detailDS = useMemo(() => {
    const _detailDS = new DataSet(DetailDSConfig());
    console.log('detailDS', _detailDS.fields.get('new_rfq_method'));
    return _detailDS;
  }, [record]);

  const handleSave = async () => {
    const vRes = await detailDS.validate();
    if (!vRes) {
      return vRes;
    }
    const res = await detailDS.submit();  //
    if (res?.success) {
      detailDS?.current?.commit();
      detailDS?.current?.setState('isSubmit', 1);
      onSubmit();
    }
  };

  modal.handleOk(handleSave);

  // onOption={({record}) => ({disabled: record.index === 0})}

  return (
    <>
      <Form dataSet={detailDS} columns={1}>
        <Select name="old_rfq_method"/>
        <Select name="new_rfq_method"/>
      </Form>
    </>
  );
};

export default function open (options?) {
  return openModalHelper({
    title: '询价方式变更',
    content: App,
    drawer: false,
    ...options,
  });
}
