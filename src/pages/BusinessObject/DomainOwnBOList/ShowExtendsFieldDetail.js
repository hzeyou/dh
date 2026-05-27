import _Table from "@hzero-front-ui/c7n-ui/lib/TablePro";
import _Tooltip from "@hzero-front-ui/c7n-ui/lib/TooltipPro";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import React, { useMemo } from 'react';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { observer } from 'mobx-react-lite';
import { TableMode, TableQueryBarType } from 'choerodon-ui/pro/lib/table/enum';
import { FieldType } from 'choerodon-ui/pro/lib/data-set/enum';
import { HZERO_HMDE } from "hzero-front-apaas/lib/utils/config";
import { lowcodeOrganizationURL, uuid } from "hzero-front-hmde/lib/utils/common";
import ImgIcon from "hzero-front-hmde/lib/utils/ImgIcon";
import { checkError } from "./utils";
var FN = /*#__PURE__*/function (FN) {
  FN["TEMPLATE_NAME"] = "templateFieldName";
  FN["TEMPLATE_CODE"] = "templateFieldCode";
  FN["COMPONENT_TYPE_MEADING"] = "componentTypeMeaning";
  FN["FIELD_BEHAVIORR_MEANING"] = "fieldBehaviorMeaning";
  return FN;
}(FN || {});
const ShowExtendsFieldDetail = ({
  domainId,
  templateCodes
}) => {
  // 这里面可以控制node结点的判断来实现是否展示为叶结点
  const nodeCover = ({
    record
  }) => {
    const nodeProps = {
      isLeaf: false
    };
    if (!(record !== null && record !== void 0 && record.get('domainTemplateFields'))) {
      nodeProps.isLeaf = true;
    }
    return nodeProps;
  };

  // 拍平树结构
  const flathandleData = data => {
    let fieldList = [];
    const originData = data === null || data === void 0 ? void 0 : data.map(item => {
      const _uuid = uuid();
      Object.assign(item, {
        id: _uuid,
        templateFieldName: item.templateName,
        templateFieldCode: item.templateCode
      });
      // 处理字段
      if (item !== null && item !== void 0 && item.domainTemplateFields) {
        var _item$domainTemplateF;
        const arr = item === null || item === void 0 ? void 0 : (_item$domainTemplateF = item.domainTemplateFields) === null || _item$domainTemplateF === void 0 ? void 0 : _item$domainTemplateF.map(i => {
          return {
            ...i,
            parentId: item.id || _uuid,
            id: uuid()
          };
        });
        fieldList = [...fieldList, ...arr];
      }
      return item;
    });
    return [...originData, ...fieldList];
  };
  const tableDs = useMemo(() => new _DataSet({
    primaryKey: 'id',
    parentField: 'parentId',
    autoQuery: true,
    paging: false,
    autoCreate: false,
    selection: false,
    idField: 'id',
    transport: {
      read: ({
        params
      }) => ({
        url: `${lowcodeOrganizationURL({
          route: HZERO_HMDE
        })}/domain-template/relation-no-create-check?domainId=${domainId}&templateCodes=${templateCodes}`,
        method: 'GET',
        params,
        transformResponse: res => {
          try {
            const resData = JSON.parse(res);
            const _data = flathandleData(resData);
            return checkError(_data || []);
          } catch (error) {
            return [];
          }
        }
      })
    },
    fields: [{
      label: intl.get('hmde.common.name').d('名称'),
      name: FN.TEMPLATE_NAME,
      type: "string"
    }, {
      label: intl.get('hmde.common.code').d('编码'),
      name: FN.TEMPLATE_CODE,
      type: "string"
    }, {
      label: intl.get('hmde.common.fieldType').d('字段类型'),
      name: FN.COMPONENT_TYPE_MEADING,
      type: "string"
    }, {
      label: intl.get('hmde.common.extendsWhoField').d('继承行为'),
      name: FN.FIELD_BEHAVIORR_MEANING,
      type: "string"
    }]
  }), []);
  const columns = [{
    name: FN.TEMPLATE_NAME,
    renderer: ({
      record
    }) => {
      return /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center'
        }
      }, /*#__PURE__*/React.createElement("span", null, record === null || record === void 0 ? void 0 : record.get(FN.TEMPLATE_NAME)), ((record === null || record === void 0 ? void 0 : record.get('checkCode')) || (record === null || record === void 0 ? void 0 : record.get('checkExtend'))) && /*#__PURE__*/React.createElement(_Tooltip, {
        title: record !== null && record !== void 0 && record.get('checkCode') ? intl.get('hmde.bo.businessObject.extendsTemFieldTip1').d('编码重复') : intl.get('hmde.bo.businessObject.extendsTemFieldTip2').d('继承行为重复'),
        theme: "dark"
      }, /*#__PURE__*/React.createElement(ImgIcon, {
        name: "tips.svg",
        style: {
          width: '12px',
          verticalAlign: 'sub',
          marginLeft: '3px'
        }
      })));
    }
  }, {
    name: FN.TEMPLATE_CODE
  }, {
    name: FN.COMPONENT_TYPE_MEADING
  }, {
    name: FN.FIELD_BEHAVIORR_MEANING
  }];
  return /*#__PURE__*/React.createElement(_Table, {
    dataSet: tableDs,
    defaultRowExpanded: true,
    virtualCell: false,
    mode: "tree",
    queryBar: "none",
    columns: columns,
    onRow: nodeCover
  });
};
export default formatterCollections({
  code: ['hmde.common', 'hmde.bo']
})(observer(ShowExtendsFieldDetail));