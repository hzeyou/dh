import _Table from "@hzero-front-ui/c7n-ui/lib/TablePro";
import _Select from "@hzero-front-ui/c7n-ui/lib/SelectPro";
import _Popconfirm from "@hzero-front-ui/c7n-ui/lib/Popconfirm";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import React from 'react';
import intl from 'utils/intl';
import { isTenantRoleLevel } from 'utils/utils';
import { observer } from 'mobx-react-lite';
import { operatorRender } from 'utils/renderer';
import { FuncType, ButtonColor } from 'choerodon-ui/pro/lib/button/enum';
import { ColumnLock, TableQueryBarType, TableAutoHeightType } from 'choerodon-ui/pro/lib/table/enum';
import { FieldType } from "hzero-front-apaas/lib/constants/businessObject";
import BOPermissionButton from "hzero-front-hmde/lib/routes/BusinessObject/Detail/components/BOPermissionButton";
import { renderPopConfirmTitle } from "hzero-front-apaas/lib/utils/render";
import { useStore } from "../store";
import { validationRenderer } from "../utils";
import styles from "../index.less?modules";
const isTenant = isTenantRoleLevel();
const FieldList = props => {
  const buttons = props.buttons,
    handleEnable = props.handleEnable,
    handleDetail = props.handleDetail,
    handleDeleteCheck = props.handleDeleteCheck,
    handleDelete = props.handleDelete,
    tableDS = props.tableDS,
    activeKey = props.activeKey,
    creating = props.creating,
    editing = props.editing;
  const _useStore = useStore(),
    _useStore$state = _useStore.state,
    predefineDisabled = _useStore$state.predefineDisabled,
    readOnlyFlag = _useStore$state.readOnlyFlag;
  const handleChange = ({
    record,
    value,
    name
  }) => record === null || record === void 0 ? void 0 : record.set(name, value);
  const columns = React.useMemo(() => {
    const _columns = [{
      name: 'extendFieldCode',
      sortable: true,
      renderer: ({
        value,
        record,
        name
      }) => {
        if (!!(record !== null && record !== void 0 && record.getState('editing')) && creating && !(record !== null && record !== void 0 && record.get('standardFlag'))) {
          return /*#__PURE__*/React.createElement(_TextField, {
            required: true,
            maxLength: 60,
            className: styles['bo-name'],
            name: "extendFieldCode",
            value: record === null || record === void 0 ? void 0 : record.get('extendFieldCode'),
            onChange: val => handleChange({
              value: val,
              record,
              name
            }),
            validationRenderer: res => validationRenderer(res, intl.get('hmde.bo.businessObject.extensionCode').d('扩展字段编码'))
          });
        }
        return /*#__PURE__*/React.createElement("a", {
          onClick: () => handleDetail(record, FieldType.EXTEND)
        }, value);
      }
    }, {
      name: 'componentType',
      sortable: true,
      editor: r => !(r !== null && r !== void 0 && r.get('standardFlag')) && !!(r !== null && r !== void 0 && r.getState('editing')) && creating
    }, {
      // 平台租户字段来源类型
      name: 'extendCategory',
      renderer: ({
        value: fieldType
      }) => {
        switch (fieldType) {
          case FieldType.PREDEFINED:
            return intl.get('hmde.common.field.presetField').d('预置字段');
          case FieldType.STANDARD:
            return intl.get('hmde.common.field.standardField').d('标准字段');
          case FieldType.EXTEND:
          case FieldType.EXTEND_TABLE:
          case FieldType.TENANT_CREATED:
          case FieldType.FLEX_FIELD:
            return intl.get('hmde.common.field.extendField').d('扩展字段');
          case FieldType.CUSTOM:
            return intl.get('hmde.common.field.customField').d('自定义字段');
          case FieldType.INHERIT:
            return intl.get('hmde.common.standardPersonalization').d('标准-个性化');
          default:
            break;
        }
      }
    }, {
      name: 'remark',
      editor: r => !(r !== null && r !== void 0 && r.get('standardFlag')) && !!(r !== null && r !== void 0 && r.getState('editing'))
    }, {
      header: intl.get('hmde.common.table.column.operate').d('操作'),
      width: 120,
      renderer: ({
        record
      }) => {
        //  根据是否可读属性进行渲染
        if (readOnlyFlag) {
          return /*#__PURE__*/React.createElement(React.Fragment, null);
        }
        // 平台扩展字段不可以删除 租户看到的平台标准字段不可删除
        // 租户自定义也可以编辑
        const canEdit = activeKey;
        const getDeleBtn = () => {
          if (record !== null && record !== void 0 && record.getState('editing') && creating) {
            return /*#__PURE__*/React.createElement("a", {
              onClick: () => tableDS.remove(record)
            }, intl.get('hmde.common.button.delete').d('删除'));
          }
          return editing || creating && !record.getState('editing') ? /*#__PURE__*/React.createElement("span", {
            style: {
              color: 'rgb(140, 140, 140)'
            }
          }, intl.get('hmde.common.button.delete').d('删除')) : /*#__PURE__*/React.createElement(_Popconfirm, {
            onConfirm: () => handleDelete(record),
            onVisibleChange: v => handleDeleteCheck(record, v, true),
            trigger: "click",
            placement: "top",
            visible: record === null || record === void 0 ? void 0 : record.getState('visible'),
            title: renderPopConfirmTitle(record === null || record === void 0 ? void 0 : record.getState('confirmText'), intl.get('hmde.bo.businessObject.deletetip').d('是否删除'))
          }, /*#__PURE__*/React.createElement(BOPermissionButton, {
            funcType: "link",
            color: "primary",
            loading: record === null || record === void 0 ? void 0 : record.getState('visibleLoading')
          }, intl.get('hmde.common.button.delete').d('删除')));
        };
        const list = [];
        const operators = [{
          key: 'delete',
          ele: getDeleBtn(),
          len: 2,
          // ele里面的中文长度是多少就写多少
          title: ''
        }, {
          key: 'enableFlag',
          ele: /*#__PURE__*/React.createElement(_Popconfirm, {
            onConfirm: () => handleEnable(record),
            placement: "top",
            title: intl.get('hmde.bo.businessObject.enableConfirm').d('请确认是否禁用该字段，禁用字段后不影响已配置内容，但后续将不再能选到该字段。')
          }, /*#__PURE__*/React.createElement("a", null, !(record !== null && record !== void 0 && record.get('enabledFlag')) ? intl.get('hmde.common.button.enable').d('启用') : intl.get('hmde.common.button.disable').d('禁用'))),
          len: 2,
          // ele里面的中文长度是多少就写多少
          title: !(record !== null && record !== void 0 && record.get('enabledFlag')) ? intl.get('hmde.common.button.enable').d('启用') : intl.get('hmde.common.button.disable').d('禁用') // title写国际化
        }];
        if (!isTenant) {
          if (!(record !== null && record !== void 0 && record.get('standardFlag')) && !predefineDisabled) {
            // 标准字段包含了预置字段
            list.push(operators[0]);
            record === null || record === void 0 ? void 0 : record.setState('deleteFlag', true);
          }
        }
        return canEdit ? operatorRender(list, record, {
          limit: 3
        }) : null;
      },
      lock: "right"
    }];
    return _columns.filter(Boolean);
  }, [creating, editing, readOnlyFlag, activeKey, isTenant, predefineDisabled]);
  return /*#__PURE__*/React.createElement(_Table, {
    dataSet: tableDS,
    columns: columns,
    buttons: buttons,
    queryFields: {
      componentTypes: /*#__PURE__*/React.createElement(_Select, {
        name: "componentTypes",
        searchable: true
      })
    },
    autoHeight: {
      type: "maxHeight",
      diff: 50
    },
    queryBar: "filterBar",
    queryBarProps: {
      fuzzyQueryPlaceholder: intl.get('hmde.bo.businessObject.enterthefieldcode').d('请输入字段编码')
    }
  });
};
export default observer(FieldList);