import React from 'react';
import {
  Attachment,
  DataSet,
  DatePicker,
  Form,
  Output,
  Select,
  TextArea,
} from 'choerodon-ui/pro';
import { LabelLayout } from 'choerodon-ui/pro/lib/form/enum';
import { observer } from 'mobx-react';

import { ContentCard } from 'components/Page';

interface BusinessChangeProps {
  ds: DataSet;
  isCreate: boolean;
  isUpdate: boolean;
  isView?: boolean;
}

function Index(props: BusinessChangeProps) {
  const { ds, isCreate, isUpdate, isView } = props;
  const isEditor = !isView && (isCreate || isUpdate);
  const billNoName = ds?.current?.get('businessChangeNo')
    ? 'businessChangeNo'
    : 'changeCode';
  const applicantName = ds?.current?.get('applicant')
    ? 'applicant'
    : 'createdByName';

  return (
    <ContentCard title="业务变更">
      <Form dataSet={ds} columns={3} labelLayout={LabelLayout.vertical}>
        <Output name={billNoName} />

        {isEditor ? <Select name="type" /> : <Output name="type" />}

        {ds?.current?.get('type') === '1' ? (
          isEditor ? (
            <DatePicker name="startEndDate" />
          ) : (
            <Output name="startEndDate" />
          )
        ) : null}

        {ds?.current?.get('type') === '3' ? (
          isEditor ? (
            <Select name="exitType" />
          ) : (
            <Output name="exitType" />
          )
        ) : null}

        <Output name={applicantName} newLine />

        {isEditor ? <TextArea name="remark" /> : <Output name="remark" />}

        <Attachment name="attachment" newLine disabled={isView} />
      </Form>
    </ContentCard>
  );
}

export default observer(Index);
