import React, { useCallback, useMemo } from 'react';
import { withRouter } from 'react-router-dom';
import qs from 'qs';
import intl from 'utils/intl';
import { isTenantRoleLevel } from 'utils/utils';
import CommonApi from "hzero-front-hmde/lib/businessComponents/CommonApi";
import { getBusinessObjectRequests } from "hzero-front-hmde/lib/services/businessObjectService";
const CommonApiRoute = props => {
  const history = props.history,
    location = props.location;
  const isTenant = isTenantRoleLevel();
  const _qs$parse = qs.parse(location.search.slice(1)),
    businessObjectCode = _qs$parse.businessObjectCode,
    businessObjectName = _qs$parse.businessObjectName,
    businessObjectId = _qs$parse.businessObjectId;
  const breadcrumbItems = useMemo(() => [
  // {
  //   label: intl.get('hmde.common.busniessObject').d('业务对象'),
  //   onClick() {
  //     history.push('/hmde/business-object/list');
  //     if (domainId) {
  //       location.hash = domainId;
  //     }
  //   },
  // },
  {
    label: ` ${intl.get('hmde.common.objDetail').d('对象详情')}-${businessObjectName}`,
    onClick() {
      history.push({
        pathname: `/hmde/business-object/detail/${businessObjectId}`,
        state: {
          originKey: 'baseInfo',
          fieldActiveKey: isTenant ? null : 'STANDARD'
        }
      });
    }
  }, {
    label: ` ${intl.get('hmde.common.commonApi').d('通用API')}`
  }], []);
  const handleRequest = useCallback(() => getBusinessObjectRequests(businessObjectCode), [businessObjectCode]);
  return /*#__PURE__*/React.createElement(CommonApi, {
    onRequest: handleRequest,
    breadcrumbItems: breadcrumbItems
  });
};
export default withRouter(CommonApiRoute);