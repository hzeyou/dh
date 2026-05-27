import _Spin from "@hzero-front-ui/c7n-ui/lib/SpinPro";
import _Popover from "@hzero-front-ui/c7n-ui/lib/Popover";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _Icon from "choerodon-ui/pro/lib/icon";
import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
import _SelectBox from "@hzero-front-ui/c7n-ui/lib/SelectBoxPro";
import _Output from "@hzero-front-ui/c7n-ui/lib/OutputPro";
import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _Switch from "@hzero-front-ui/c7n-ui/lib/SwitchPro";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _Select from "@hzero-front-ui/c7n-ui/lib/SelectPro";
import _List from "@hzero-front-ui/c7n-ui/lib/List";
import _debounce from "lodash/debounce";
import React, { useMemo, useEffect } from 'react';
import intl from 'utils/intl';
import { Observer } from 'mobx-react-lite';
import { ButtonType, ButtonColor } from 'choerodon-ui/pro/lib/button/enum';
import formatterCollections from 'utils/intl/formatterCollections';
import TLoader from "./TLoader";
import styles from "../index.less?modules";
import EnableRender from "../TrueOrFalseRender/EnableRender";
import RelationTypeRender from "../TrueOrFalseRender/RelationTypeRender";
const Item = _List.Item;
const Option = _Select.Option;
const SLAVE_MASTER = 'SLAVE_MASTER',
  // 从主
  LINK // 关联
  = 'LINK';
const filterQueryParameters = {
  enabledFlag: undefined,
  associateType: undefined,
  onlySingleFieldFlag: undefined,
  conditionExistedFlag: undefined
};
// 搜索ds
const Index = ({
  autoLoadMore = true,
  leftMenuRef,
  listDs,
  setBusinessObjectAssociateId = () => {}
}) => {
  const TLoaderRef = React.useRef(null);
  const searchValueRef = React.useRef(null);
  const _React$useState = React.useState(''),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    currentId = _React$useState2[0],
    setCurrentId = _React$useState2[1];
  const _React$useState3 = React.useState(true),
    _React$useState4 = _slicedToArray(_React$useState3, 2),
    showLoadingMore = _React$useState4[0],
    setShowLoadingMore = _React$useState4[1];
  const _React$useState5 = React.useState(false),
    _React$useState6 = _slicedToArray(_React$useState5, 2),
    loadingMore = _React$useState6[0],
    setLoadingMore = _React$useState6[1];
  const searchDs = useMemo(() => new _DataSet({
    autoCreate: true,
    fields: [{
      name: 'searchName',
      type: 'string'
    }],
    events: {
      update: ({
        name,
        value
      }) => {
        if (name === 'searchName') {
          searchValueRef.current = value;
        }
      }
    }
  }), []);
  const filterDs = useMemo(() => new _DataSet({
    autoCreate: true,
    fields: [{
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get('hmde.common.status').d('状态'),
      defaultValue: true
    }, {
      name: 'enabledText',
      type: 'string',
      defaultValue: intl.get('hmde.common.button.enable').d('启用')
    }, {
      name: 'associateType',
      type: 'string',
      label: intl.get('hmde.bo.businessObject.relationship').d('关系')
    }, {
      name: 'onlySingleFieldFlag',
      type: 'boolean',
      label: intl.get('hmde.common.label.type').d('类型')
    }, {
      name: 'conditionExistedFlag',
      type: 'boolean',
      label: intl.get('hmde.bo.businessObject.prevConditions').d('前置条件')
    }],
    events: {
      update: ({
        name,
        value,
        record
      }) => {
        if (name === 'searchName') {
          searchValueRef.current = value;
        }
        if (name === 'enabledFlag') {
          record === null || record === void 0 ? void 0 : record.set('enabledText', value ? intl.get('hmde.common.button.enable').d('启用') : intl.get('hmde.common.button.disable').d('禁用'));
        }
      }
    }
  }), []);
  const init = async () => {
    var _res$content2;
    const res = await listDs.query();
    if (!currentId) {
      var _res$content, _res$content$;
      setCurrentId(res === null || res === void 0 ? void 0 : (_res$content = res.content) === null || _res$content === void 0 ? void 0 : (_res$content$ = _res$content[0]) === null || _res$content$ === void 0 ? void 0 : _res$content$.businessObjectAssociateId);
    }
    if (res && !res.failed && (res === null || res === void 0 ? void 0 : (_res$content2 = res.content) === null || _res$content2 === void 0 ? void 0 : _res$content2.length) > 0) {
      var _res$content3, _res$content3$;
      setBusinessObjectAssociateId(res === null || res === void 0 ? void 0 : (_res$content3 = res.content) === null || _res$content3 === void 0 ? void 0 : (_res$content3$ = _res$content3[0]) === null || _res$content3$ === void 0 ? void 0 : _res$content3$.businessObjectAssociateId);
    } else {
      // 菜单没有数据则置空
      setBusinessObjectAssociateId(undefined);
    }
  };
  useEffect(() => {
    init();
  }, [listDs]);

  /**
   * 菜单搜索
   */
  const handleListSearch = () => {
    // eslint-disable-next-line guard-for-in
    for (const key in filterQueryParameters) {
      listDs.setQueryParameter(key, null);
    }
    listDs.setQueryParameter('keyword', searchValueRef.current);
    setShowLoadingMore(false);
    return listDs.query();
  };
  const filterQuery = () => {
    var _filterDs$current;
    const params = filterDs === null || filterDs === void 0 ? void 0 : (_filterDs$current = filterDs.current) === null || _filterDs$current === void 0 ? void 0 : _filterDs$current.toData();
    // eslint-disable-next-line guard-for-in
    for (const key in filterQueryParameters) {
      listDs.setQueryParameter(key, params[key]);
    }
    return listDs.query();
  };

  // 获取下一页
  const handleLoadMore = React.useCallback(_debounce(resolve => {
    setLoadingMore(true);
    listDs.queryMore(listDs.currentPage + 1).finally(() => {
      setLoadingMore(false);
      resolve();
    });
  }, 500), [loadingMore]);
  const handleSelectItem = item => {
    setCurrentId(item === null || item === void 0 ? void 0 : item.businessObjectAssociateId);
    setBusinessObjectAssociateId(item === null || item === void 0 ? void 0 : item.businessObjectAssociateId);
  };
  const renderItem = item => {
    var _item$businessObjectA, _item$businessObjectA2;
    if (!item) {
      return;
    }
    const itemClassName = currentId === (item === null || item === void 0 ? void 0 : item.businessObjectAssociateId) ? 'list-item-active' : '';
    const preConditionObj = item === null || item === void 0 ? void 0 : (_item$businessObjectA = item.businessObjectAssociateFieldList) === null || _item$businessObjectA === void 0 ? void 0 : (_item$businessObjectA2 = _item$businessObjectA.find) === null || _item$businessObjectA2 === void 0 ? void 0 : _item$businessObjectA2.call(_item$businessObjectA, field => (field === null || field === void 0 ? void 0 : field.associateFieldType) === 'CONSTANT');
    return /*#__PURE__*/React.createElement(Item, {
      key: item.code,
      className: `${styles['item-wrapper']} ${styles[itemClassName]}`
    }, /*#__PURE__*/React.createElement("div", {
      className: styles['item-content'],
      onClick: handleSelectItem.bind(null, item)
    }, /*#__PURE__*/React.createElement("div", {
      className: styles['item-title']
    }, /*#__PURE__*/React.createElement("span", null, item === null || item === void 0 ? void 0 : item.associateName), /*#__PURE__*/React.createElement(EnableRender, {
      enabledFlag: item === null || item === void 0 ? void 0 : item.enabledFlag
    })), /*#__PURE__*/React.createElement(RelationTypeRender, {
      associateType: item === null || item === void 0 ? void 0 : item.associateType
    }), /*#__PURE__*/React.createElement("div", {
      className: styles['item-remark'],
      style: {
        color: 'rgba(0,0,0,0.45)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: styles['content-title']
    }, "[\u76EE\u6807\u5BF9\u8C61]"), item === null || item === void 0 ? void 0 : item.associateBusinessObjectName), /*#__PURE__*/React.createElement("div", {
      className: styles['item-type']
    }, /*#__PURE__*/React.createElement("span", {
      className: styles['content-title']
    }, preConditionObj ? '[条件]' : '无条件'), preConditionObj && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", null, "'", preConditionObj === null || preConditionObj === void 0 ? void 0 : preConditionObj.masterBusinessObjectFieldName, "'"), /*#__PURE__*/React.createElement("span", {
      style: {
        padding: '0 4px'
      }
    }, "="), /*#__PURE__*/React.createElement("span", null, preConditionObj === null || preConditionObj === void 0 ? void 0 : preConditionObj.associateValue)))));
  };
  const content = /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      width: 380,
      flex: 1,
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(_Form, {
    dataSet: filterDs
    // useColon={false}
    ,
    style: {
      width: '50%'
    },
    labelWidth: 60
  }, /*#__PURE__*/React.createElement(_Switch, {
    name: "enabledFlag"
  })), /*#__PURE__*/React.createElement(_Output, {
    dataSet: filterDs,
    name: "enabledText"
  })), /*#__PURE__*/React.createElement(_Form, {
    dataSet: filterDs
    // useColon={false}
    ,
    labelWidth: 60
  }, /*#__PURE__*/React.createElement(_SelectBox, {
    name: "associateType"
  }, /*#__PURE__*/React.createElement(Option, {
    value: LINK
  }, intl.get('hmde.common.link').d('关联')), /*#__PURE__*/React.createElement(Option, {
    value: SLAVE_MASTER
  }, intl.get('hmde.common.slaveMaster').d('从主'))), /*#__PURE__*/React.createElement(_SelectBox, {
    name: "onlySingleFieldFlag"
  }, /*#__PURE__*/React.createElement(Option, {
    value: true
  }, intl.get('hmde.bo.businessObject.singleFieldRelation').d('单字段关系')), /*#__PURE__*/React.createElement(Option, {
    value: false
  }, intl.get('hmde.bo.businessObject.moreFieldRelation').d('多字段关系'))), /*#__PURE__*/React.createElement(_SelectBox, {
    name: "conditionExistedFlag"
  }, /*#__PURE__*/React.createElement(Option, {
    value: false
  }, intl.get('hmde.bo.businessObject.noCondition').d('无条件')), /*#__PURE__*/React.createElement(Option, {
    value: true
  }, intl.get('hmde.bo.businessObject.conditions').d('有条件')))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(_Button, {
    onClick: () => filterDs.reset()
  }, intl.get('hmde.common.reset').d('重置')), /*#__PURE__*/React.createElement(_Button, {
    type: "submit",
    color: "primary",
    onClick: filterQuery
  }, intl.get('hmde.common.button.query').d('查询'))));

  // 重置当前选中菜单id
  const resetCurrentId = curId => {
    setCurrentId(curId);
  };
  React.useImperativeHandle(leftMenuRef, () => ({
    handleListSearch,
    resetCurrentId
  }));
  return /*#__PURE__*/React.createElement(Observer, null, () => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: styles['list-search']
  }, /*#__PURE__*/React.createElement(_TextField, {
    name: "searchName",
    className: styles['input-wrapper'],
    dataSet: searchDs,
    onEnterDown: handleListSearch,
    prefix: /*#__PURE__*/React.createElement(_Icon, {
      type: "search",
      style: {
        color: '#D0D0D0'
      }
    }),
    placeholder: intl.get('hmde.bo.domain.search.keywords').d('请搜索关键词')
  }), /*#__PURE__*/React.createElement("div", {
    className: styles['list-filter']
  }, /*#__PURE__*/React.createElement(_Popover, {
    content: content
  }, /*#__PURE__*/React.createElement(_Icon, {
    type: "filter2"
  })))), /*#__PURE__*/React.createElement("div", {
    className: styles['list-area']
  }, /*#__PURE__*/React.createElement(TLoader, {
    ref: TLoaderRef
    // onRefresh={handleRefresh}
    ,
    hasMore: showLoadingMore && listDs.length > 0,
    onLoadMore: handleLoadMore,
    autoLoadMore: autoLoadMore,
    className: styles['t-loader']
  }, /*#__PURE__*/React.createElement(_Spin, {
    dataSet: listDs
  }, /*#__PURE__*/React.createElement(_List, {
    dataSource: listDs.toData(),
    renderItem: renderItem
  }))))));
};
export default formatterCollections({
  code: ['hmde.bo', 'hmde.common']
})(Index);