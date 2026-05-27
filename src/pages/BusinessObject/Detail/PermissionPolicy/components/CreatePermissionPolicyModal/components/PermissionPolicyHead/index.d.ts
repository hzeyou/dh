import React from 'react';
import { DataSet } from 'choerodon-ui/pro';
import { FormProps } from 'choerodon-ui/pro/lib/form/Form';
import { FieldsNameTypes } from '@hmde/stores/BusinessObject/PermissionPolicyDS';
interface Props {
    dataSet: DataSet;
    formProps?: FormProps;
    readOnly?: boolean | FieldsNameTypes[];
    isModify?: boolean;
    disabled?: boolean;
}
declare const _default: React.FunctionComponent<Props>;
export default _default;
