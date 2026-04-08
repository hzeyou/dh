import {
  AutoComplete,
  Button,
  DataSet,
  EmailField,
  Form,
  Modal,
  NumberField,
  Output,
  SelectBox,
  TextField
} from 'choerodon-ui/pro';
import {openModalHelper} from '@/utils/modalHelper';
import React, {useCallback, useMemo} from 'react';
import {DetailDSConfig} from '@/pages/Demo/stores/detailDS';
import {intl} from 'utils/utils';
import {useEmailAutoComplete} from '@/hooks/useEmailAutoComplete';

const App = ({ id, modal, onSubmit }: any) => {

  // const id = props.match.params.id;

  console.log('modal==', modal);

  const detailDS = useMemo(() => {
    const _detailDS = new DataSet(DetailDSConfig());
    if (id) {
      _detailDS.query(undefined, { id });
    } else {
      detailDS?.current?.set('dirty', false);
    }
    return _detailDS;
  }, []);

  const handleSave = async () => {
    const vRes = await detailDS.validate();
    console.log('vRes==', vRes);
    if (!vRes) {
      return vRes;
    }
    const res = await detailDS.submit();
    if (res?.success) {
      detailDS?.current?.commit();
      detailDS?.current?.setState('isSubmit', 1);
      onSubmit();
    }
  };

  modal.handleOk(handleSave);

  const handleDelete = async () => {

    const res = await detailDS.delete(detailDS.current, intl.get('srm.demo.list.delete.single').d('是否确认删除？'));

    // 刷新
    if (res === false) return;

    history.back();
  };

  const isReadOnly = false;

  const { emailOptionDS, handleValueChange } = useEmailAutoComplete();

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
            <TextField name="name" />
            <NumberField name="age" />
            {/*<EmailField name="email" />*/}
            <AutoComplete
              onFocus={handleValueChange}
              onInput={handleValueChange}
              options={emailOptionDS}
              name="email"
            />
            <SelectBox name="gender"/>
          </>
        )}
      </Form>
    </>
  );
};

export default function open (options?) {
  return openModalHelper({
    title: '弹窗',
    content: App,
    ...options,
  });
}
