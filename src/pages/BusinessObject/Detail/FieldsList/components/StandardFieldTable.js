import _Table from "@hzero-front-ui/c7n-ui/lib/TablePro";
import _Popconfirm from "@hzero-front-ui/c7n-ui/lib/Popconfirm";
import _Switch from "@hzero-front-ui/c7n-ui/lib/SwitchPro";
import _NumberField from "@hzero-front-ui/c7n-ui/lib/NumberFieldPro";
import _Select from "@hzero-front-ui/c7n-ui/lib/SelectPro";
import _Tooltip from "@hzero-front-ui/c7n-ui/lib/TooltipPro";
import _debounce from "lodash/debounce";
import React, { useMemo } from 'react';
import intl from 'utils/intl';
import { isTenantRoleLevel } from 'utils/utils';
import { observer } from 'mobx-react-lite';
import { operatorRender, yesOrNoRender } from 'utils/renderer';
import { FuncType, ButtonColor } from 'choerodon-ui/pro/lib/button/enum';
import { ColumnAlign, ColumnLock, TableQueryBarType, TableAutoHeightType, DragColumnAlign } from 'choerodon-ui/pro/lib/table/enum';
import { FieldComponentType } from 'hzero-front-apaas/lib/constants/businessObject';
import useDataSetEvents from 'hzero-front-apaas/lib/hooks/useDataSetEvents';
import { FieldType } from "hzero-front-apaas/lib/constants/businessObject";
import ImgIcon from "hzero-front-hmde/lib/utils/ImgIcon";
import { jumpObjectDetail } from "hzero-front-hmde/lib/utils/bo";
import { renderModalConfirm } from "hzero-front-apaas/lib/utils/render";
import { useBoStore } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/stores";
import BOPermissionButton from "hzero-front-hmde/lib/routes/BusinessObject/Detail/components/BOPermissionButton";
import { renderPopConfirmTitle } from "hzero-front-apaas/lib/utils/render";
import { hasMaxLengthFieldList, setDefaultMaxLength } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/FieldsList/AddAndEditField/utils";
import { PhysicalModelType } from "hzero-front-hmde/lib/constants/businessObject";
import { useStore } from "../store";
import {
//  validationRenderer,
handleDealFields, componentTypeFilter } from "../utils";
// import styles from '../index.less';
import MorePropsIcon from "./MoreProps";
const isTenant = isTenantRoleLevel();
const FieldList = props => {
  var _boStore$getState;
  const buttons = props.buttons,
    handleEnable = props.handleEnable,
    handleDetail = props.handleDetail,
    handleDeleteCheck = props.handleDeleteCheck,
    handleDelete = props.handleDelete,
    updateSort = props.updateSort,
    updateRowConfig = props.updateRowConfig,
    handleDragEndBefore = props.handleDragEndBefore,
    renderDragIcon = props.renderDragIcon,
    tableDS = props.tableDS,
    activeKey = props.activeKey,
    creating = props.creating,
    editing = props.editing,
    scrollRef = props.scrollRef,
    predefineDomainFlag = props.predefineDomainFlag,
    physicalModelType = props.physicalModelType,
    baseInfoDS = props.baseInfoDS;
  const _useStore = useStore(),
    _useStore$state = _useStore.state,
    predefineDisabled = _useStore$state.predefineDisabled,
    readOnlyFlag = _useStore$state.readOnlyFlag;
  const boStore = useBoStore();
  const hasPermission = (_boStore$getState = boStore === null || boStore === void 0 ? void 0 : boStore.getState('hasPermission')) !== null && _boStore$getState !== void 0 ? _boStore$getState : true;
  const componentTypeChange = (val, record) => {
    if (record !== null && record !== void 0 && record.get('storageEncryptFlag') && record !== null && record !== void 0 && record.get('businessObjectFieldId')) {
      const msg = intl.get('hmde.bo.businessObject.fieldschangetip1').d(`该字段已开启存储加密, 切换字段类型并发布后可能会对已有数据进行解密, 请确认是否切换?`);
      renderModalConfirm(msg, {
        onOk: () => {
          record === null || record === void 0 ? void 0 : record.set('storageEncryptFlag', false);
          record === null || record === void 0 ? void 0 : record.set('componentType', val);
        }
      });
      return false;
    }
    return true;
  };
  const getSortingFlag = () => {
    const sorting = ['businessObjectFieldName', 'businessObjectFieldCode', 'componentType', 'sourceType', 'masterBusinessObject', 'requiredFlag'].some(field => {
      var _tableDS$getField;
      return tableDS === null || tableDS === void 0 ? void 0 : (_tableDS$getField = tableDS.getField(field)) === null || _tableDS$getField === void 0 ? void 0 : _tableDS$getField.get('order');
    });
    return sorting;
  };
  useDataSetEvents(tableDS, 'load', () => {
    tableDS.forEach(v => {
      v === null || v === void 0 ? void 0 : v.setState('oldComponentTypeValue', v === null || v === void 0 ? void 0 : v.get('componentType'));
    });
  });
  useDataSetEvents(tableDS, 'update', ({
    name,
    value,
    record
  }) => {
    if (name === 'componentType' && value) {
      record === null || record === void 0 ? void 0 : record.setState('showErrorMes', false);
      const data = handleDealFields([{
        businessObjectId: record === null || record === void 0 ? void 0 : record.get('businessObjectId'),
        businessObjectCode: record === null || record === void 0 ? void 0 : record.get('businessObjectCode'),
        sourceType: record === null || record === void 0 ? void 0 : record.get('sourceType'),
        extendCategory: record === null || record === void 0 ? void 0 : record.get('extendCategory'),
        fieldType: record === null || record === void 0 ? void 0 : record.get('fieldType'),
        componentType: value,
        businessObjectFieldName: record === null || record === void 0 ? void 0 : record.get('businessObjectFieldName'),
        businessObjectFieldCode: record === null || record === void 0 ? void 0 : record.get('businessObjectFieldCode')
      }]) || [];
      record === null || record === void 0 ? void 0 : record.set('falseMeaning', undefined);
      record === null || record === void 0 ? void 0 : record.set('trueMeaning', undefined);
      record === null || record === void 0 ? void 0 : record.set('optionSettings', undefined);
      record === null || record === void 0 ? void 0 : record.set('attributeJson', {});
      record === null || record === void 0 ? void 0 : record.setState('editType', true);
      record === null || record === void 0 ? void 0 : record.setState('oldComponentTypeValue', value);
      Object.keys(data[0] || {}).filter(it => !['__id', '_status', '_token'].includes(it)).forEach(key => {
        var _data$;
        record === null || record === void 0 ? void 0 : record.set(key, data === null || data === void 0 ? void 0 : (_data$ = data[0]) === null || _data$ === void 0 ? void 0 : _data$[key]);
      });

      // 最大长度处理
      if (hasMaxLengthFieldList.includes(value)) {
        if (!(record !== null && record !== void 0 && record.get('maxLength'))) {
          setDefaultMaxLength(record, value);
        }
      } else {
        record === null || record === void 0 ? void 0 : record.set('maxLength', undefined);
      }
    }
  });
  const handleChange = ({
    record,
    value,
    name
  }) => record === null || record === void 0 ? void 0 : record.set(name, value);
  const columns = useMemo(() => {
    return [{
      name: 'seqNum',
      width: 60,
      lock: "left"
    }, {
      name: 'businessObjectFieldName',
      sortable: true,
      minWidth: 130,
      lock: "left",
      editor: record => {
        // 下面的渲染条件取反
        const canEditflag = !(!(record !== null && record !== void 0 && record.getState('editing')) || [FieldType.PREDEFINED].includes(record === null || record === void 0 ? void 0 : record.get('sourceType')) || record !== null && record !== void 0 && record.get('standardFlag') || !(record !== null && record !== void 0 && record.get('operationalFlag')));
        return canEditflag;
      },
      renderer: ({
        record,
        text
      }) => {
        if (!(record !== null && record !== void 0 && record.getState('editing')) || [FieldType.PREDEFINED].includes(record === null || record === void 0 ? void 0 : record.get('sourceType')) || record !== null && record !== void 0 && record.get('standardFlag')) {
          return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("a", {
            onClick: () => handleDetail(record, FieldType.STANDARD)
          }, record === null || record === void 0 ? void 0 : record.get('businessObjectFieldName')), physicalModelType !== 'API' && (record === null || record === void 0 ? void 0 : record.get('templateName')) && !(record !== null && record !== void 0 && record.get('exitTemplateField')) && /*#__PURE__*/React.createElement(_Tooltip, {
            title: intl.get('hmde.bo.businessObject.extendsTemFieldTip3').d('原模板字段被删除或字段属性被修改'),
            theme: "dark"
          }, /*#__PURE__*/React.createElement(ImgIcon, {
            name: "tips.svg",
            style: {
              width: '12px',
              verticalAlign: 'sub',
              margin: '0 0 -3px 3px'
            }
          })));
        }
        return text;
      }
    }, {
      name: 'businessObjectFieldCode',
      sortable: true,
      minWidth: 130,
      lock: "left",
      editor: record => !!(!(record !== null && record !== void 0 && record.get('standardFlag')) && ![FieldType.PREDEFINED].includes(record === null || record === void 0 ? void 0 : record.get('sourceType')) && !!(record !== null && record !== void 0 && record.getState('editing')) && !(record !== null && record !== void 0 && record.get('businessObjectFieldId')) && creating)
    }, physicalModelType === PhysicalModelType.SQL && {
      name: 'useTypeMeaning',
      width: 130,
      sortable: true
    }, {
      name: 'componentType',
      minWidth: 150,
      sortable: true,
      editor: r => !(r !== null && r !== void 0 && r.get('standardFlag')) && ![FieldType.PREDEFINED].includes(r === null || r === void 0 ? void 0 : r.get('sourceType')) && (r === null || r === void 0 ? void 0 : r.get('operationalFlag')) && !!(r !== null && r !== void 0 && r.getState('editing')) && /*#__PURE__*/React.createElement(_Select, {
        searchable: true,
        optionsFilter: option => componentTypeFilter(option, r, physicalModelType),
        onBeforeChange: val => componentTypeChange(val, r)
      })
    }, {
      name: 'maxLength',
      align: 'left',
      minWidth: 100,
      editor: r => !(r !== null && r !== void 0 && r.get('standardFlag')) && ![FieldType.PREDEFINED].includes(r === null || r === void 0 ? void 0 : r.get('sourceType')) && (r === null || r === void 0 ? void 0 : r.get('operationalFlag')) && !!(r !== null && r !== void 0 && r.getState('editing')) && hasMaxLengthFieldList.includes(r === null || r === void 0 ? void 0 : r.get('componentType')) && /*#__PURE__*/React.createElement(_NumberField, {
        name: "maxLength"
      })
    }, {
      // 平台租户字段来源类型
      name: 'sourceType',
      sortable: true,
      minWidth: 150,
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
            return intl.get('hmde.common.field.extendField').d('扩展字段');
          case FieldType.CUSTOM:
            return intl.get('hmde.common.field.customField').d('自定义字段');
          case FieldType.INHERIT:
            return intl.get('hmde.common.standardPersonalization').d('标准-个性化');
          default:
            break;
        }
      }
    }, editing || creating ? {
      name: 'masterBusinessObject',
      minWidth: 150,
      sortable: (a, b, s) => {
        var _a$get, _b$get;
        const nameA = a === null || a === void 0 ? void 0 : (_a$get = a.get('refBusinessObjectName')) === null || _a$get === void 0 ? void 0 : _a$get.toUpperCase();
        const nameB = b === null || b === void 0 ? void 0 : (_b$get = b.get('refBusinessObjectName')) === null || _b$get === void 0 ? void 0 : _b$get.toUpperCase();
        if (s === 'asc') {
          if (nameA < nameB) {
            return -1;
          }
          return 1;
        } else if (s === 'desc') {
          if (nameA < nameB) {
            return 1;
          }
          return -1;
        }
      },
      editor: r => !(r !== null && r !== void 0 && r.get('standardFlag')) && ![FieldType.PREDEFINED].includes(r === null || r === void 0 ? void 0 : r.get('sourceType')) && !!(r !== null && r !== void 0 && r.getState('editing')) && (r === null || r === void 0 ? void 0 : r.get('operationalFlag')) && [FieldComponentType.LINK_RELATION, FieldComponentType.MASTER_RELATION, FieldComponentType.MULTIPLE_RELATION].includes(r === null || r === void 0 ? void 0 : r.get('componentType'))
    } : {
      name: 'refBusinessObjectName',
      minWidth: 150,
      sortable: true,
      renderer: ({
        record,
        text
      }) => {
        // 关联关系多选 需要特殊处理
        let jumpObj = record.get('masterBusinessObject');
        if ((record === null || record === void 0 ? void 0 : record.get('componentType')) === FieldComponentType.MULTIPLE_RELATION) {
          jumpObj = {
            businessObjectId: record === null || record === void 0 ? void 0 : record.get('multiRelMasterBoId'),
            businessObjectName: record === null || record === void 0 ? void 0 : record.get('multiRelMasterBoName')
          };
        }
        return text && /*#__PURE__*/React.createElement("a", {
          onClick: () => jumpObjectDetail(jumpObj)
        }, text);
      }
    }, {
      name: 'requiredFlag',
      minWidth: 150,
      sortable: true,
      renderer: ({
        value,
        record,
        name
      }) => {
        if (record !== null && record !== void 0 && record.get('standardFlag') || !(record !== null && record !== void 0 && record.getState('editing')) || [FieldType.PREDEFINED].includes(record === null || record === void 0 ? void 0 : record.get('sourceType')) || !(record !== null && record !== void 0 && record.get('operationalFlag'))) {
          return yesOrNoRender(value ? 1 : 0);
        }
        return /*#__PURE__*/React.createElement(_Switch, {
          name: "requiredFlag",
          checked: value,
          disabled: [FieldComponentType.SWITCH, FieldComponentType.MASTER_RELATION, FieldComponentType.FORMULA, FieldComponentType.REFERENCE_FIELD].includes(record === null || record === void 0 ? void 0 : record.get('componentType')),
          onChange: val => {
            handleChange({
              value: val,
              record,
              name
            });
          }
        });
      },
      align: "left"
    },
    // 其他属性
    {
      header: intl.get('hmde.common.view.moreProp').d('更多属性'),
      renderer: ({
        record
      }) => /*#__PURE__*/React.createElement(MorePropsIcon, {
        record: record,
        baseInfoDS: baseInfoDS
      }),
      minWidth: 120,
      lock: "right"
    }, {
      name: 'remark',
      editor: r => ![FieldType.PREDEFINED].includes(r === null || r === void 0 ? void 0 : r.get('sourceType')) && (r === null || r === void 0 ? void 0 : r.get('operationalFlag')) && !!(r !== null && r !== void 0 && r.getState('editing')) && !(r !== null && r !== void 0 && r.get('standardFlag'))
    }, physicalModelType !== 'API' && {
      name: 'templateName'
    }, physicalModelType !== PhysicalModelType.SQL && {
      header: intl.get('hmde.common.table.column.operate').d('操作'),
      renderer: ({
        record
      }) => {
        //  根据是否可读属性进行渲染
        if (readOnlyFlag) {
          return /*#__PURE__*/React.createElement(React.Fragment, null);
        }
        // 平台扩展字段不可以删除 租户看到的平台标准字段不可删除
        // 租户自定义也可以编辑
        const canEdit = activeKey || !activeKey && ((record === null || record === void 0 ? void 0 : record.get('sourceType')) === FieldType.EXTEND || (record === null || record === void 0 ? void 0 : record.get('sourceType')) === FieldType.TENANT_CREATED || (record === null || record === void 0 ? void 0 : record.get('sourceType')) === FieldType.INHERIT || (record === null || record === void 0 ? void 0 : record.get('sourceType')) === FieldType.CUSTOM);
        const middleFieldFlag = !creating && !(record !== null && record !== void 0 && record.get('operationalFlag')) && activeKey === FieldType.STANDARD; // 只有标准字段才需要考虑中间对象
        const list = [];
        const getDeleteBtn = () => {
          // sql 对象不允许删除
          if (physicalModelType === PhysicalModelType.SQL) {
            return null;
          }
          if (record !== null && record !== void 0 && record.getState('editing') && creating) {
            return (
              /*#__PURE__*/
              // <a disabled={!hasPermission} onClick={() => tableDS.remove(record)}>
              //   {intl.get('hmde.common.button.delete').d('删除')}
              // </a>
              React.createElement(BOPermissionButton, {
                funcType: "link",
                color: "primary",
                loading: record === null || record === void 0 ? void 0 : record.getState('visibleLoading'),
                disabled: !hasPermission,
                onClick: () => {
                  if (record !== null && record !== void 0 && record.get('businessObjectFieldId')) {
                    handleDelete(record, true);
                  } else {
                    tableDS.remove(record);
                  }
                }
              }, intl.get('hmde.common.button.delete').d('删除'))
            );
          }
          if (middleFieldFlag && (record === null || record === void 0 ? void 0 : record.get('componentType')) !== FieldComponentType.MULTIPLE_RELATION) {
            return /*#__PURE__*/React.createElement(_Tooltip, {
              title: intl.get('hmde.bo.businessObject.middleHelpTooltip').d('与目标对象关系成立的从主字段，不允许删除。')
            }, /*#__PURE__*/React.createElement("span", {
              style: {
                color: 'rgb(140, 140, 140)'
              }
            }, intl.get('hmde.common.button.delete').d('删除')));
          }
          return editing || creating && !record.getState('editing') ? /*#__PURE__*/React.createElement("span", {
            style: {
              color: 'rgb(140, 140, 140)'
            }
          }, intl.get('hmde.common.button.delete').d('删除')) : /*#__PURE__*/React.createElement(_Popconfirm, {
            onConfirm: () => handleDelete(record),
            onVisibleChange: v => handleDeleteCheck(record, v),
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
        const operators = [{
          key: 'delete',
          ele: getDeleteBtn(),
          len: 4,
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
          var _baseInfoDS$current, _baseInfoDS$current2;
          const dimensionFlag = ['dimension', 'dimensionValue'].includes(record === null || record === void 0 ? void 0 : record.get('businessObjectFieldCode')) && (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current = baseInfoDS.current) === null || _baseInfoDS$current === void 0 ? void 0 : _baseInfoDS$current.get('businessObjectCategory')) === 'DIMENSION';
          if (
          // 模版字段 + 模版字段被删除 = 可以删除
          // 新增逻辑 api对象的模版字段可以删除
          (!(record !== null && record !== void 0 && record.get('standardFlag')) || !(record !== null && record !== void 0 && record.get('exitTemplateField')) || (baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current2 = baseInfoDS.current) === null || _baseInfoDS$current2 === void 0 ? void 0 : _baseInfoDS$current2.get('physicalModelType')) === 'API') && !predefineDisabled && !predefineDomainFlag && !dimensionFlag) {
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
    }].filter(Boolean);
  }, [readOnlyFlag, activeKey, creating, editing, predefineDisabled, isTenant]);
  return /*#__PURE__*/React.createElement(_Table, {
    dataSet: tableDS,
    columns: columns,
    rowDraggable: (tableDS === null || tableDS === void 0 ? void 0 : tableDS.getState('dragFlag')) && !readOnlyFlag && !editing && !getSortingFlag() && hasPermission,
    dragColumnAlign: "left",
    buttons: buttons,
    onDragEnd: dataSet => {
      updateSort(dataSet);
    },
    queryFields: {
      componentTypes: /*#__PURE__*/React.createElement(_Select, {
        name: "componentTypes",
        searchable: true
      })
    },
    onRow: ({
      record
    }) => {
      return updateRowConfig(record);
    },
    onDragEndBefore: handleDragEndBefore,
    rowDragRender: {
      renderIcon: renderDragIcon
    },
    autoHeight: {
      type: "maxHeight",
      diff: 10
    },
    queryBar: "filterBar",
    queryBarProps: {
      fuzzyQueryPlaceholder: intl.get('hmde.bo.businessObject.fieldscodeAndname').d('请输入字段名称、编码等')
    },
    onScrollTop: _debounce(a => {
      scrollRef.current = a;
    }, 300)
  });
};
export default observer(FieldList);