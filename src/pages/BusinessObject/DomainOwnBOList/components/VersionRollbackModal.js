import _Spin from "@hzero-front-ui/c7n-ui/lib/SpinPro";
import _Table from "@hzero-front-ui/c7n-ui/lib/TablePro";
import _Icon from "choerodon-ui/pro/lib/icon";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { useMemo, useEffect, useState } from 'react';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { observer } from 'mobx-react-lite';
import { FieldType } from 'choerodon-ui/pro/lib/data-set/enum';
import { TableQueryBarType } from 'choerodon-ui/pro/lib/table/enum';
var FN = /*#__PURE__*/function (FN) {
  FN["PROPERTY_TYPE"] = "propertyType";
  FN["NAME"] = "businessObjectFieldName";
  FN["CODE"] = "businessValue";
  FN["MESSAGE"] = "message";
  return FN;
}(FN || {});
const computer = {
  FIELD_CODE: intl.get('hmde.common.view.code').d('字段'),
  RECHECK_RULE: intl.get('hmde.common.rules').d('业务规则'),
  BUSINESS_ASSOCIATE: intl.get('hmde.common.advancedRelationship').d('高级关系')
};
const VersionInfoModal = props => {
  const data = props.data,
    modal = props.modal;
  const _useState = useState(true),
    _useState2 = _slicedToArray(_useState, 2),
    spinning = _useState2[0],
    setSpinning = _useState2[1];
  const tableDs = useMemo(() => new _DataSet({
    autoQuery: false,
    selection: false,
    paging: false,
    fields: [{
      name: FN.PROPERTY_TYPE,
      label: intl.get('hmde.bo.businessObject.prop').d('属性'),
      type: "string"
    }, {
      name: FN.NAME,
      label: intl.get('hmde.common.name').d('名称'),
      type: "string"
    }, {
      name: FN.CODE,
      label: intl.get('hmde.common.code').d('编码'),
      type: "string"
    }, {
      name: FN.MESSAGE,
      label: intl.get('hmde.bo.businessObject.reminderInformation').d('提示信息'),
      type: "string"
    }],
    data
  }), []);
  useEffect(() => {
    tableDs.ready().then(() => {
      setSpinning(false);
    });
    modal.update({
      title: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_Icon, {
        type: "error",
        style: {
          fontSize: 20,
          color: 'red',
          verticalAlign: 'middle',
          marginRight: '8px'
        }
      }), intl.get('hmde.bo.businessObject.errortitle').d('版本恢复失败'))
    });
  }, []);
  const columns = [{
    name: FN.PROPERTY_TYPE,
    width: 90,
    renderer: ({
      value
    }) => {
      return computer[value];
    }
  }, {
    name: FN.NAME,
    width: 100,
    renderer: ({
      record,
      value
    }) => {
      const propertyType = record === null || record === void 0 ? void 0 : record.get(FN.PROPERTY_TYPE);
      if (propertyType === 'BUSINESS_ASSOCIATE') {
        // 高级关系
        return record === null || record === void 0 ? void 0 : record.get('associateName');
      } else if (propertyType === 'RECHECK_RULE') {
        // 业务规则
        return record === null || record === void 0 ? void 0 : record.get('ruleName');
      }
      return value;
    }
  }, {
    name: FN.CODE,
    width: 100
  }, {
    name: FN.MESSAGE
  }];
  return /*#__PURE__*/React.createElement(_Spin, {
    spinning: spinning
  }, /*#__PURE__*/React.createElement("h3", null, intl.get('hmde.bo.businessObject.errortip').d('检测到业务对象发布态最新版中存在以下属性不允许删除，请修改相关引用关系后重试。')), /*#__PURE__*/React.createElement(_Table, {
    dataSet: tableDs,
    columns: columns,
    queryBar: "none"
  }));
};
export default formatterCollections({
  code: ['hmde.common', 'hmde.bo']
})(observer(VersionInfoModal));