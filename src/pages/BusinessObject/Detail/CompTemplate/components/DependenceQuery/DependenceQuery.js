import _ConfigProvider from "choerodon-ui/lib/config-provider";
import _useDataSet from "choerodon-ui/pro/lib/use-data-set";
import _Table from "@hzero-front-ui/c7n-ui/lib/TablePro";
import React, { useCallback, useEffect } from 'react';
// import { useDataSet } from 'utils/hooks';

import { TableQueryBarType, ColumnAlign
// TableAutoHeightType,
} from 'choerodon-ui/pro/lib/table/enum';
import { redirectToPageDesignerUrl } from "hzero-front-apaas/lib/utils/common";
import { observer } from 'mobx-react-lite';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { isTenantRoleLevel, getCurrentOrganizationId } from 'utils/utils';
import { EPageType } from "hzero-front-apaas/lib/constants/designer";
import DataSetConfig, { FN, DesignerMode } from "./store";
const Column = _Table.Column;
const tenantId = getCurrentOrganizationId();
const isTenant = isTenantRoleLevel();
const DependenceQuery = props => {
  const sourcePageCode = props.pageCode;
  const tableDs = _useDataSet(() => DataSetConfig(), []);
  useEffect(() => {
    tableDs.setState('params', {
      sourcePageCode
    });
    tableDs.query();
  }, []);
  const toFunctionPage = useCallback(record => {
    const platform = record.get('platform');
    const pageCode = record.get('pageCode');
    const isMobilePage = platform === DesignerMode.mobile;
    const pageType = isMobilePage ? EPageType.Mobile : EPageType.PageDesigner;
    const domainCode = record.get('domainCode');
    const domainName = record.get('domainName');
    const moduleName = record.get('moduleName');
    const functionName = record.get('functionName');
    const functionCode = record.get('functionCode');
    const functionId = record.get('functionId');
    // 等后端添加参数
    const domainId = record.get('domainId');
    const moduleId = record.get('moduleId');
    const decryptedFunctionId = record.get('decryptedFunctionId'); // 解密id

    if (platform && pageCode && domainCode && domainName && moduleName && functionName && domainId && moduleId && decryptedFunctionId) {
      const commonParams = {
        pageCode,
        domainId,
        domainCode,
        domainName,
        pageType,
        platform,
        moduleId,
        moduleName,
        tenantId,
        functionId,
        functionCode,
        functionName,
        decryptedFunctionId
      };
      const params = record.get(FN.PAGETYPE) === 'INHERIT' ? {
        ...commonParams,
        customFlag: true,
        customId: record.get('customId'),
        customRuleCode: record.get('ruleCode')
      } : commonParams;
      const designerUrl = redirectToPageDesignerUrl(params);
      // window.open(
      //   `${process.env.BASE_PATH}pub/hlod/render/bo-page-designer/canvas#?pageCode=${pageCode}&domainId=${domainId}&domainCode=${domainCode}&domainName=${domainName}&pageType=${pageType}&platform=${platform}&moduleId=${moduleId}&moduleName=${moduleName}&functionName=${functionName}&tenantId=${tenantId}&decryptedFunctionId=${decryptedFunctionId}${customHash}`
      // );
      window.open(designerUrl);
    } else {
      const emptyArr = [pageCode, domainCode, domainName, moduleName, functionName, domainId, moduleId, decryptedFunctionId].filter(item => !item);
      notification.error({
        message: `跳转所需参数: ${emptyArr.toString()} 为空，请联系管理员`
      });
    }
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      minHeight: 357
    }
  }, /*#__PURE__*/React.createElement(_ConfigProvider, {
    tableColumnAlign: () => "left"
  }, /*#__PURE__*/React.createElement(_Table, {
    dataSet: tableDs,
    queryBar: "filterBar"
    // autoHeight={{ type: TableAutoHeightType.maxHeight, diff: 45 }}
    ,
    queryBarProps: {
      fuzzyQueryPlaceholder: '请输入页面名称'
    }
  }, /*#__PURE__*/React.createElement(Column, {
    name: FN.PAGE_NAME,
    renderer: ({
      value,
      record
    }) => {
      if (!isTenant && (record === null || record === void 0 ? void 0 : record.get('tenantId')) !== 0) {
        return value;
      } else {
        return /*#__PURE__*/React.createElement("a", {
          onClick: () => toFunctionPage(record)
        }, value);
      }
    }
  }), /*#__PURE__*/React.createElement(Column, {
    name: FN.FUNCTION_NAME
  }), /*#__PURE__*/React.createElement(Column, {
    name: FN.DOMAIN_NAME
  }), /*#__PURE__*/React.createElement(Column, {
    name: FN.PAGETYPE
  }), /*#__PURE__*/React.createElement(Column, {
    name: FN.RULECODE
  }), !isTenant && /*#__PURE__*/React.createElement(Column, {
    name: FN.TENANT_NAME
  }), /*#__PURE__*/React.createElement(Column, {
    name: FN.PLATFORM
  }))));
};
export default formatterCollections({
  code: ['hmde.bo']
})(observer(DependenceQuery));