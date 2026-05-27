import _Tree from "@hzero-front-ui/c7n-ui/lib/TreePro";
import _Popover from "@hzero-front-ui/c7n-ui/lib/Popover";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _Icon from "choerodon-ui/pro/lib/icon";
import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _SelectBox from "@hzero-front-ui/c7n-ui/lib/SelectBoxPro";
import _useDataSet from "choerodon-ui/pro/lib/use-data-set";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _Select from "@hzero-front-ui/c7n-ui/lib/SelectPro";
import _isUndefined from "lodash/isUndefined";
import _forOwn from "lodash/forOwn";
import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { FieldType } from 'choerodon-ui/dataset/data-set/enum';
import { ButtonColor, FuncType } from 'choerodon-ui/pro/lib/button/enum';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import uuid from 'uuid/v4';
import useDataSetEvents from 'hzero-front-apaas/lib/hooks/useDataSetEvents';
import TextOverflow from "hzero-front-apaas/lib/components/TextOverflow";
import boDS, { BoFN } from "../../../../datasets/boDS";
import { getDomainOptional } from "../../../../utils/common";
import { useERStore } from "../../../../stores";
import styles from "./index.less?modules";
var SelectedBoFN = /*#__PURE__*/function (SelectedBoFN) {
  SelectedBoFN["NAME"] = "name";
  SelectedBoFN["ID"] = "id";
  SelectedBoFN["BO_ID"] = "businessObjectId";
  SelectedBoFN["PUBLISH_STATUS"] = "publishStatus";
  SelectedBoFN["ENABLED_FLAG"] = "enabledFlag";
  SelectedBoFN["DOMAIN_ID"] = "domainId";
  SelectedBoFN["DOMAIN_NAME"] = "domainName";
  return SelectedBoFN;
}(SelectedBoFN || {});
const Option = _Select.Option;
const SelectedBoList = () => {
  var _selectedBoDs$queryDa4;
  const erStore = useERStore();
  const _useState = useState([]),
    _useState2 = _slicedToArray(_useState, 2),
    options = _useState2[0],
    setOptions = _useState2[1];
  const cacheListData = useRef([]);
  const selectedBoDs = _useDataSet(() => ({
    autoCreate: false,
    autoQuery: false,
    paging: false,
    idField: 'id',
    parentField: 'parentId',
    expandField: 'isExpanded',
    queryFields: [...boDS().queryFields, {
      name: SelectedBoFN.DOMAIN_ID,
      type: "string",
      multiple: true,
      label: intl.get('hmde.common.domain').d('领域')
    }],
    fields: [{
      name: SelectedBoFN.NAME,
      type: "string"
    }],
    events: {
      load: ({
        dataSet
      }) => {
        // 重载数据后展开所有节点
        dataSet.forEach(record => {
          Object.assign(record, {
            isExpanded: true
          });
        });
      }
    }
  }), []);
  useEffect(() => {
    const graphERData = erStore.getState('graphERData', true);
    // 设置可选领域
    const domains = getDomainOptional(graphERData);
    const domainsOptional = domains.map(domain => /*#__PURE__*/React.createElement(Option, {
      key: domain.domainId,
      value: domain.domainId
    }, domain.domainName));
    setOptions(domainsOptional);
    // 生成树形列表结构
    const flatTree = [];
    graphERData.forEach(domainData => {
      var _domainData$businessO;
      flatTree.push({
        id: domainData.domainId,
        name: domainData.domainName
      });
      (_domainData$businessO = domainData.businessObjectList) === null || _domainData$businessO === void 0 ? void 0 : _domainData$businessO.forEach(boData => {
        flatTree.push({
          id: uuid(),
          // 临时id,避免出现跨领域场景id重叠
          name: boData[BoFN.NAME],
          parentId: domainData.domainId,
          businessObjectId: boData[BoFN.ID],
          businessObjectCode: boData[BoFN.CODE],
          publishStatus: boData[BoFN.PUBLISH_STATUS],
          enabledFlag: boData[BoFN.ENABLED_FLAG],
          category: boData[BoFN.CATEGORY]
        });
      });
    });
    cacheListData.current = flatTree;
    const listData = filterTreeNode();
    selectedBoDs.loadData(listData);
  }, [erStore.getState('graphERData')]);
  useDataSetEvents(selectedBoDs.queryDataSet, 'update', ({
    name
  }) => {
    // 领域和关键词变化时, 重新过滤数据
    if ([SelectedBoFN.DOMAIN_ID, BoFN.KEYWORD].includes(name)) {
      const listData = filterTreeNode();
      selectedBoDs.loadData(listData);
    }
  });
  function filterTreeNode() {
    var _selectedBoDs$queryDa, _selectedBoDs$queryDa2, _filterData$domainId;
    const filterData = ((_selectedBoDs$queryDa = selectedBoDs.queryDataSet) === null || _selectedBoDs$queryDa === void 0 ? void 0 : (_selectedBoDs$queryDa2 = _selectedBoDs$queryDa.current) === null || _selectedBoDs$queryDa2 === void 0 ? void 0 : _selectedBoDs$queryDa2.toData()) || {};
    let listData = cacheListData.current;
    // 过滤条件, 清理出全部
    _forOwn(filterData, (value, key) => {
      if (value === 'ALL') {
        filterData[key] = undefined;
      } else if (value === 'true' || value === 'false') {
        filterData[key] = value === 'true';
      }
    });
    // 1. 筛选出领域
    if (filterData !== null && filterData !== void 0 && (_filterData$domainId = filterData.domainId) !== null && _filterData$domainId !== void 0 && _filterData$domainId.length) {
      listData = listData.filter(item => filterData.domainId.includes(item.id) || filterData.domainId.includes(item.parentId));
    }
    // 2. 筛选输入框内容
    if (filterData[BoFN.KEYWORD]) {
      listData = listData.filter(item => {
        if (item.parentId) {
          return item.name.includes(filterData[BoFN.KEYWORD]) || item.businessObjectCode.includes(filterData[BoFN.KEYWORD]);
        }
        return true;
      });
    }
    // 3. 筛选其余单选状态
    listData = listData.filter(item => {
      if (item.parentId) {
        return (_isUndefined(filterData[BoFN.PUBLISH_STATUS]) || filterData[BoFN.PUBLISH_STATUS] === item.publishStatus) && (_isUndefined(filterData[BoFN.ENABLED_FLAG]) || filterData[BoFN.ENABLED_FLAG] === item.enabledFlag) && (_isUndefined(filterData[BoFN.CATEGORY]) || filterData[BoFN.CATEGORY] === item.category);
      }
      return true;
    });
    // 4. 如果领域下无数据, 则不展示领域
    const domainIds = listData.filter(item => !item.parentId).map(item => item.id);
    const domainCount = {};
    domainIds.forEach(id => {
      domainCount[id] = 0;
    });
    listData.forEach(item => {
      if (item.parentId) {
        domainCount[item.parentId] += 1;
      }
    });
    listData = listData.filter(item => {
      if (!item.parentId) {
        return domainCount[item.id] > 0;
      }
      return true;
    });
    return listData;
  }
  const handleDeleteBo = (e, boId) => {
    e.stopPropagation();
    let selectedBOIds = erStore.getState('selectedBOIds', true);
    selectedBOIds = selectedBOIds.filter(id => id !== boId);
    erStore.setState('selectedBOIds', selectedBOIds);
  };
  const handleSelectNode = boId => {
    erStore.setState('selectedNodeId', boId);
  };
  const renderForm = () => {
    const handleReset = () => {
      var _selectedBoDs$queryDa3;
      (_selectedBoDs$queryDa3 = selectedBoDs.queryDataSet) === null || _selectedBoDs$queryDa3 === void 0 ? void 0 : _selectedBoDs$queryDa3.reset();
    };
    const handleQuery = () => {
      const listData = filterTreeNode();
      selectedBoDs.loadData(listData);
    };
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: 380
      }
    }, /*#__PURE__*/React.createElement(_Form, {
      dataSet: selectedBoDs.queryDataSet,
      labelWidth: 80
    }, /*#__PURE__*/React.createElement(_SelectBox, {
      name: BoFN.PUBLISH_STATUS
    }), /*#__PURE__*/React.createElement(_SelectBox, {
      name: BoFN.ENABLED_FLAG
    }), /*#__PURE__*/React.createElement(_SelectBox, {
      name: BoFN.CATEGORY
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%',
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(_Button, {
      onClick: handleReset
    }, intl.get('hmde.common.reset').d('重置')), /*#__PURE__*/React.createElement(_Button, {
      color: "primary",
      onClick: () => handleQuery()
    }, intl.get('hmde.common.button.query').d('查询'))));
  };
  const nodeRenderer = ({
    record
  }) => {
    if (!record) return null;
    const name = record.get(SelectedBoFN.NAME);
    if (!record.get('parentId')) {
      return name;
    }
    return /*#__PURE__*/React.createElement("div", {
      className: styles.item,
      onClick: () => handleSelectNode(record.get(SelectedBoFN.BO_ID))
    }, /*#__PURE__*/React.createElement(TextOverflow, {
      text: name,
      width: 160
    }), /*#__PURE__*/React.createElement(_Button, {
      icon: "delete_black-o",
      funcType: "link",
      style: {
        color: 'rgba(0,0,0,0.65)'
      },
      onClick: e => handleDeleteBo(e, record.get(SelectedBoFN.BO_ID))
    }));
  };
  const onTreeNode = ({
    record
  }) => {
    if (!record) return {};
    return {
      style: record.get('parentId') ? {
        marginLeft: -24,
        width: 'calc(100% + 24px)'
      } : {
        fontWeight: 'bold'
      }
    };
  };
  return /*#__PURE__*/React.createElement("div", {
    className: styles.wrapper
  }, /*#__PURE__*/React.createElement(_Form, {
    dataSet: selectedBoDs.queryDataSet,
    columns: 1,
    labelWidth: 40
  }, /*#__PURE__*/React.createElement(_Select, {
    name: SelectedBoFN.DOMAIN_ID,
    placeholder: intl.get('hmde.bo.businessObjectAudit.chooseDomain').d('请选择领域')
  }, options)), /*#__PURE__*/React.createElement("div", {
    className: styles['search-form']
  }, /*#__PURE__*/React.createElement(_TextField, {
    prefix: /*#__PURE__*/React.createElement(_Icon, {
      type: "search",
      style: {
        color: '#D0D0D0'
      }
    }),
    placeholder: intl.get('hmde.bo.businessObject.objectModelPlaceholder').d('请搜索对象名称/编码'),
    className: styles.input,
    record: (_selectedBoDs$queryDa4 = selectedBoDs.queryDataSet) === null || _selectedBoDs$queryDa4 === void 0 ? void 0 : _selectedBoDs$queryDa4.current,
    name: BoFN.KEYWORD
  }), /*#__PURE__*/React.createElement("div", {
    className: styles['more-action']
  }, /*#__PURE__*/React.createElement(_Popover, {
    overlayStyle: {
      zIndex: 11
    },
    trigger: "hover",
    placement: "bottomLeft",
    content: renderForm()
  }, /*#__PURE__*/React.createElement(_Button, {
    funcType: "raised",
    icon: "filter2"
  })))), selectedBoDs.totalCount > 0 ? /*#__PURE__*/React.createElement(_Tree, {
    dataSet: selectedBoDs,
    checkable: false,
    selectable: false,
    renderer: nodeRenderer,
    onTreeNode: onTreeNode,
    className: styles.tree
  }) : /*#__PURE__*/React.createElement("div", {
    className: styles.empty
  }, intl.get('hmde.common.nodata').d('暂无数据')));
};
export default formatterCollections({
  code: ['hmde.common', 'hmde.bo']
})(observer(SelectedBoList));