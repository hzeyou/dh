import React from 'react';
import { Attachment, DatePicker, Form, Lov, NumberField, Output, Select, TextArea, TextField } from 'choerodon-ui/pro';
import { ContentCard } from 'components/Page';
import { LabelLayout } from 'choerodon-ui/pro/lib/form/enum';

export default function Index({ds, isCreate, isUpdate, isView}) {

  const isSupplier = ds?.current?.get('type') === '1';

  return (
    <ContentCard title="阶段变更单">
      <Form
        dataSet={ds}
        columns={5}
        labelLayout={LabelLayout.vertical}
      >

        {
          isView && (
            <>
              <Output name="assessmentCode"/>
              <Output name="supplierCode"/>
              <Output name="supplierName"/>
              <Output name="supplierTypeId"/>
              <Output name="status"/>

              <Output name="type" newLine/>

              {
                isSupplier && (
                  <>
                    <Output name="developmentPurpose"/>
                    <Output name="supplierProfile"/>
                    <Output name="factoryAuditBackground"/>
                  </>
                )
              }

              <Output name="remark" newLine/>

              <Output name="meetingMinutes" newLine/>

              <Output name="attachment" newLine/>

            </>
          )
        }

        {
          (isCreate || isUpdate) && (
            <>
              {
                isUpdate ? (
                  <Output name="assessmentCode"/>
                ) : null
              }

              <Lov name="supplierCodeLov"/>

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
            </>
          )
        }

      </Form>
    </ContentCard>

  );

}

