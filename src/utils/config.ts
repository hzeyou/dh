import { getCurrentOrganizationId } from "utils/utils";

export const HG_SRM = '/hsrm';
export const HG_PTS = '/hpts';

export const HG_SRM_API_PREFIX = `${HG_SRM}/v1/${getCurrentOrganizationId()}`;
export const HG_PTS_API_PREFIX = `${HG_PTS}/v1/${getCurrentOrganizationId()}`;

// 桶名
export const SRM_BUCKET_NAME = 'public';
// 目录名
export const SRM_BUCKET_DIRECTORY = 'srm';