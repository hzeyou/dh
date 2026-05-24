import React from 'react';
import {
  Attachment,
  DatePicker,
  Form,
  Lov,
  NumberField,
  Output,
  Select,
  TextArea,
  TextField,
} from 'choerodon-ui/pro';
import { ContentCard } from 'components/Page';
import { LabelLayout } from 'choerodon-ui/pro/lib/form/enum';
import { observer } from 'mobx-react';

function Index({ ds, isCreate }) {

  return (
    <ContentCard title="批量变更单">
      <Form dataSet={ds} columns={3} labelLayout={LabelLayout.vertical}>

        <Output name="changeCode" />

        <Select name="type" />

        {ds?.current?.get('type') === '1' ? (
          <DatePicker name="startEndDate" />
        ) : null}

        {ds?.current?.get('type') === '3' ? (
          <Select name="exitType" />
        ) : null}

        <Output name="applicant" newLine />

        <TextArea name="remark" />

        <Attachment name="attachment" newLine />
      </Form>
    </ContentCard>
  );
}

export default observer(Index);
