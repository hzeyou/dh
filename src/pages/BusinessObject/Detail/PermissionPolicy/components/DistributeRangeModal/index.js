import _Alert from "@hzero-front-ui/c7n-ui/lib/Alert";
import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import _SelectBox from "@hzero-front-ui/c7n-ui/lib/SelectBoxPro";
import _isUndefined from "lodash/isUndefined";
import _isNumber from "lodash/isNumber";
import React, { useCallback, useEffect, useRef } from 'react';
import { useDataSet } from 'utils/hooks';
import { FieldType } from 'choerodon-ui/pro/lib/data-set/enum';
import { observer } from 'mobx-react-lite';
import { getResponse, isTenantRoleLevel } from 'utils/utils';
import notification from 'utils/notification';
import intl from 'hzero-front/lib/utils/intl';
import { FieldsNameTypes as PermissionDistributionFN, OptionalDistributeDS, SelectedDistributeDS } from "hzero-front-hmde/lib/stores/BusinessObject/PermissionDistributeDS";
import { FieldsNameTypes as PermissionPolicyFN } from "hzero-front-hmde/lib/stores/BusinessObject/PermissionPolicyDS";
import { postPermissionDistribute } from "hzero-front-hmde/lib/services/permissionPolicy";
import useDataSetLoadFirst from "hzero-front-hmde/lib/hooks/useDataSetLoadFirst";
import TransferRange from "../TransferRange";
const Option = _SelectBox.Option;
const OPTION_KEYS = {
  ALL: 'all',
  RANGE: 'range'
};
const FILED_NAME_RANGE = 'range';
let objectVersionNumber = 0;

/**
 * 分配的弹框
 * @param dataSet
 * @param modal
 * @param record
 * @constructor
 */
const DistributeRangeModal = ({
  distributeDs,
  distributePermissionDs,
  modal,
  record,
  usedPermissionDs,
  baseInfoDs
}) => {
  var _formDs$current2, _formDs$current6;
  const pdOptionalDs = useDataSet(() => new _DataSet(OptionalDistributeDS())); // 选项数据
  const pdSelectedDs = useDataSet(() => new _DataSet(SelectedDistributeDS())); // 已选数据

  const serverSelectedDataRef = useRef([]); // 后端目前存的已选择的数据
  const optionalRecordTotal = useRef([]); // 选项总数据
  const selectedRecordTotal = useRef([]); // 已选择总数据

  const singleFlag = useRef(false); // 单例标识

  // 监听数据初次加载, 缓存总数据
  useDataSetLoadFirst(pdOptionalDs, ({
    dataSet
  }) => {
    optionalRecordTotal.current = [...dataSet.records];
  });
  useDataSetLoadFirst(pdSelectedDs, ({
    dataSet
  }) => {
    selectedRecordTotal.current = [...dataSet.records];
  });
  const formDs = useDataSet(() => new _DataSet({
    selection: false,
    autoQuery: false,
    autoCreate: true,
    fields: [{
      label: intl.get('hmde.bo.businessObject.scopeOfAuthorization').d('授权范围'),
      name: FILED_NAME_RANGE,
      type: "string",
      required: true
    }]
  }));
  useEffect(() => {
    var _formDs$current;
    if (((_formDs$current = formDs.current) === null || _formDs$current === void 0 ? void 0 : _formDs$current.get(FILED_NAME_RANGE)) === OPTION_KEYS.RANGE && !singleFlag.current) {
      pdOptionalDs.query().then(() => {
        pdSelectedDs.query(undefined, {
          groupId: record === null || record === void 0 ? void 0 : record.get('groupId'),
          allowAllTenantFlag: isTenantRoleLevel() ? record === null || record === void 0 ? void 0 : record.get('allowAllTenantFlag') : false
        }).then(res => {
          if (getResponse(res)) {
            serverSelectedDataRef.current = res.content;
            pdSelectedDs.loadData(selectedRecordTotal.current);
          }
        });
      });
      // 初始化搜索状态
      pdOptionalDs.setState(PermissionDistributionFN.SEARCH_CONTENT, '');
      pdSelectedDs.setState(PermissionDistributionFN.SEARCH_CONTENT, '');
      singleFlag.current = true;
    }
  }, [(_formDs$current2 = formDs.current) === null || _formDs$current2 === void 0 ? void 0 : _formDs$current2.get(FILED_NAME_RANGE)]);
  useEffect(() => {
    var _formDs$current3;
    const allowAllTenantFlag = isTenantRoleLevel() ? false : record === null || record === void 0 ? void 0 : record.get(PermissionPolicyFN.GRANT_RANGE);
    // eslint-disable-next-line no-unused-expressions
    (_formDs$current3 = formDs.current) === null || _formDs$current3 === void 0 ? void 0 : _formDs$current3.set(FILED_NAME_RANGE, allowAllTenantFlag ? OPTION_KEYS.ALL : OPTION_KEYS.RANGE);
  }, []);
  const refresh = useCallback(allowAllTenantFlag => {
    notification.success({
      message: intl.get('hmde.common.handleSuccess').d('操作成功')
    });
    return Promise.all([distributeDs.query(undefined, {
      allowAllTenantFlag
    }), usedPermissionDs.query()]).then(resArr => {
      const res = resArr[1];
      if (getResponse(res)) {
        var _distributePermission;
        const currentItem = res.find(r => r.groupId === (record === null || record === void 0 ? void 0 : record.get('groupId'))) || {};
        // eslint-disable-next-line no-unused-expressions
        (_distributePermission = distributePermissionDs.current) === null || _distributePermission === void 0 ? void 0 : _distributePermission.set(PermissionPolicyFN.GRANT_RANGE, currentItem.allowAllTenantFlag);
        record === null || record === void 0 ? void 0 : record.set('allowAllTenantFlag', currentItem.allowAllTenantFlag);
        record === null || record === void 0 ? void 0 : record.set('groupTenantList', currentItem.groupTenantList);
        // eslint-disable-next-line prefer-destructuring
        objectVersionNumber = currentItem.objectVersionNumber;
      }
    });
  }, [distributeDs, usedPermissionDs, record]);
  const formatRangeData = useCallback(data => {
    // 判断数据是否是后端存的数据
    const _data = data.map(item => {
      const _item = serverSelectedDataRef.current.find(v => v.id === item.id);
      // 区分租户和平台
      if (_item) {
        if (_isUndefined(_item.tenantId)) {
          return {
            ...item,
            groupTenantAssignId: _item.groupTenantAssignId,
            objectVersionNumber: _item.objectVersionNumber
          };
        } else {
          return {
            ...item,
            groupRoleAssignId: _item.groupRoleAssignId,
            objectVersionNumber: _item.objectVersionNumber
          };
        }
      }
      return item;
    });
    // 数组转 tree
    const newData = [];
    // 遍历数据推出租户
    for (let i = 0; i < _data.length; i++) {
      const item = _data[i];
      if (_isUndefined(item.tenantId)) {
        newData.push({
          tenantId: Number(item.id),
          groupId: record === null || record === void 0 ? void 0 : record.get('groupId'),
          groupTenantAssignId: item.groupTenantAssignId,
          allowAllRoleFlag: item.allowAllRoleFlag,
          groupRoleList: [],
          objectVersionNumber: _isNumber(item.objectVersionNumber) ? item.objectVersionNumber : 0
        });
        _data.splice(i, 1);
        i--;
      }
    }
    _data.forEach(item => {
      // eslint-disable-next-line eqeqeq
      const findData = newData.find(v => v.tenantId == item.tenantId);
      findData.groupRoleList.push({
        groupId: record === null || record === void 0 ? void 0 : record.get('groupId'),
        tenantId: Number(item.tenantId),
        roleId: item.id,
        groupRoleAssignId: item.groupRoleAssignId,
        objectVersionNumber: _isNumber(item.objectVersionNumber) ? item.objectVersionNumber : 0
      });
    });
    return newData;
  }, [record]);
  useEffect(() => {
    // 提交参数
    modal === null || modal === void 0 ? void 0 : modal.handleOk(async () => {
      if (await (formDs === null || formDs === void 0 ? void 0 : formDs.validate())) {
        var _formDs$current4;
        if (((_formDs$current4 = formDs.current) === null || _formDs$current4 === void 0 ? void 0 : _formDs$current4.get(FILED_NAME_RANGE)) === OPTION_KEYS.ALL) {
          // 选择了全部租户
          const res = await postPermissionDistribute({
            groupId: record === null || record === void 0 ? void 0 : record.get('groupId'),
            allowAllTenantFlag: true,
            objectVersionNumber: objectVersionNumber || (record === null || record === void 0 ? void 0 : record.get('objectVersionNumber'))
          });
          if (getResponse(res)) {
            await refresh(true);
          }
        } else {
          var _formDs$current5;
          // 选择了范围
          const data = selectedRecordTotal.current.map(r => r.toData());
          const res = await postPermissionDistribute({
            groupId: record === null || record === void 0 ? void 0 : record.get('groupId'),
            groupTenantList: formatRangeData(data),
            objectVersionNumber: objectVersionNumber || (record === null || record === void 0 ? void 0 : record.get('objectVersionNumber')),
            allowAllTenantFlag: ((_formDs$current5 = formDs.current) === null || _formDs$current5 === void 0 ? void 0 : _formDs$current5.get(FILED_NAME_RANGE)) === OPTION_KEYS.ALL
          });
          if (getResponse(res)) {
            await refresh(false);
          }
        }
        baseInfoDs.query();
        return true;
      }
      return false;
    });
  }, [pdSelectedDs.totalCount]);
  return /*#__PURE__*/React.createElement("div", null, !isTenantRoleLevel() && /*#__PURE__*/React.createElement(_Form, {
    // useColon={false}
    dataSet: formDs
  }, /*#__PURE__*/React.createElement(_SelectBox, {
    name: FILED_NAME_RANGE
  }, /*#__PURE__*/React.createElement(Option, {
    value: OPTION_KEYS.ALL
  }, intl.get('hmde.bo.businessObject.allTenants').d('全部租户')), /*#__PURE__*/React.createElement(Option, {
    value: OPTION_KEYS.RANGE
  }, intl.get('hmde.bo.businessObject.specifiedrange').d('指定范围')))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: ((_formDs$current6 = formDs.current) === null || _formDs$current6 === void 0 ? void 0 : _formDs$current6.get(FILED_NAME_RANGE)) === OPTION_KEYS.RANGE ? 'block' : 'none'
    }
  }, /*#__PURE__*/React.createElement(_Alert, {
    showIcon: true,
    style: {
      margin: '4px'
    },
    message: intl.get('hmde.bo.businessObject.distributeRangeModal.tips').d('仅右侧被分配的租户及角色拥有该权限策略所设定的权限，分配权限策略点击【确定】按钮提交后立即生效'),
    type: "info"
  }), /*#__PURE__*/React.createElement(TransferRange, {
    pdSelectedDs: pdSelectedDs,
    pdOptionalDs: pdOptionalDs,
    optionalRecordTotal: optionalRecordTotal,
    selectedRecordTotal: selectedRecordTotal
  })));
};
export default observer(DistributeRangeModal);