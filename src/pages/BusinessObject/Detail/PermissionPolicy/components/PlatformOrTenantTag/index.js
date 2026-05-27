import _Tag from "@hzero-front-ui/c7n-ui/lib/Tag";
import React from 'react';
import intl from 'utils/intl';
import ImgIcon from "hzero-front-hmde/lib/utils/ImgIcon";
/**
 * 平台或租户标签
 * @param isTenant
 * @constructor
 */
const PlatformOrTenantTag = ({
  isTenant = false
}) => {
  const tagProps = {
    color: '#F0F0F0',
    style: {
      color: '#767676',
      display: 'inline-flex',
      alignItems: 'center'
    }
  };
  const iconFile = isTenant ? 'platform.svg' : 'tenant.svg';
  return /*#__PURE__*/React.createElement(_Tag, tagProps, /*#__PURE__*/React.createElement(ImgIcon, {
    name: iconFile,
    size: 12,
    style: {
      marginRight: '4px'
    }
  }), isTenant ? intl.get('hmde.common.standard').d('标准') : intl.get('hmde.common.custom').d('自定义'));
};
export default PlatformOrTenantTag;