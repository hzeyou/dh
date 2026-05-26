import { getCurrentOrganizationId } from "utils/utils";
import DataSet from 'choerodon-ui/dataset/data-set/DataSet';

export const HG_SRM = '/hsrm';
export const HG_PTS = '/hpts';
export const HG_MDMF = '/hmdmf';

export const HG_SRM_API_PREFIX = `${HG_SRM}/v1/${getCurrentOrganizationId()}`;
export const HG_PTS_API_PREFIX = `${HG_PTS}/v1/${getCurrentOrganizationId()}`;

export const HG_MDMF_API_PREFIX = `${HG_MDMF}/v1/${getCurrentOrganizationId()}`;

// 桶名
export const SRM_BUCKET_NAME = 'public';
// 目录名
export const SRM_BUCKET_DIRECTORY = 'srm';



export const billTypeOptionsDS = new DataSet({
  data: [
    { meaning: '冻结', value: '1' },
    { meaning: '解冻', value: '2' },
    { meaning: '淘汰', value: '3' },
    { meaning: '等级变更', value: '4' },
  ],
});

export const exitTypeOptionsDS = new DataSet({
  data: [
    { meaning: '呆滞退出', value: '1' },
    { meaning: '处罚退出', value: '2' },
  ],
});
