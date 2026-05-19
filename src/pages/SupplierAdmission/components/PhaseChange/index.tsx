import React from 'react';
import { DatePicker, Form, Lov, NumberField, Output, Select, TextArea, TextField } from 'choerodon-ui/pro';
import { ContentCard } from 'components/Page';
import { LabelLayout } from 'choerodon-ui/pro/lib/form/enum';

export default function Index({ds, isCreate}) {



  return (
    <ContentCard title="阶段变更单">
      <Form
        dataSet={ds}
        columns={2}
        labelLayout={LabelLayout.vertical}
      >
        <Output name="shortName"/>

        <Lov
          name="supplierTypeId"
          tableProps={{ queryFieldsLimit: 5 }}
        />


        <Output name="shortName"/>
        <TextField name="supplierName" />
      </Form>
    </ContentCard>

  );

}

