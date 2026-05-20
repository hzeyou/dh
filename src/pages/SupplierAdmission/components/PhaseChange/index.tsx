import React from 'react';
import { Attachment, DatePicker, Form, Lov, NumberField, Output, Select, TextArea, TextField } from 'choerodon-ui/pro';
import { ContentCard } from 'components/Page';
import { LabelLayout } from 'choerodon-ui/pro/lib/form/enum';

export default function Index({ds, isCreate}) {



  return (
    <ContentCard title="阶段变更单">
      <Form
        dataSet={ds}
        columns={5}
        labelLayout={LabelLayout.vertical}
      >
        <Output name="field"/>

        <Select name="supplierCode"/>

        <Output name="supplierName"/>

        <Output name="supplierTypeId"/>

        <Output name="field3"/>

        <Select name="type"/>

        <TextField name="developmentPurpose"/>

        <TextField name="supplierProfile"/>

        <TextField name="factoryAuditBackground"/>

        <TextField name="remark"/>

        <Attachment name="meetingMinutes" newLine/>

        <Attachment name="attachment" newLine/>

      </Form>
    </ContentCard>

  );

}

