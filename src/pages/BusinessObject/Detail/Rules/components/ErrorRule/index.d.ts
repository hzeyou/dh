import React from 'react';
import { TextAreaProps } from 'choerodon-ui/pro/lib/text-area/TextArea';
import C7NRecord from 'choerodon-ui/pro/lib/data-set/Record';
interface Props extends TextAreaProps {
    record: C7NRecord;
    name: string;
    disabled: boolean;
}
declare const _default: React.FunctionComponent<Props>;
export default _default;
