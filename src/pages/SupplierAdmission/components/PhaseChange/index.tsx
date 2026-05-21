import React from 'react';
import { Attachment, DatePicker, Form, Lov, NumberField, Output, Select, TextArea, TextField } from 'choerodon-ui/pro';
import { ContentCard } from 'components/Page';
import { LabelLayout } from 'choerodon-ui/pro/lib/form/enum';

export default function Index({ds, isCreate, isUpdate}) {

  const isSupplier = ds?.current?.get('type') === '1';

  return (
    <ContentCard title="阶段变更单">
      <Form
        dataSet={ds}
        columns={5}
        labelLayout={LabelLayout.vertical}
      >

        {
          isUpdate ? (
            <Output name="admissionCode"/>
          ) : null
        }

        <Lov name="lovSupplierCode"/>

        <Output name="supplierName"/>

        <Output name="supplierTypeId"/>

        {
          isSupplier ? (
            <Output name="status"/>
          ) : null
        }

        <Select name="type" newLine/>

        {
          isSupplier ? (
            <>
              <TextField name="developmentPurpose"/>

              <TextField name="supplierProfile"/>

              <TextField name="factoryAuditBackground"/>
            </>
          ) : null
        }

        <TextField name="remark" newLine/>

        <Attachment name="meetingMinutes" newLine/>

        <Attachment name="attachment" newLine/>

      </Form>
    </ContentCard>

  );

}

