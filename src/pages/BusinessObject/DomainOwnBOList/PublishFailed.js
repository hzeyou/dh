import _Table from "@hzero-front-ui/c7n-ui/lib/TablePro";
import _DataSet from "choerodon-ui/pro/lib/data-set";
// 物理模型不存在或扩展物理模型不存在 则弹窗报错提示框

import React, { useMemo, useEffect, useImperativeHandle } from 'react';
import intl from 'utils/intl';
import { observer } from 'mobx-react-lite';
import formatterCollections from 'utils/intl/formatterCollections';
import { TableColumnTooltip } from 'choerodon-ui/pro/lib/table/enum';
import { tableDS, domainDS } from "./PublishFailedDS";
const PublishFailed = ({
  data = [],
  type,
  modalRef
}) => {
  const tableDs = useMemo(() => new _DataSet(tableDS()), []);
  const domainDs = useMemo(() => new _DataSet(domainDS()), []);
  useImperativeHandle(modalRef, () => ({
    tableDs,
    domainDs
  }));
  useEffect(() => {
    const ds = type === 'TABLE' ? tableDs : domainDs;
    ds.loadData(data);
  }, []);
  const tableColumns = useMemo(() => [{
    name: 'codeNumber',
    tooltip: "overflow",
    width: 60,
    renderer: ({
      record
    }) => {
      return +((record || {}).index || 0) + 1;
    }
  }, {
    name: 'businessObjectName',
    tooltip: "overflow"
  }, {
    name: 'message',
    tooltip: "overflow"
  }], []);
  const domainColumns = useMemo(() => [{
    name: 'codeNumber',
    tooltip: "overflow",
    width: 60,
    renderer: ({
      record
    }) => {
      return +((record || {}).index || 0) + 1;
    }
  }, {
    name: 'businessObjectName',
    tooltip: "overflow"
  }, {
    name: 'domainName',
    tooltip: "overflow"
  }, {
    name: 'domainCode',
    tooltip: "overflow"
  }], []);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("section", {
    style: {
      color: 'rgba(0,0,0,0.85)'
    }
  }, type === 'TABLE' ? intl.get(`hmde.bo.modeler.publishModal.noTableTips`).d('检测到以下业务对象的关联物理模型/扩展物理模型不存在，需修复后方可发布。') : intl.get(`hmde.bo.modeler.publishModal.noAccessTips`).d('检测到以下对象在领域配置未开启“允许更新物理模型”，不允许创建物理模型，请联系管理员')), /*#__PURE__*/React.createElement(_Table, {
    dataSet: type === 'TABLE' ? tableDs : domainDs,
    columns: type === 'TABLE' ? tableColumns : domainColumns
  }));
};
export default formatterCollections({
  code: ['hmde.bo']
})(observer(PublishFailed));