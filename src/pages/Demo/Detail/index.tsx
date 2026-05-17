import {compose} from '@/utils/util';
import formatterCollections from 'utils/intl/formatterCollections';
import {observer} from 'mobx-react';
import { Header, Content, ContentCard } from 'components/Page';
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
import { Steps } from 'choerodon-ui';
import {ButtonColor} from 'choerodon-ui/pro/lib/button/enum';
import {intl} from 'utils/utils';
import React, {useMemo} from 'react';
import {DetailDSConfig} from '@/pages/Demo/stores/detailDS';
import { LabelLayout } from 'choerodon-ui/pro/lib/form/enum';
import { Card } from 'hzero-ui';


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

  const isReadOnly = true;

  return (
    <>
      <Header
        title={intl.get('dd').d('详情')}
        backPath="/srm/demo/list"
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
      <Content>
        <ContentCard
          title={intl.get('hzero.common.view.baseInfo').d('基本信息')}
        >

          <Form dataSet={detailDS}>
            <Steps>
              <Steps.Step
                style={{maxWidth: '300px'}}
                status="finish"
                icon={<span></span>}
                title={<Card type="inner" title="卡片标题">
                  <Form.Item>
                    <Output name="name" />
                  </Form.Item>
                </Card>}
              ></Steps.Step>
              <Steps.Step
                style={{maxWidth: '300px'}}
                icon={<span></span>}
                status="finish"
                title={<Card type="inner" title="卡片标题">
                  <Form.Item>
                    <Output name="name" />
                  </Form.Item>
                </Card>}
              />
              <Steps.Step
                style={{maxWidth: '300px'}}
                status="finish"
                icon={<span></span>}
                title={<Card type="inner" title="卡片标题">
                  <Form.Item>
                    <Output name="name" />
                  </Form.Item>
                </Card>}
              />
            </Steps>
          </Form>

          <Form
            header="头部"
            dataSet={detailDS}
            columns={3}
            labelLayout={LabelLayout.vertical}
          >
            {isReadOnly ? (
              <>

                <Output name="name" />
                <Output name="age" />
              </>
            ) : (
              <>
                <TextField name="name" />
                <NumberField name="age" />
                <EmailField name="email" />
                <SelectBox name="gender" />
              </>
            )}
          </Form>
        </ContentCard>
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
