import React from 'react';
import { DataSet } from 'choerodon-ui/pro';
import { modalChildrenProps } from 'choerodon-ui/pro/lib/modal/interface';
import { LanguageType } from '../../../../datasets/languageDS';
interface Props {
    supportLanguage: any[];
    fillLanguageTemplate: (data: any) => void;
    languageType: LanguageType;
    languageDiyDs: DataSet;
    domainCode: string;
    modal?: modalChildrenProps;
}
declare const _default: React.FunctionComponent<Props>;
export default _default;
