import _Breadcrumb from "@hzero-front-ui/c7n-ui/lib/Breadcrumb";
import React from 'react';
import intl from 'utils/intl';
import { isTenantRoleLevel } from 'hzero-front/lib/utils/utils';
import { Header, Content } from 'components/Page';
import { useHistory } from 'react-router';
import { observer } from 'mobx-react-lite';
import useSearchParams from 'hzero-front-apaas/lib/hooks/useSearchParams';
import AddAndEditField from "../AddAndEditField";
const isTenant = isTenantRoleLevel();
function Index() {
  const history = useHistory();
  const _useSearchParams = useSearchParams(),
    businessObjectId = _useSearchParams.businessObjectId,
    businessObjectName = _useSearchParams.businessObjectName,
    fieldType = _useSearchParams.fieldType,
    businessObjectCode = _useSearchParams.businessObjectCode,
    middleBusinessObjFlag = _useSearchParams.middleBusinessObjFlag,
    boSourceType = _useSearchParams.boSourceType,
    domainEnabledFlag = _useSearchParams.domainEnabledFlag,
    extendFieldCreatedFlag = _useSearchParams.extendFieldCreatedFlag,
    extendFieldPrefixRule = _useSearchParams.extendFieldPrefixRule,
    physicalModelType = _useSearchParams.physicalModelType;
  const addFieldProps = {
    businessObjectId,
    boSourceType,
    // sourceType,
    fieldType,
    businessObjectCode,
    middleBusinessObjFlag: String(middleBusinessObjFlag) === 'true',
    domainEnabledFlag: domainEnabledFlag && JSON.parse(domainEnabledFlag),
    extendFieldCreatedFlag: extendFieldCreatedFlag && JSON.parse(extendFieldCreatedFlag),
    extendFieldPrefixRule,
    physicalModelType,
    businessObjectName
  };
  const getTitle = () => {
    return /*#__PURE__*/React.createElement(_Breadcrumb, {
      style: {
        marginLeft: '10px'
      }
    }, /*#__PURE__*/React.createElement(_Breadcrumb.Item, {
      onClick: () => {
        history.push({
          pathname: `/hmde/business-object/detail/${businessObjectId}`,
          state: {
            originKey: 'fieldList',
            fieldActiveKey: isTenant && boSourceType !== 'TENANT' ? null : 'STANDARD'
          }
        });
      }
    }, /*#__PURE__*/React.createElement("span", null, intl.get('hmde.common.objDetail').d('对象详情'), "-", businessObjectName)), /*#__PURE__*/React.createElement(_Breadcrumb.Item, null, /*#__PURE__*/React.createElement("span", null, " ", intl.get('hmde.common.fieldAdd').d('字段新建'))));
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Header, {
    title: getTitle()
  }), /*#__PURE__*/React.createElement(Content, null, /*#__PURE__*/React.createElement(AddAndEditField, addFieldProps)));
}
export default observer(Index);