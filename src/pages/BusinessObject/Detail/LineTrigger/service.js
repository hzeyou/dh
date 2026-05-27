import { lowcodeRequest as request } from "hzero-front-hmde/lib/utils/lowcodeRequest";
import { HZERO_HMDE, HZERO_HPFM } from "hzero-front-apaas/lib/utils/config";
import { lowcodeOrganizationURL } from "hzero-front-hmde/lib/utils/common";
export async function pubService(body) {
  return request(`${lowcodeOrganizationURL({
    route: HZERO_HMDE
  })}/bo-triggers/publish`, {
    method: 'PUT',
    body
  });
}
export async function enableService(businessObjectTriggerId) {
  return request(`${lowcodeOrganizationURL({
    route: HZERO_HMDE
  })}/bo-triggers/enabled`, {
    method: 'PUT',
    body: {
      businessObjectTriggerId
    }
  });
}
export async function disabledService(businessObjectTriggerId) {
  return request(`${lowcodeOrganizationURL({
    route: HZERO_HMDE
  })}/bo-triggers/disabled`, {
    method: 'PUT',
    body: {
      businessObjectTriggerId
    }
  });
}
export async function drillService(flowId) {
  return request(`${lowcodeOrganizationURL({
    route: HZERO_HMDE
  })}/flows/${flowId}`, {
    method: 'GET'
  });
}
export async function getTypeList() {
  const lookupCode = 'HMDE.BUSINESS_OBJECT.TRIGGER.TYPE';
  return request(`${lowcodeOrganizationURL({
    route: HZERO_HPFM
  })}/lovs/value/batch?${lookupCode}=${lookupCode}`, {
    method: 'GET',
    transformResponse: v => {
      let ops = [];
      try {
        var _JSON$parse;
        ops = ((_JSON$parse = JSON.parse(v)) === null || _JSON$parse === void 0 ? void 0 : _JSON$parse[lookupCode]) || [];
      } catch (error) {
        console.log(error);
      }
      return ops;
    }
  });
}