import request from 'hzero-front/lib/utils/request';
import { getCurrentOrganizationId } from 'hzero-front/lib/utils/utils';

const organizationId = getCurrentOrganizationId();

// 查询
export async function submitApproval(purchaseId: string) {
  return request(
    `${process.env.SRM_DEV_HOST}/hsrm/v1/${organizationId}/purchase/submit-approval/${purchaseId}`,
    {
      method: 'GET',
    },
  );
}
