import { FieldIgnore, FieldType } from 'choerodon-ui/dataset/data-set/enum';
import intl from 'utils/intl';
import { isTenantRoleLevel } from 'utils/utils';
export let DomainFN = /*#__PURE__*/function (DomainFN) {
  DomainFN["DOMAIN_LOV"] = "domainLov";
  DomainFN["DOMAIN_ID"] = "domainId";
  DomainFN["DOMAIN_NAME"] = "domainName";
  DomainFN["SERVICE_CODE"] = "serviceCode";
  return DomainFN;
}({});
export default (() => ({
  autoQuery: false,
  autoCreate: true,
  paging: false,
  fields: [{
    name: DomainFN.DOMAIN_LOV,
    type: "object",
    label: intl.get('hmde.common.domain').d('领域'),
    lovCode: isTenantRoleLevel() ? 'HMDE.DOMAIN' : 'HMDE.DOMAIN.SITE',
    ignore: "always",
    required: true,
    lovPara: {
      skipPermissionFlag: false
    }
  }, {
    name: DomainFN.DOMAIN_NAME,
    type: "string",
    bind: `${DomainFN.DOMAIN_LOV}.${DomainFN.DOMAIN_NAME}`
  }, {
    name: DomainFN.DOMAIN_ID,
    type: "string",
    bind: `${DomainFN.DOMAIN_LOV}.${DomainFN.DOMAIN_ID}`
  }]
}));