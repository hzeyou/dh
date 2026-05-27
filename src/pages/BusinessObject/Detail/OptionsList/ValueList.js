import _Lov from "@hzero-front-ui/c7n-ui/lib/LovPro";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import React, { useMemo } from 'react';
import { HZERO_HMDE } from "hzero-front-apaas/lib/utils/config";
import { lowcodeOrganizationURL } from "hzero-front-hmde/lib/utils/common";
import { isTenantRoleLevel, getCurrentOrganizationId } from 'utils/utils';
import { observer } from 'mobx-react-lite';
import { lovDefineAxiosConfig } from 'hzero-front/lib/utils/c7nUiConfig';
import { FieldType } from 'choerodon-ui/pro/lib/data-set/enum';
import { ViewMode } from 'choerodon-ui/pro/lib/lov/enum';
import intl from 'utils/intl';
import uuid from 'uuid/v4';
import { TableMode } from 'choerodon-ui/pro/lib/table/enum';
import styles from "./index.less?modules";
const isTenant = isTenantRoleLevel();
const organizationId = getCurrentOrganizationId();
const ValueList = observer(props => {
  const record = props.record,
    disabled = props.disabled;
  const viewDS = useMemo(() => {
    return new _DataSet({
      autoCreate: true,
      paging: false,
      fields: [{
        name: 'valueList',
        type: "object",
        lovCode: uuid(),
        // lovCode变化 lovDefineAxiosConfig才会更新
        lovDefineAxiosConfig: (lovCode, dataSet) => {
          // const businessObjectCode = record?.get('businessObjectCode');
          const businessObjectOptionCode = record === null || record === void 0 ? void 0 : record.get('businessObjectOptionCode');
          const lovConfig = lovDefineAxiosConfig(businessObjectOptionCode, dataSet);
          // const query = businessObjectOptionCode
          //   ? `dataObjectCode=${businessObjectCode}&dataObjectOptionCode=${businessObjectOptionCode}`
          //   : `dataObjectCode=${businessObjectCode}`;
          const path = isTenant ? `/executor/option/${businessObjectOptionCode}/view-info` : `/${organizationId}/executor/option/${businessObjectOptionCode}/view-info`;
          return {
            ...lovConfig,
            method: 'GET',
            url: `${lowcodeOrganizationURL({
              route: HZERO_HMDE
              // })}/data-objects/view-info?${query}`,
            })}${path}`
          };
        }
      }]
    });
  }, [record]);
  // 按钮模式
  return /*#__PURE__*/React.createElement(_Lov, {
    name: "valueList",
    tableProps: {
      mode: "list"
    },
    dataSet: viewDS,
    mode: "button",
    clearButton: false,
    autoSelectSingle: false,
    className: styles.lovStyle,
    tooltip: 'none'
  }, /*#__PURE__*/React.createElement("a", {
    disabled: disabled,
    style: {
      verticalAlign: 'top'
    }
  }, intl.get('hmde.bo.businessObject.preview').d('预览')));
});
export default ValueList;