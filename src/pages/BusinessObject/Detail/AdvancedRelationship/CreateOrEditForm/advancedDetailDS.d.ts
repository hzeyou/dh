import { DataSetProps } from 'choerodon-ui/pro/lib/data-set/DataSet';
import { DataSet } from 'choerodon-ui/pro';
interface IProps {
    type: string;
    businessObjectCode?: string;
    advancedListDs: DataSet;
    baseInfoDS?: DataSet;
}
declare const _default: ({ type, businessObjectCode, advancedListDs, baseInfoDS }: IProps) => DataSetProps;
export default _default;
