import _Table from "@hzero-front-ui/c7n-ui/lib/TablePro";
import _Spin from "@hzero-front-ui/c7n-ui/lib/SpinPro";
import _Menu from "@hzero-front-ui/c7n-ui/lib/Menu";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _Icon from "choerodon-ui/lib/icon";
import _Alert from "@hzero-front-ui/c7n-ui/lib/Alert";
import _Tooltip from "@hzero-front-ui/c7n-ui/lib/TooltipPro";
import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _isEmpty from "lodash/isEmpty";
import _isArray from "lodash/isArray";
import _difference from "lodash/difference";
/*
 * @Author: chengcheng.xu@hand-china.com
 * @Date: 2022-03-09 15:47:57
 * @LastEditTime: 2023-05-30 16:51:41
 * @LastEditors: 黎智豪 zhihao.li06@hand-china.com
 * @Description: 业务对象批量发布弹窗
 */
import React, { useMemo, useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import $ from 'jquery';
import { EmptyPage } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { observer } from 'mobx-react-lite';
import { FieldType, DataSetSelection } from 'choerodon-ui/pro/lib/data-set/enum';
import { DataSetStatus } from 'choerodon-ui/dataset/data-set/enum';
import { TableQueryBarType, ColumnAlign, TableColumnTooltip, TableAutoHeightType } from 'choerodon-ui/pro/lib/table/enum';
import { runInAction } from 'mobx';
import { HZERO_HLOD } from "hzero-front-apaas/lib/utils/config";
import { lowcodeOrganizationURL } from "hzero-front-hmde/lib/utils/common";
import { statusRender } from "hzero-front-apaas/lib/utils/render";
import { DomainDS } from "hzero-front-hmde/lib/stores/Domain/DomainDS";
import BusinessObjectDataSet from "hzero-front-hmde/lib/stores/BusinessObject/BusinessObjectDS";
import { PublishStatus } from "hzero-front-apaas/lib/constants/businessObject";
import { getViewByObjectCode } from "hzero-front-hmde/lib/services/businessObjectService";
import useDataSetEvents from 'hzero-front-apaas/lib/hooks/useDataSetEvents';
import globalStyles from "hzero-front-hmde/lib/businessGlobal.less?modules";
import FooterTooltip from "hzero-front-hmde/lib/businessComponents/FooterTooltip";
import { PublicTypeList } from "../type";
import styles from "./index.less?modules";
import MenuItem from "../components/MenuItem";
const BatchPublishModal = ({
  onRef,
  publicType,
  domain: midDomain,
  modal,
  handleCascadePublish
}) => {
  const _useState = useState(''),
    _useState2 = _slicedToArray(_useState, 2),
    searchValue = _useState2[0],
    setSearchValue = _useState2[1];
  const _useState3 = useState([]),
    _useState4 = _slicedToArray(_useState3, 2),
    domainListData = _useState4[0],
    setDomainListData = _useState4[1];
  const emptyDomain = midDomain || {};
  const _useState5 = useState(emptyDomain),
    _useState6 = _slicedToArray(_useState5, 2),
    domain = _useState6[0],
    setDomain = _useState6[1];
  const _useState7 = useState(false),
    _useState8 = _slicedToArray(_useState7, 2),
    viewLoading = _useState8[0],
    setViewLoading = _useState8[1];
  const searchTextRef = useRef('');
  const _useState9 = useState(),
    _useState10 = _slicedToArray(_useState9, 2),
    tableList = _useState10[0],
    setTableList = _useState10[1];
  const domainListDs = useMemo(() => new _DataSet({
    ...DomainDS(),
    pageSize: 99999
  }), []);
  const textObj = useMemo(() => {
    if (publicType === PublicTypeList.publicObject) {
      return {
        titleLeft: intl.get('hmde.bo.businessObject.businessObjectList').d('业务对象列表'),
        titleright: intl.get('hmde.bo.businessObject.pubBusinessObjectList').d('待发布业务对象列表')
      };
    }
    return {
      titleLeft: intl.get('hmde.bo.businessObject.viewList1').d('无需发布交互视图'),
      titleright: intl.get('hmde.bo.businessObject.viewList2').d('需发布交互视图')
    };
  }, [publicType]);
  useEffect(() => {
    domainListDs.query().then(_res => {
      if (!(_res !== null && _res !== void 0 && _res.failed) && _isArray(_res.content)) {
        const res = _res.content;
        const list = (res === null || res === void 0 ? void 0 : res.filter(item => item.sourceType !== 'PREDEFINE')) || [];
        setDomainListData(list);
        if (_isEmpty(emptyDomain)) {
          setDomain(list[0] || emptyDomain);
        }
        setTimeout(() => {
          var _$$find, _$$find$get;
          (_$$find = $('#menuScroll2').find('.c7n-menu-item-selected')) === null || _$$find === void 0 ? void 0 : (_$$find$get = _$$find.get(0)) === null || _$$find$get === void 0 ? void 0 : _$$find$get.scrollIntoView();
        }, 50);
      }
    });
  }, []);
  const boTableDs = useMemo(() => {
    if (publicType === PublicTypeList.publicObject) {
      return new _DataSet({
        ...BusinessObjectDataSet({
          includePublishFlag: true
        }),
        paging: true,
        pageSize: 10,
        selection: "multiple",
        queryFields: [{
          label: intl.get('hmde.common.objectName').d('对象名称'),
          name: 'businessObjectName',
          type: "string"
        }, {
          label: intl.get('hmde.common.publishStatus').d('发布状态'),
          name: 'publishStatus',
          type: "string",
          textField: 'text',
          valueField: 'value',
          defaultValue: [PublishStatus.UNPUBLISHED, PublishStatus.MODIFIED],
          multiple: true,
          options: new _DataSet({
            paging: false,
            // selection: DataSetSelection.single,
            data: [{
              text: intl.get('hmde.common.status.published').d('已发布'),
              value: PublishStatus.PUBLISHED
            }, {
              text: intl.get('hmde.common.status.modified').d('已修改'),
              value: PublishStatus.MODIFIED
            }, {
              text: intl.get('hmde.common.status.unpublished').d('未发布'),
              value: PublishStatus.UNPUBLISHED
            }]
          }),
          transformRequest: value => value === null || value === void 0 ? void 0 : value.toString()
        }].filter(Boolean)
      });
    } else {
      return new _DataSet({
        paging: false,
        fields: [{
          name: 'businessObjectId',
          type: "string"
        }, {
          label: intl.get('hmde.common.objectName').d('对象名称'),
          name: 'businessObjectName',
          type: "intl"
        }, {
          label: intl.get('hmde.common.objectCode').d('对象编码'),
          name: 'businessObjectCode',
          type: "string"
        }],
        queryFields: [{
          label: intl.get('hmde.common.objectName').d('对象名称'),
          name: 'businessObjectName',
          type: "string"
        }],
        transport: {
          read: ({
            params
          }) => {
            return {
              url: `${lowcodeOrganizationURL({
                route: HZERO_HLOD
              })}/pages/bo/filter`,
              method: 'GET',
              params
            };
          }
        }
      });
    }
  }, [publicType]);
  useEffect(() => {
    boTableDs.setState('domainId', domain === null || domain === void 0 ? void 0 : domain.domainId);
  }, [domain === null || domain === void 0 ? void 0 : domain.domainId, boTableDs]);
  useEffect(() => {
    var _boTableDs$queryDataS, _boTableDs$queryDataS2;
    if (boTableDs !== null && boTableDs !== void 0 && (_boTableDs$queryDataS = boTableDs.queryDataSet) !== null && _boTableDs$queryDataS !== void 0 && (_boTableDs$queryDataS2 = _boTableDs$queryDataS.current) !== null && _boTableDs$queryDataS2 !== void 0 && _boTableDs$queryDataS2.reset) boTableDs.queryDataSet.current.reset(); // 切换领域重置表格搜索域
    // 一个要用ID 一个用code只能判断了
    if (domain && domain.domainId) {
      if (publicType === PublicTypeList.publicObject) {
        boTableDs.setQueryParameter('domainId', domain === null || domain === void 0 ? void 0 : domain.domainId);
        boTableDs.setQueryParameter('enabledFlag', true);
        boTableDs.query();
      } else {
        boTableDs.setQueryParameter('domainId', domain === null || domain === void 0 ? void 0 : domain.domainId);
        boTableDs.query();
      }
    }
  }, [domain, publicType]);

  // 当中间表格数据加载完，根据右边表格选项，勾选已存在项
  useDataSetEvents(boTableDs, ['load'], () => {
    // 切换领域或者去除要发布业务对象，在中间表格中勾选并置灰已经在发布列表中的业务对象
    let selectedList;
    if (publicType === PublicTypeList.publicObject) {
      selectedList = selectedTableDs.toData();
    } else {
      selectedList = selectedChildrenTableDs.toData();
    }
    const arrList = [];
    selectedList.forEach(item => {
      boTableDs.forEach(record => {
        if (item.businessObjectCode === (record === null || record === void 0 ? void 0 : record.get('businessObjectCode'))) {
          arrList.push(record);
        }
      });
    });
    boTableDs.batchSelect(arrList);
    boTableDs.forEach(rec => {
      if (rec.isSelected) {
        // eslint-disable-next-line
        rec.selectable = false;
      }
    });
    if (selectedTableDs.length > 0 || selectedChildrenTableDs.length > 0) {
      modal === null || modal === void 0 ? void 0 : modal.update({
        okProps: {
          disabled: false
        },
        footer(okBtn, cancelBtn) {
          return /*#__PURE__*/React.createElement(React.Fragment, null, cancelBtn, publicType === PublicTypeList.publicObject && /*#__PURE__*/React.createElement(_Tooltip, {
            title: intl.get('hmde.bo.businessObject.status.publicTip').d('待发布对象可能存在其他关联对象，需先发布关联对象才能保证待发布对象的正常发布，点击按钮将查询到待发布对象存在的关联对象并进行级联发布。'),
            theme: "light"
          }, /*#__PURE__*/React.createElement(_Button, {
            onClick: handleCascadePublish,
            color: 'primary'
          }, intl.get('hmde.common.publish').d('发布'))), publicType !== PublicTypeList.publicObject && okBtn);
        }
      });
    } else {
      modal === null || modal === void 0 ? void 0 : modal.update({
        okProps: {
          disabled: true
        },
        footer(okBtn, cancelBtn) {
          return /*#__PURE__*/React.createElement(React.Fragment, null, cancelBtn, /*#__PURE__*/React.createElement(FooterTooltip, {
            okBtn: okBtn
          }));
        }
      });
    }
  });
  const selectedTableDs = useMemo(() => new _DataSet({
    ...BusinessObjectDataSet({}),
    status: "ready",
    paging: false,
    selection: "multiple",
    autoQuery: false
  }), []);
  const selectedChildrenTableDs = useMemo(() => new _DataSet({
    primaryKey: 'objectViewCode',
    autoQuery: false,
    parentField: 'parentCode',
    idField: 'objectViewCode',
    fields: [{
      label: intl.get('hmde.common.objectName').d('对象名称'),
      name: 'businessObjectName',
      type: "string"
    }, {
      label: intl.get('hmde.bo.businessObject.header.objectNameAndViewName').d('对象/交互视图名称'),
      name: 'objectViewName',
      type: "string"
    }, {
      label: intl.get('hmde.bo.businessObject.header.objectNameAndViewCode').d('对象/交互视图编码'),
      name: 'objectViewCode',
      type: "string"
    }]
  }), []);
  const columns2 = () => [{
    name: 'objectViewName',
    tooltip: "overflow"
  }, {
    name: 'objectViewCode',
    tooltip: "overflow"
  }];
  useEffect(() => {
    onRef(publicType === PublicTypeList.publicObject ? selectedTableDs : selectedChildrenTableDs);
  }, [publicType]);
  const handleSearch = () => {
    domainListDs.setQueryParameter('keyword', searchValue);
    domainListDs.query().then(_res => {
      if (_res && Array.isArray(_res.content)) {
        const res = _res.content;
        // 设置领域列表是否有发布列表的状态
        const targertList = [''];
        selectedTableDs.forEach(record => {
          if (!targertList.some(i => i === record.get('domainId'))) {
            targertList.push(record.get('domainId'));
          }
        });
        const list = res.filter(item => item.sourceType !== 'PREDEFINE').map(v => targertList.some(d => d === v.domainId) ? {
          ...v,
          selectedFlag: true
        } : {
          ...v,
          selectedFlag: false
        });
        setDomainListData(list);
        setDomain(list[0] || emptyDomain);
      }
    });
  };
  const columns = useMemo(() => {
    const arr = [{
      name: 'businessObjectName',
      tooltip: "overflow"
    }, {
      name: 'businessObjectCode',
      tooltip: "overflow"
    }, {
      name: 'publishStatus',
      align: "center",
      renderer: ({
        value
      }) => {
        const statusList = [{
          value: PublishStatus.PUBLISHED,
          status: 'success',
          text: intl.get('hmde.common.status.published').d('已发布')
        }, {
          value: PublishStatus.MODIFIED,
          status: 'warning',
          text: intl.get('hmde.common.status.modified').d('已修改')
        }, {
          value: PublishStatus.UNPUBLISHED,
          status: 'default',
          text: intl.get('hmde.common.status.unpublished').d('未发布')
        }];
        return statusRender(value === null || value === void 0 ? void 0 : value.toUpperCase(), statusList);
      }
    }];
    if (publicType === PublicTypeList.publicView) {
      return arr.slice(0, 2);
    }
    return arr.slice();
  }, [publicType]);
  const handleAdd = async () => {
    if (boTableDs && boTableDs.selected) {
      if (publicType === PublicTypeList.publicObject) {
        const oldSelectedList = selectedTableDs.toData();
        const newSelectedList = boTableDs.selected.map(record => record.toData());
        oldSelectedList.push(...newSelectedList);
        const obj = {};
        const selectedList = oldSelectedList.reduce((item, next) => {
          if (!obj[next.businessObjectCode]) {
            item.push(next);
            obj[next.businessObjectCode] = true;
          }
          return item;
        }, []);
        selectedTableDs.loadData(selectedList);
        setTableList(selectedList);

        // 设置对象列表勾选状态、且置灰，把数据塞回去触发load回调
        boTableDs.loadData(boTableDs.toData());

        // 设置领域列表是否有发布列表的状态
        setDomainListData(domainListData.map(v => selectedList.some(d => d.domainId === v.domainId) ? {
          ...v,
          selectedFlag: true
        } : {
          ...v,
          selectedFlag: false
        }));
      } else {
        if (viewLoading) return;
        const selectKeys = boTableDs.selected.map(record => record.toData().businessObjectCode);
        if (selectKeys.length > 0) {
          const oldSelectKey = selectedChildrenTableDs.filter(item => !item.get('parentCode')).map(item => item.get('objectViewCode'));
          // 求数组差集
          const keys = _difference(selectKeys, oldSelectKey);
          if (keys.length === 0) return;
          setViewLoading(true);
          const data = await getViewByObjectCode(keys);
          setViewLoading(false);
          selectedChildrenTableDs.loadData([...selectedChildrenTableDs.toData(), ...data]);
          const selects = selectedChildrenTableDs.records.filter(item => {
            return !item.get('parentCode');
          });
          runInAction(() => {
            selects.forEach(item => {
              selectedChildrenTableDs.treeSelect(item);
            });
          });
          // 设置对象列表勾选状态、且置灰，把数据塞回去触发load回调
          boTableDs.loadData(boTableDs.toData());
        }
      }
    }
  };
  const handleRemove = () => {
    if (publicType === PublicTypeList.publicObject) {
      const selectedList = selectedTableDs.selected.map(record => record.toData());
      const newList = selectedTableDs.toData().filter(d => selectedList.every(item => item.businessObjectCode !== d.businessObjectCode));
      selectedTableDs.loadData(newList);
      setTableList(newList);
      // 设置对象列表勾选状态、且置灰，把数据塞回去触发load回调
      boTableDs.loadData(boTableDs.toData());
      // 设置领域列表是否有发布列表的状态
      setDomainListData(domainListData.map(v => newList.some(d => d.domainId === v.domainId) ? {
        ...v,
        selectedFlag: true
      } : {
        ...v,
        selectedFlag: false
      }));
    } else {
      // 看看父节点是否有选中的
      const oldSelectKey = selectedChildrenTableDs.filter(item => !item.get('parentCode') && item.isSelected).map(item => item.get('objectViewCode'));
      if (oldSelectKey.length) {
        const Recs = selectedChildrenTableDs.filter(item => {
          const code = item.get('parentCode') || item.get('objectViewCode');
          return !oldSelectKey.includes(code);
        });
        const newList = Recs.map(item => item.toData());
        selectedChildrenTableDs.loadData(newList);
        // 设置对象列表勾选状态
        const arrList = [];
        boTableDs.forEach(record => {
          if (oldSelectKey.includes(record === null || record === void 0 ? void 0 : record.get('businessObjectCode'))) {
            arrList.push(record);
          }
        });
        // boTableDs.batchUnSelect(arrList);
        // 设置对象列表勾选状态、且置灰，把数据塞回去触发load回调
        boTableDs.loadData(boTableDs.toData());
      }
    }
  };
  const rightSelectObj = useMemo(() => {
    const obj = {
      select: 0,
      total: 0
    };
    return selectedChildrenTableDs.reduce((pre, item) => {
      if (item.get('parentCode')) {
        obj.total++;
        if (item.isSelected) obj.select++;
      }
      return obj;
    }, obj);
  }, [selectedChildrenTableDs.treeSelected.length]);
  const handleSearchChange = () => {
    var _searchTextRef$curren, _searchTextRef$curren2;
    // 搜索脚本名称/编码
    const keyword = ((_searchTextRef$curren = searchTextRef.current) === null || _searchTextRef$curren === void 0 ? void 0 : _searchTextRef$curren.text) || ((_searchTextRef$curren2 = searchTextRef.current) === null || _searchTextRef$curren2 === void 0 ? void 0 : _searchTextRef$curren2.value) || '';
    const searchList = (tableList || []).filter(item => {
      var _item$businessObjectC, _item$businessObjectN;
      return (item === null || item === void 0 ? void 0 : (_item$businessObjectC = item.businessObjectCode) === null || _item$businessObjectC === void 0 ? void 0 : _item$businessObjectC.indexOf(keyword)) > -1 || (item === null || item === void 0 ? void 0 : (_item$businessObjectN = item.businessObjectName) === null || _item$businessObjectN === void 0 ? void 0 : _item$businessObjectN.indexOf(keyword)) > -1;
    });
    selectedTableDs.loadData(searchList);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: styles.content
  }, publicType === PublicTypeList.publicObject && /*#__PURE__*/React.createElement("div", {
    style: {
      margin: ' 6px 0 8px 0'
    }
  }, /*#__PURE__*/React.createElement(_Alert, {
    message: intl.get('hmde.bo.businessObject.review.text').d('进行批量发布任务时会级联发布与所选对象存在直接或间接关联且不存在于待发布列表中的业务对象，以确保批量发布任务的正常执行。'),
    type: "info",
    showIcon: true
  })), /*#__PURE__*/React.createElement("div", {
    className: styles['bo-content']
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['menu-left']
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['content-title']
  }, intl.get('hmde.bo.domianList.title').d('领域列表')), /*#__PURE__*/React.createElement(_TextField, {
    prefix: /*#__PURE__*/React.createElement(_Icon, {
      type: "search",
      style: {
        color: '#D0D0D0'
      },
      onClick: handleSearch
    }),
    placeholder: intl.get('hmde.common.searchNameCode').d('搜索名称/编码'),
    onEnterDown: handleSearch,
    value: searchValue,
    onInput: e => {
      setSearchValue(e.target.value);
    },
    style: {
      width: 150,
      marginBottom: 14
    }
  }), /*#__PURE__*/React.createElement(_Spin, {
    dataSet: domainListDs,
    wrapperClassName: globalStyles['business-spin-height']
  }, /*#__PURE__*/React.createElement(_Menu, {
    id: "menuScroll2",
    selectedKeys: [`${domain.domainId}#${domain.extendTableEnabledFlag}`],
    style: {
      width: 150,
      height: '100%',
      overflowY: 'auto',
      borderRight: 'none'
    },
    onClick: ({
      key
    }) => {
      setDomain(domainListData.find(({
        domainId,
        extendTableEnabledFlag
      }) => `${domainId}#${extendTableEnabledFlag}` === key) || emptyDomain);
    }
  }, domainListData.map(item => /*#__PURE__*/React.createElement(_Menu.Item, {
    key: `${item.domainId}#${item.extendTableEnabledFlag}`,
    style: {
      paddingRight: 0
    }
  }, /*#__PURE__*/React.createElement(MenuItem, item)))))), /*#__PURE__*/React.createElement("div", {
    className: styles['content-right']
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['content-right-head']
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['content-right-text']
  }, textObj.titleLeft), /*#__PURE__*/React.createElement("div", {
    className: styles['font-color']
  }, `${boTableDs.selected.length}/${boTableDs.totalCount}${intl.get('hmde.pd.processDefinition.term').d('项')}`)), domainListData.length > 0 ? /*#__PURE__*/React.createElement(_Table, {
    dataSet: boTableDs,
    queryBar: "filterBar",
    columns: columns,
    queryBarProps: {
      fuzzyQueryPlaceholder: intl.get('hmde.bo.businessObject.batchPublishModal.placeholder').d('可输入业务对象名称、编码等')
    },
    autoHeight: {
      type: "maxHeight",
      diff: 50
    }
  }) : /*#__PURE__*/React.createElement(EmptyPage, null)), /*#__PURE__*/React.createElement("div", {
    className: styles['content-middle']
  }, /*#__PURE__*/React.createElement("div", {
    className: classNames({
      [styles['content-middle-btn']]: true,
      [styles['content-middle-selected']]: boTableDs.selected.filter(r => r === null || r === void 0 ? void 0 : r.selectable).length !== 0
    }),
    onClick: handleAdd
  }, /*#__PURE__*/React.createElement(_Icon, {
    type: "navigate_next"
  })), /*#__PURE__*/React.createElement("div", {
    className: classNames({
      [styles['content-middle-btn']]: true,
      [styles['content-middle-selected']]: publicType === PublicTypeList.publicObject ? selectedTableDs.selected.filter(r => r === null || r === void 0 ? void 0 : r.selectable).length !== 0 : selectedChildrenTableDs.selected.filter(r => r === null || r === void 0 ? void 0 : r.selectable).length !== 0
    }),
    onClick: handleRemove
  }, /*#__PURE__*/React.createElement(_Icon, {
    type: "navigate_before"
  }))), /*#__PURE__*/React.createElement("div", {
    className: styles['content-right']
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['content-right-head']
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['content-left-text']
  }, textObj.titleright), PublicTypeList.publicObject === publicType ? /*#__PURE__*/React.createElement("div", {
    className: styles['font-color']
  }, `${selectedTableDs.selected.length}/${selectedTableDs.totalCount}${intl.get('hmde.pd.processDefinition.term').d('项')}`) : /*#__PURE__*/React.createElement("div", {
    className: styles['font-color']
  }, `${rightSelectObj.select}/${rightSelectObj.total}${intl.get('hmde.pd.processDefinition.term').d('项')}`)), publicType === PublicTypeList.publicObject ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: styles.search
  }, /*#__PURE__*/React.createElement(_TextField, {
    ref: searchTextRef,
    prefix: /*#__PURE__*/React.createElement(_Icon, {
      type: "search"
    }),
    placeholder: intl.get('hmde.bo.businessObject.batchPublishModal.placeholder').d('可输入业务对象名称、编码等'),
    className: styles.input,
    clearButton: true,
    onClear: handleSearchChange,
    onBlur: handleSearchChange,
    onKeyDown: e => {
      if (e.nativeEvent.code === 'Enter') {
        handleSearchChange();
      }
    }
  })), /*#__PURE__*/React.createElement(_Table, {
    key: "1",
    dataSet: selectedTableDs,
    columns: columns,
    queryBar: "none",
    renderEmpty: () => /*#__PURE__*/React.createElement(EmptyPage, null, /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center',
        color: 'rgba(0,0,0,0.25)'
      }
    }, intl.get('hmde.bo.businessObject.chooseObjTipText').d('请从左侧目录中选择对象'))),
    autoHeight: {
      type: "maxHeight",
      diff: 50
    }
  })) : /*#__PURE__*/React.createElement("div", {
    className: styles['right-view']
  }, /*#__PURE__*/React.createElement(_Spin, {
    spinning: viewLoading
  }, /*#__PURE__*/React.createElement(_Table, {
    key: "2"
    // @ts-ignore
    ,
    mode: "tree",
    defaultRowExpanded: true
    // @ts-ignore
    ,
    selectionMode: "treebox",
    dataSet: selectedChildrenTableDs,
    columns: columns2(),
    queryBar: "filterBar",
    queryBarProps: {
      fuzzyQueryPlaceholder: intl.get('hmde.bo.businessObject.batchPublishModal.placeholder').d('可输入业务对象名称、编码等')
    },
    renderEmpty: () => /*#__PURE__*/React.createElement(EmptyPage, null, /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center',
        color: 'rgba(0,0,0,0.25)'
      }
    }, intl.get('hmde.bo.businessObject.chooseObjTipText').d('请从左侧目录中选择对象')))
  }))))));
};
export default formatterCollections({
  code: ['hmde.common', 'hmde.bo', 'hmde.pd']
})(observer(BatchPublishModal));