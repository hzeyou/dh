import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
import _isUndefined from "lodash/isUndefined";
import React from 'react';
import { ButtonColor } from 'choerodon-ui/pro/lib/button/enum';
import { observer } from 'mobx-react-lite';
import { useDataSetEvent } from 'utils/hooks';
import { isTenantRoleLevel } from 'utils/utils';
import { FieldsNameTypes } from "hzero-front-hmde/lib/stores/BusinessObject/PermissionDistributeDS";
import TransferCardOptional from "./components/TransferCardOptional";
import TransferCardSelected from "./components/TransferCardSelected";
import styles from "./index.less?modules";
/**
 * 分配范围穿梭框
 * @constructor
 */
const TransferRange = ({
  pdOptionalDs,
  pdSelectedDs,
  optionalRecordTotal,
  selectedRecordTotal
}) => {
  // 根据右侧数据,判断左侧数据变化
  const filterOptional = (optionalDs, selectedRecords) => {
    // 遍历左侧数据, 判断左侧角色级禁用状态, 同时检查租户下被选了多少数据
    optionalRecordTotal.current.forEach(optionalRecord => {
      // 如果是父级, 记录下
      if (_isUndefined(optionalRecord.get('tenantId'))) {
        // 判断租户是否被默认授权
        const targetRecord = selectedRecords.find(r => r.get('id') === optionalRecord.get('id'));
        if (targetRecord) {
          var _optionalRecord$child, _targetRecord$childre;
          // 如果是租户级角色操作,并且是默认授予,则不允许选中租户级子数据
          if (isTenantRoleLevel()) {
            // Object.assign(targetRecord, { selectable: false });
          }
          if (targetRecord.get(FieldsNameTypes.DEFAULT_GRANTED_FLAG)) {
            optionalRecord.set(FieldsNameTypes.DEFAULT_GRANTED_FLAG, true);
            // 只有平台级，在租户设置默认授予的时候禁用
            if (!isTenantRoleLevel()) {
              optionalRecord.setState('defaultGrantedDisabled', true);
            }
          }
          // 判断租户级禁用状态
          const total = ((_optionalRecord$child = optionalRecord.children) === null || _optionalRecord$child === void 0 ? void 0 : _optionalRecord$child.length) || 0;
          const selectedTotal = ((_targetRecord$childre = targetRecord.children) === null || _targetRecord$childre === void 0 ? void 0 : _targetRecord$childre.length) || 0;
          if (total === selectedTotal) {
            Object.assign(optionalRecord, {
              selectable: false,
              isSelected: true
            });
          } else {
            Object.assign(optionalRecord, {
              selectable: true,
              isSelected: false
            });
          }
        } else {
          // 如果右侧不存在该租户, 释放所有选项
          Object.assign(optionalRecord, {
            selectable: true,
            isSelected: false
          });
          optionalRecord.setState('defaultGrantedDisabled', false);
          optionalRecord.set(FieldsNameTypes.DEFAULT_GRANTED_FLAG, false);
        }
      } else {
        // 如果是子级 判断子级是否存在于右侧中
        const targetIndex = selectedRecords.findIndex(r => r.get('id') === optionalRecord.get('id'));
        if (targetIndex !== -1) {
          Object.assign(optionalRecord, {
            selectable: false,
            isSelected: true
          });
        } else {
          Object.assign(optionalRecord, {
            selectable: true,
            isSelected: false
          });
        }
      }
    });
    // 同步记录到视图
    optionalDs.records.forEach(record => {
      const target = optionalRecordTotal.current.find(r => r.get('id') === (record === null || record === void 0 ? void 0 : record.get('id')));
      if (target) {
        Object.assign(record, {
          isSelected: target.isSelected,
          selectable: target.selectable
        });
      }
    });
  };

  // 监听右侧数据,右侧数据变化,设置左侧的禁用状态
  useDataSetEvent(pdSelectedDs, 'load', () => {
    filterOptional(pdOptionalDs, pdSelectedDs.records);
  });

  // 从左往右穿
  const handleToSelected = () => {
    // 左侧选中的数据
    const optionSelectedRecords = optionalRecordTotal.current.filter(r => r.isSelected);
    // 右侧数据
    const alreadySelectedRecords = selectedRecordTotal.current;

    // 合并左侧数据到右侧
    optionSelectedRecords.forEach(optionRecord => {
      const targetIndex = alreadySelectedRecords.findIndex(v => v.get('id') === optionRecord.get('id'));
      if (targetIndex !== -1) {
        alreadySelectedRecords[targetIndex] = optionRecord;
      } else {
        alreadySelectedRecords.unshift(optionRecord);
      }
    });
    pdSelectedDs.loadData(alreadySelectedRecords.map(r => r.toData()));
    // 穿梭的时候需要修改总记录
    // eslint-disable-next-line no-param-reassign
    selectedRecordTotal.current = pdSelectedDs.records;
  };

  // 从右往左穿
  const handleToOptional = () => {
    const selectedRecords = selectedRecordTotal.current.filter(r => r.isSelected);
    const unselectedRecords = selectedRecordTotal.current.filter(r => !r.isSelected);

    // 已选择的数据 如果有租户级数据 判断未选择的数据中是否还存在该租户下角色
    selectedRecords.forEach(selectedRecord => {
      if (_isUndefined(selectedRecord.get('tenantId'))) {
        // 租户级
        const organizationIndex = unselectedRecords.findIndex(v => v.get('tenantId') === selectedRecord.get('id'));
        if (organizationIndex !== -1) {
          unselectedRecords.unshift(selectedRecord);
        }
      }
    });
    pdSelectedDs.loadData(unselectedRecords.map(r => r.toData()));
    // 穿梭的时候需要修改总记录
    // eslint-disable-next-line no-param-reassign
    selectedRecordTotal.current = pdSelectedDs.records;
  };
  return /*#__PURE__*/React.createElement("div", {
    className: styles.wrapper
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.left
  }, /*#__PURE__*/React.createElement(TransferCardOptional, {
    totalRecord: optionalRecordTotal,
    dataSet: pdOptionalDs,
    selectedDs: pdSelectedDs
  })), /*#__PURE__*/React.createElement("div", {
    className: styles.operate
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.buttons
  }, /*#__PURE__*/React.createElement(_Button, {
    color: "primary",
    icon: "keyboard_arrow_right",
    onClick: handleToSelected
  }), /*#__PURE__*/React.createElement(_Button, {
    color: "primary",
    icon: "keyboard_arrow_left",
    onClick: handleToOptional
  }))), /*#__PURE__*/React.createElement("div", {
    className: styles.right
  }, /*#__PURE__*/React.createElement(TransferCardSelected, {
    dataSet: pdSelectedDs,
    totalRecord: selectedRecordTotal
  })));
};
export default observer(TransferRange);