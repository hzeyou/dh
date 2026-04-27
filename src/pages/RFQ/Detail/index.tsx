import {compose} from '@/utils/util';
import formatterCollections from 'utils/intl/formatterCollections';
import {observer} from 'mobx-react';
import {Header, Content} from 'components/Page';
import {DetailProps} from '@/typings';
import {
  Button,
  DataSet,
  DatePicker,
  Form,
  Lov,
  Modal,
  NumberField,
  Output,
  Select,
  TextArea,
  TextField,
  EmailField,
  SelectBox,
} from 'choerodon-ui/pro';

import { Anchor } from 'choerodon-ui';

import {ButtonColor} from 'choerodon-ui/pro/lib/button/enum';
import {intl} from 'utils/utils';
import React, {useMemo} from 'react';
import {DetailDSConfig} from '@/pages/Demo/stores/detailDS';

const intlPrefix = 'srm.rfq';
function Page(props: DetailProps) {

  const id = props.match.params.id;

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
    const res = await detailDS.submit();
    if (res?.success) {
      detailDS?.current?.commit();
      detailDS?.current?.setState('isSubmit', 1);
    }
  };

  const handleDelete = async () => {

    const res = await detailDS.delete(detailDS.current, intl.get('srm.demo.list.delete.single').d('是否确认删除？'));

    // 刷新
    if (res === false) return;

    history.back();
  };

  const isReadOnly = false;

  return (
    <>
      <Header
        title={intl.get(`${intlPrefix}.detail.title`).d('新建询报价')}
        backPath="/srm/rfq/list"
        stateData={{status: detailDS?.current?.getState('isSubmit')}}
        isChange={detailDS?.dirty}
      >
        <Button
          icon="save"
          onClick={handleSave}
          color={ButtonColor.primary}
        >
          {intl.get('hzero.common.button.save').d('保存')}
        </Button>
        <Button
          icon="delete"
          onClick={handleDelete}
        >
          {intl.get('hzero.common.button.delete').d('删除')}
        </Button>
      </Header>
      <Content>

        <Anchor>
          <Anchor.Link href="#base" title="基本信息" />
          <Anchor.Link href="#detail" title="物料明细" />
          <Anchor.Link href="#info" title="供应商信息" />
          <Anchor.Link href="#require" title="询价要求" />
        </Anchor>

        <Form dataSet={detailDS} columns={3}>
          {isReadOnly ? (
            <>
              <Output name="name" />
              <Output name="content" />
            </>
          ) : (
            <>
              <TextField name="name" />
              <NumberField name="age" />
              <EmailField name="email" />
            </>
          )}
        </Form>

      </Content>
    </>
  );

}


export default compose(
  formatterCollections({
    code: [intlPrefix],
  }),
  observer,
)(Page);
