import _Table from "@hzero-front-ui/c7n-ui/lib/TablePro";
import _Select from "@hzero-front-ui/c7n-ui/lib/SelectPro";
import _Icon from "choerodon-ui/pro/lib/icon";
import React, { useMemo } from 'react';
import formatterCollections from 'utils/intl/formatterCollections';
import { observer } from 'mobx-react-lite';
import { TableQueryBarType, ColumnAlign, TableColumnTooltip, ColumnLock, TableMode } from 'choerodon-ui/pro/lib/table/enum';
import intl from 'utils/intl';
import { operatorRender } from 'utils/renderer';
import useDataSetEvents from 'hzero-front-apaas/lib/hooks/useDataSetEvents';
// import { uuid } from '@hmde/utils/common';

import { ParamsTableFN } from "../datasets";
// import AddField from './AddField';

const App = ({
  ds,
  otherDs,
  otherList,
  handleShowDetail,
  type,
  activeKey,
  objectFieldListDs,
  isApiTenantType = false,
  readonly = false
}) => {
  useDataSetEvents(ds, 'update', ({
    name,
    value,
    record
  }) => {
    // 获取出参入参的数据
    if (name === ParamsTableFN.PARAMS_MAP) {
      if (value === 'CUSTOM') {
        record.set('mappingType', 'CUSTOM');
      } else if (value) {
        record.set('mappingType', 'FIELD');
      } else {
        record.set('mappingType', 'UNDEFINED');
      }
    }
  });
  const handleOptionsFilterXW = (option, r) => {
    // 过滤已经选过的
    if ((option === null || option === void 0 ? void 0 : option.get('businessObjectFieldId')) === 'CUSTOM') {
      // 分页查询、列表查询、泳道分页、泳道列表、查询数量api的入参可以有自定义属性，出参没有；
      // 其他api、单条查询的出入参都没有
      // 若参数名与字段列表某个字段编码重复，则【映射字段】中无【自定义属性】
      if (['PAGE', 'LIST', 'LANE_LIST', 'LANE_PAGE', 'COUNT'].includes(activeKey) && type === 'INPUT' && !(objectFieldListDs !== null && objectFieldListDs !== void 0 && objectFieldListDs.find(v => (v === null || v === void 0 ? void 0 : v.get('businessObjectFieldCode')) === (r === null || r === void 0 ? void 0 : r.get('paramName'))))) {
        return option;
      }
      return false;
    }
    if (ds !== null && ds !== void 0 && ds.some(v => (v === null || v === void 0 ? void 0 : v.get('businessObjectFieldId')) === (option === null || option === void 0 ? void 0 : option.get('businessObjectFieldId')) && (v === null || v === void 0 ? void 0 : v.get('id1')) !== (r === null || r === void 0 ? void 0 : r.get('id1')))) {
      return false;
    }
    return option;
  };
  const optionRenderer = ({
    value,
    text
  }) => {
    if (value === 'CUSTOM') {
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_Icon, {
        type: "settings-o",
        style: {
          margin: '-3px 3px 0 0'
        }
      }), text);
    }
    return text;
  };
  const columns = useMemo(() => {
    return [{
      name: ParamsTableFN.PARAMS_NAME,
      align: "left",
      tooltip: "overflow",
      width: 220,
      lock: 'left'
    }, {
      name: ParamsTableFN.PARAMS_REMARK,
      align: "left",
      tooltip: "overflow"
    }, {
      name: ParamsTableFN.REQUIRE_TYPE,
      align: "left",
      tooltip: "overflow",
      width: 150
    }, (type === 'OUTPUT' || !['PAGE', 'QUERY', 'LIST', 'COUNT', 'LANE_LIST', 'LANE_PAGE'].includes(activeKey)) && {
      name: ParamsTableFN.MAN_LENGTH,
      align: "left",
      tooltip: "overflow"
    }, (type === 'OUTPUT' || !['PAGE', 'QUERY', 'LIST', 'COUNT', 'LANE_LIST', 'LANE_PAGE'].includes(activeKey)) && {
      name: ParamsTableFN.DECIMALS,
      align: "left",
      tooltip: "overflow"
    }, type === 'INPUT' && {
      name: ParamsTableFN.IS_REQUIRED,
      align: "left",
      tooltip: "overflow",
      width: 100
    }, {
      name: ParamsTableFN.BEHAVIOR,
      align: "left",
      tooltip: "overflow",
      width: 200
    }, {
      name: ParamsTableFN.PRIMARY_KEY,
      align: "left",
      tooltip: "overflow",
      width: 100
    }, {
      name: ParamsTableFN.PARAMS_MAP,
      align: "left",
      tooltip: "overflow",
      // editor: true,
      editor: r => {
        if (readonly) return false;
        const whoFieldArr = ['OBJECT_VERSION_NUMBER', 'CREATED_BY', 'CREATION_DATE', 'LAST_UPDATED_BY', 'LAST_UPDATE_DATE', 'TENANT_ID'];

        // 永道分页 永道列表 出参 第一层去掉字段映射
        if (type === 'OUTPUT' && ['LANE_LIST', 'LANE_PAGE'].includes(activeKey) && !(r !== null && r !== void 0 && r.get('parentId1'))) {
          return null;
        }
        if ((r === null || r === void 0 ? void 0 : r.get(ParamsTableFN.REQUIRE_TYPE)) !== 'Array' && !(r !== null && r !== void 0 && r.get(ParamsTableFN.PRIMARY_KEY)) && (!(r !== null && r !== void 0 && r.get(ParamsTableFN.BEHAVIOR)) || whoFieldArr.includes(r === null || r === void 0 ? void 0 : r.get(ParamsTableFN.BEHAVIOR)))) {
          return /*#__PURE__*/React.createElement(_Select, {
            optionsFilter: options => handleOptionsFilterXW(options, r),
            name: ParamsTableFN.BEHAVIOR,
            optionRenderer: ({
              value,
              text
            }) => optionRenderer({
              value,
              text
            })
          });
        }
        return null;
      },
      width: 150
    }, {
      header: intl.get('hmde.common.table.column.operate').d('操作'),
      align: "left",
      width: 110,
      renderer: ({
        record
      }) => {
        const operators = [(record === null || record === void 0 ? void 0 : record.get('mappingType')) === 'FIELD' && {
          key: 'syncParamsq',
          ele: /*#__PURE__*/React.createElement("a", {
            disabled: isApiTenantType,
            onClick: () => handleFieldDetail(record)
          }, intl.get('hmde.common.fieldDetail').d('字段详情')),
          len: 5,
          title: intl.get('hmde.common.fieldDetail').d('字段详情')
        }, (record === null || record === void 0 ? void 0 : record.get('mappingType')) === 'CUSTOM' && {
          key: 'syncParamsq',
          ele: /*#__PURE__*/React.createElement("a", {
            disabled: isApiTenantType,
            onClick: () => handleCustomField(record)
          }, intl.get('hmde.bo.businessObject.attributeConfiguration').d('属性配置')),
          len: 5,
          title: intl.get('hmde.bo.businessObject.attributeConfiguration').d('属性配置')
        }].filter(Boolean);
        return operatorRender(operators, record, {
          limit: 2
        });
      },
      lock: "right"
    }].filter(Boolean);
  }, [otherList, otherDs]);

  // const handleAdd = () => {
  //   Modal.open({
  //     title: '添加参数',
  //     style: { width: '957px' },
  //     closable: true,
  //     border: false,
  //     autoCenter: true,
  //     children: <AddField data={addList} ds={ds} />,
  //   });
  // };

  // const handleDelete = () => {
  //   ds.selected.forEach((v) => {
  //     if (v.get('paramType')?.toLocaleLowerCase() === 'array') {
  //       ds.forEach((it) => {
  //         if (it?.get('parentId1') === v?.get('id1')) {
  //           ds.select(it);
  //         }
  //       });
  //     }
  //   });
  //   ds.delete(ds.selected);
  // };

  const handleFieldDetail = record => {
    handleShowDetail(record === null || record === void 0 ? void 0 : record.get('businessObjectFieldId'));
  };

  // 自定义属性
  const handleCustomField = record => {
    handleShowDetail(null, record);
  };
  return /*#__PURE__*/React.createElement(_Table, {
    dataSet: ds,
    queryBar: "filterBar",
    mode: "tree",
    defaultRowExpanded: true,
    virtualCell: false,
    queryBarProps: {
      fuzzyQueryPlaceholder: intl.get('hmde.common.fuzzyQueryPlaceholder1').d('请输入模型名称、接口路径')
    }
    // buttons={[
    //   <Button key="delete" icon="delete_black-o" onClick={handleDelete}>
    //     批量删除
    //   </Button>,
    //   <Button key="add2" icon="add" onClick={handleAdd}>
    //     批量新增
    //   </Button>,
    // ]}
    ,
    columns: columns,
    style: {
      overflow: 'auto'
    }
  });
};
export default formatterCollections({
  code: ['hmde.bo', 'hmde.common']
})(observer(App));