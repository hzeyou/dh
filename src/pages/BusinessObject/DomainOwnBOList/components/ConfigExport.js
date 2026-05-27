import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _Lov from "@hzero-front-ui/c7n-ui/lib/LovPro";
import _Modal from "@hzero-front-ui/c7n-ui/lib/ModalPro";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import React, { useMemo } from 'react';
import formatterCollections from 'utils/intl/formatterCollections';
import { observer } from 'mobx-react-lite';
import intl from 'utils/intl';
import { isTenantRoleLevel } from 'utils/utils';
import { FieldType, FieldIgnore } from 'choerodon-ui/pro/lib/data-set/enum';
import { doExcelExport } from 'components/ExcelExportPro';
import { ButtonColor, FuncType } from 'choerodon-ui/pro/lib/button/enum';
import { lowcodeOrganizationURL } from "hzero-front-apaas/lib/utils/common";
import { HZERO_HMDE } from "hzero-front-apaas/lib/utils/config";
import notification from 'utils/notification';
const isTenant = isTenantRoleLevel();
const App = ({
  domainId,
  businessObjectId
}) => {
  const ds = useMemo(() => {
    return new _DataSet({
      autoCreate: true,
      autoQuery: false,
      selection: false,
      paging: false,
      fields: [{
        name: 'businessObject',
        type: "object",
        ignore: "always",
        textField: 'businessObjectName',
        valueField: 'businessObjectCode',
        lovCode: isTenant ? 'HMDE.BUSINESS_OBJECT.PAGE' : 'HMDE.BUSINESS_OBJECT.PAGE.SITE',
        required: true,
        multiple: true,
        lovPara: {
          domainId,
          businessObjectCategory: 'STANDARD',
          physicalModelType: 'TABLE'
        },
        defaultValidationMessages: {
          valueMissingNoLabel: intl.get('hmde.bo.businessObject.plChooseBo').d('请选择业务对象')
        }
      }]
    });
  }, [domainId]);
  const handleConfigExport = () => {
    var _ds$current;
    (_ds$current = ds.current) === null || _ds$current === void 0 ? void 0 : _ds$current.init('businessObject', []);
    const modal = _Modal.open({
      title: intl.get('hmde.bo.businessObject.plChooseBo').d('请选择业务对象'),
      destroyOnClose: true,
      closable: true,
      key: _Modal.key(),
      style: {
        width: 595
      },
      children: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", null, intl.get('hmde.bo.businessObject.ConfigExport.newTips').d('支持导出【数据类型】为“物理模型”、【对象类型】为“基础对象”的业务对象，包括业务对象基础信息及字段列表')), /*#__PURE__*/React.createElement(_Form, {
        dataSet: ds
      }, /*#__PURE__*/React.createElement(_Lov, {
        name: "businessObject"
      }))),
      okText: intl.get('hmde.common.next').d('下一步'),
      onOk: async () => {
        if (await ds.validate()) {
          var _ds$current2, _ds$current2$get, _ds$current2$get$map, _ds$current2$get$map$;
          const ids = (ds === null || ds === void 0 ? void 0 : (_ds$current2 = ds.current) === null || _ds$current2 === void 0 ? void 0 : (_ds$current2$get = _ds$current2.get('businessObject')) === null || _ds$current2$get === void 0 ? void 0 : (_ds$current2$get$map = _ds$current2$get.map(v => v.businessObjectId)) === null || _ds$current2$get$map === void 0 ? void 0 : (_ds$current2$get$map$ = _ds$current2$get$map.join) === null || _ds$current2$get$map$ === void 0 ? void 0 : _ds$current2$get$map$.call(_ds$current2$get$map)) || '';
          if (ids) {
            var _modal$close;
            handleExport(ids);
            modal === null || modal === void 0 ? void 0 : (_modal$close = modal.close) === null || _modal$close === void 0 ? void 0 : _modal$close.call(modal);
          } else {
            notification.error({
              message: intl.get(`hmde.common.tips`).d('提示'),
              description: intl.get('hmde.bo.businessObject.plChooseBo').d('请选择业务对象')
            });
          }
        }
        return false;
      }
    });
  };
  const handleExport = id => {
    doExcelExport({
      requestUrl: `${lowcodeOrganizationURL({
        route: HZERO_HMDE
      })}/business-objects/common-export`,
      method: 'POST',
      exportAsync: true,
      allBody: true,
      queryParams: {
        businessObjectIds: id
      }
    });
  };
  return businessObjectId ? /*#__PURE__*/React.createElement("a", {
    onClick: () => {
      handleExport(businessObjectId);
    },
    className: "action-link-item-4"
  }, intl.get('hmde.bo.businessObject.handleConfigExport').d('配置导出')) : /*#__PURE__*/React.createElement(_Button, {
    onClick: () => {
      handleConfigExport();
    },
    icon: "launch",
    funcType: "link",
    color: "primary",
    style: {
      padding: '0 8px'
    }
  }, intl.get('hmde.bo.businessObject.handleConfigExport').d('配置导出'));
};
export default formatterCollections({
  code: ['hmde.bo', 'hmde.common']
})(observer(App));