import {compose} from '@/utils/util';
import formatterCollections from 'utils/intl/formatterCollections';
import {observer} from 'mobx-react';
import {Header, Content} from 'components/Page';
import {DetailProps} from '@/typings';
import {Button, DataSet, DatePicker, Form, Lov, Modal, Output, Select, TextArea, TextField} from 'choerodon-ui/pro';
import {ButtonColor} from 'choerodon-ui/pro/lib/button/enum';
import {intl} from 'utils/utils';
import React, {useMemo} from 'react';
import {DetailDSConfig} from '@/pages/Demo/stores/detailDS';


function Page(props: DetailProps) {

  const id = props.match.params.id;

  const detailDS = useMemo(() => {
    const _detailDS = new DataSet(DetailDSConfig());
    if (id) {
      _detailDS.query(undefined, { id });
    }
    return _detailDS;
  }, []);

  const handleSave = async () => {
    await detailDS.submit();
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
        title={intl.get(`dd`).d('详情')}
        backPath="/srm/demo/list"
        isChange={detailDS.dirty}
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

        <Form dataSet={detailDS} columns={3}>
          {isReadOnly ? (
            <>
              <Output name="title" />
              <Output name="content" />
            </>
          ) : (
            <>
              <TextField name="title" />
              <TextField name="content" />
            </>
          )}
        </Form>

      </Content>
    </>
  );

}


export default compose(
  formatterCollections({
    code: [`srm.common`],
  }),
  observer,
)(Page);
