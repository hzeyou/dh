import _Tooltip from "@hzero-front-ui/c7n-ui/lib/TooltipPro";
import _Icon from "choerodon-ui/lib/icon";
import _CheckBox from "@hzero-front-ui/c7n-ui/lib/CheckBoxPro";
import _Spin from "@hzero-front-ui/c7n-ui/lib/SpinPro";
import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _Breadcrumb from "@hzero-front-ui/c7n-ui/lib/Breadcrumb";
import _Popconfirm from "@hzero-front-ui/c7n-ui/lib/Popconfirm";
import _Select from "@hzero-front-ui/c7n-ui/lib/SelectPro";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _Collapse from "@hzero-front-ui/c7n-ui/lib/Collapse";
import _debounce from "lodash/debounce";
import _toArray from "lodash/toArray";
import _isEmpty from "lodash/isEmpty";
import React, { useState, useMemo, useRef, useEffect } from 'react';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { observer } from 'mobx-react-lite';
import { getCurrentLanguage, getCurrentOrganizationId, getResponse, isTenantRoleLevel } from 'utils/utils';
import { TagRender, operatorRender } from 'utils/renderer';
import { Header, Content } from 'components/Page';
import { ButtonColor, FuncType } from 'choerodon-ui/pro/lib/button/enum';
import qs from 'querystring';
import ImgIcon from "hzero-front-hmde/lib/utils/ImgIcon";
import { relyDs, controlLovValueDs } from "hzero-front-hmde/lib/stores/BusinessObject/FieldRelyDS";
import { disableFieldRely, enableFieldRely, getFieldRelyValueMap } from "hzero-front-hmde/lib/services/businessObjectService";
import SpringTooltip from "hzero-front-hmde/lib/businessComponents/SpringTooltip";
import useChangeSize from "./useChangeSIze";
import styles from "./index.less?modules";
const Panel = _Collapse.Panel;
const tenantId = getCurrentOrganizationId();
const isTenant = isTenantRoleLevel();
const Index = props => {
  var _props$location$searc;
  const history = props.history;
  let _search = (_props$location$searc = props.location.search.split('?')) === null || _props$location$searc === void 0 ? void 0 : _props$location$searc[1];
  _search = qs.parse(_search);
  const _ref = _search || {},
    businessObjectId = _ref.businessObjectId,
    businessObjectName = _ref.businessObjectName,
    boSourceType = _ref.boSourceType;
  // const [searchValue, setSearchValue] = useState<string>();
  const _useState = useState([]),
    _useState2 = _slicedToArray(_useState, 2),
    activeKey = _useState2[0],
    setActiveKey = _useState2[1];
  const relyCollapseDs = useMemo(() => new _DataSet(relyDs(businessObjectId)), []);
  const panelHeader = record => {
    const enableList = [{
      status: true,
      color: 'green',
      text: intl.get('hmde.common.button.enable').d('启用')
    }, {
      status: false,
      color: 'red',
      text: intl.get('hmde.common.button.disable').d('禁用')
    }];
    return record !== null && record !== void 0 && record.get('fieldDependenceId') ? /*#__PURE__*/React.createElement("div", {
      className: styles['rely-title']
    }, /*#__PURE__*/React.createElement("span", {
      className: styles['rely-name']
    }, /*#__PURE__*/React.createElement("span", null, record === null || record === void 0 ? void 0 : record.get('controlBusinessObjectFieldName')), /*#__PURE__*/React.createElement("span", {
      style: {
        margin: '0 8px'
      }
    }, "-"), /*#__PURE__*/React.createElement("span", null, record === null || record === void 0 ? void 0 : record.get('slaveBusinessObjectFieldName'))), TagRender(record === null || record === void 0 ? void 0 : record.get('enabledFlag'), enableList)) : /*#__PURE__*/React.createElement("div", {
      className: styles['rely-title'],
      style: {
        marginLeft: 22
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: styles['rely-name']
    }, /*#__PURE__*/React.createElement(_Select, {
      record: record,
      name: "controlBusinessObjectField",
      placeholder: intl.get('hmde.bo.businessObject.controlField.placeholder').d('请选择控制字段'),
      noCache: true,
      optionsFilter: obj => ['RADIO', 'SINGLE_SELECT'].includes(obj === null || obj === void 0 ? void 0 : obj.get('componentType'))
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        margin: '0 8px'
      }
    }, "-"), /*#__PURE__*/React.createElement(_Select, {
      record: record,
      disabled: !(record !== null && record !== void 0 && record.get('controlBusinessObjectField')),
      name: "slaveBusinessObjectField",
      placeholder: intl.get('hmde.bo.businessObject.slaveField.placeholder').d('请选择受控字段'),
      noCache: true,
      optionsFilter: obj => ['RADIO', 'SINGLE_SELECT', 'CHECKBOX', 'MULTIPLE_SELECT'].includes(obj === null || obj === void 0 ? void 0 : obj.get('componentType'))
    })), /*#__PURE__*/React.createElement(ImgIcon, {
      name: "queren.svg",
      size: 14,
      onClick: async () => {
        if (await record.validate()) {
          const res = await relyCollapseDs.submit();
          if (getResponse(res)) {
            var _res$content;
            await relyCollapseDs.query();
            const newItem = res === null || res === void 0 ? void 0 : (_res$content = res.content) === null || _res$content === void 0 ? void 0 : _res$content[0];
            handleOpenPanel([newItem === null || newItem === void 0 ? void 0 : newItem.fieldDependenceId]);
          }
        }
      }
    }), /*#__PURE__*/React.createElement(ImgIcon, {
      name: "quxiao.svg",
      size: 14,
      onClick: () => relyCollapseDs.delete(record, false)
    }));
  };
  const PanelOperator = ({
    record
  }) => {
    const operators = [];
    if (!(record !== null && record !== void 0 && record.get('fieldDependenceId'))) return null;
    if (record !== null && record !== void 0 && record.get('enabledFlag')) {
      operators.push({
        key: 'disable',
        ele: /*#__PURE__*/React.createElement("a", {
          style: {
            verticalAlign: 'text-bottom'
          },
          onClick: e => {
            if (e.stopPropagation) e.stopPropagation();
            handleDisableBORely(record === null || record === void 0 ? void 0 : record.toJSONData());
          }
        }, intl.get('hmde.common.button.disable').d('禁用')),
        len: 2,
        title: intl.get('hmde.common.button.disable').d('禁用')
      });
    } else {
      operators.push({
        key: 'enable',
        ele: /*#__PURE__*/React.createElement("a", {
          style: {
            verticalAlign: 'text-bottom'
          },
          onClick: e => {
            if (e.stopPropagation) e.stopPropagation();
            handleEnableBORely(record === null || record === void 0 ? void 0 : record.toJSONData());
          }
        }, intl.get('hmde.common.button.enable').d('启用')),
        len: 2,
        title: intl.get('hmde.common.button.enable').d('启用')
      });
    }
    operators.push({
      key: 'enable',
      ele: /*#__PURE__*/React.createElement(_Popconfirm, {
        title: intl.get('hmde.bo.businessObject.confirm.delete').d('是否删除此条记录'),
        okText: intl.get('hmde.common.button.sure').d('确定'),
        cancelText: intl.get('hmde.common.button.cancel').d('取消'),
        onConfirm: () => relyCollapseDs === null || relyCollapseDs === void 0 ? void 0 : relyCollapseDs.delete(record, false).then(() => setActiveKey([]))
      }, /*#__PURE__*/React.createElement("a", {
        style: {
          marginRight: 8,
          verticalAlign: 'text-bottom'
        },
        onClick: e => {
          if (e.stopPropagation) e.stopPropagation();
        }
      }, intl.get('hmde.common.button.delete').d('删除'))),
      len: 2,
      title: intl.get('hmde.common.button.delete').d('删除')
    });
    return operatorRender(operators, record, {
      limit: 3
    });
  };
  const handleDisableBORely = async data => {
    const res = await disableFieldRely(data);
    if (getResponse(res)) {
      setActiveKey([]);
      await relyCollapseDs.query();
    }
  };
  const handleEnableBORely = async data => {
    const res = await enableFieldRely(data);
    if (getResponse(res)) {
      setActiveKey([]);
      await relyCollapseDs.query();
    }
  };
  const handleOpenPanel = async key => {
    setActiveKey(key);
  };

  // 获取标题
  const getTitle = () => {
    return /*#__PURE__*/React.createElement(_Breadcrumb, {
      style: {
        marginLeft: '10px'
      }
    }, /*#__PURE__*/React.createElement(_Breadcrumb.Item, {
      onClick: () => history.push({
        pathname: `/hmde/business-object/detail/${businessObjectId}`,
        state: {
          originKey: 'fieldList',
          fieldActiveKey: isTenant && boSourceType !== 'TENANT' ? null : 'STANDARD'
        }
      })
    }, /*#__PURE__*/React.createElement("span", null, ' ', businessObjectName, "-", intl.get('hmde.common.fieldList').d('字段列表'))), /*#__PURE__*/React.createElement(_Breadcrumb.Item, null, /*#__PURE__*/React.createElement("span", null, " ", intl.get('hmde.bo.businessObject.fieldDependency').d('字段依赖'))));
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Header, {
    title: getTitle()
  }), /*#__PURE__*/React.createElement(Content, null, relyCollapseDs.length !== 0 ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: styles['operate-header']
  }, /*#__PURE__*/React.createElement(_TextField, {
    onEnterDown: e => {
      const val = e.target.value;
      if (val) {
        var _relyCollapseDs$toDat;
        const keys = (_relyCollapseDs$toDat = relyCollapseDs.toData().filter(item => item.controlBusinessObjectFieldName.includes(val) || item.slaveBusinessObjectFieldName.includes(val))) === null || _relyCollapseDs$toDat === void 0 ? void 0 : _relyCollapseDs$toDat.map(item => item.fieldDependenceId);
        handleOpenPanel([...keys]);
      }
    },
    prefix: /*#__PURE__*/React.createElement(ImgIcon, {
      name: "search@v4.0.svg",
      size: 14
    }),
    placeholder: intl.get('hmde.bo.businessObject.search.placeholder1').d('搜索控制字段/受控字段')
  }), /*#__PURE__*/React.createElement(_Button, {
    icon: "add",
    funcType: "flat",
    color: "primary",
    onClick: async () => {
      if (await relyCollapseDs.validate()) {
        relyCollapseDs.create({
          enabledFlag: true
        }, 0);
      }
    }
  }, intl.get('hmde.common.button.create').d('新建'))), /*#__PURE__*/React.createElement(_Collapse, {
    className: styles['rely-collapse'],
    activeKey: activeKey,
    onChange: handleOpenPanel
  }, relyCollapseDs.map(record => /*#__PURE__*/React.createElement(Panel, {
    className: styles['rely-collapse-panel'],
    style: {
      border: '1px solid #BDC2CD',
      borderRadius: 2
    },
    key: record === null || record === void 0 ? void 0 : record.get('fieldDependenceId'),
    disabled: !(record !== null && record !== void 0 && record.get('fieldDependenceId')),
    showArrow: !!(record !== null && record !== void 0 && record.get('fieldDependenceId')),
    header: panelHeader(record),
    extra: /*#__PURE__*/React.createElement("div", {
      onClick: e => e.stopPropagation()
    }, /*#__PURE__*/React.createElement(PanelOperator, {
      record: record
    })),
    forceRender: false
  }, activeKey.includes(record === null || record === void 0 ? void 0 : record.get('fieldDependenceId')) && /*#__PURE__*/React.createElement(PanelContent, {
    record: record
  }))))) : /*#__PURE__*/React.createElement("div", {
    className: styles['no-data']
  }, /*#__PURE__*/React.createElement(ImgIcon, {
    name: "no-data-fieldRely.png",
    size: 140
  }), /*#__PURE__*/React.createElement("p", null, intl.get('hmde.bo.businessObject.noData').d('暂无数据，请点击按钮添加数据')), /*#__PURE__*/React.createElement(_Button, {
    color: "primary",
    icon: "add",
    onClick: () => relyCollapseDs.create({
      enabledFlag: true
    }, 0)
  }, intl.get('hmde.common.button.add').d('添加')))));
};
const PanelContent = observer(({
  record
}) => {
  const _record$toData = record.toData(),
    fieldDependenceId = _record$toData.fieldDependenceId,
    controlBusinessObjectFieldName = _record$toData.controlBusinessObjectFieldName,
    slaveBusinessObjectFieldName = _record$toData.slaveBusinessObjectFieldName,
    slaveBusinessObjectFieldCode = _record$toData.slaveBusinessObjectFieldCode,
    businessObjectId = _record$toData.businessObjectId;
  const relyPanelDs = useMemo(() => new _DataSet(controlLovValueDs(record)), [record]);
  const init = async () => {
    if (fieldDependenceId) {
      await relyPanelDs.query();
      const slaveBusinessObjectFieldLovCode = record.getState('lovCode');
      const valueList = await getFieldRelyValueMap(slaveBusinessObjectFieldLovCode, {
        businessObjectId,
        slaveBusinessObjectFieldCode
      });
      if (getResponse(valueList)) {
        relyPanelDs.setState('valueList', (valueList === null || valueList === void 0 ? void 0 : valueList.map(item => {
          let meaning = item.meaning;
          if (Object.prototype.toString.call(meaning) === '[Object Object]') {
            var _meaning$getCurrentLa, _meaning, _Object$values;
            meaning = (_meaning$getCurrentLa = (_meaning = meaning) === null || _meaning === void 0 ? void 0 : _meaning[getCurrentLanguage()]) !== null && _meaning$getCurrentLa !== void 0 ? _meaning$getCurrentLa : (_Object$values = Object.values(meaning)) === null || _Object$values === void 0 ? void 0 : _Object$values[0];
          }
          return {
            ...item,
            meaning
          };
        })) || []);
      }
    }
  };
  useEffect(() => {
    init();
  }, [fieldDependenceId]);
  return /*#__PURE__*/React.createElement(_Spin, {
    dataSet: relyPanelDs
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['rely-card-container']
  }, relyPanelDs === null || relyPanelDs === void 0 ? void 0 : relyPanelDs.map(item => /*#__PURE__*/React.createElement(Card, {
    dataSet: relyPanelDs,
    controlBusinessObjectFieldName: controlBusinessObjectFieldName,
    slaveBusinessObjectFieldName: slaveBusinessObjectFieldName,
    item: item,
    businessObjectId: businessObjectId,
    fieldDependenceId: fieldDependenceId
  }))));
});
const Card = observer(({
  dataSet,
  controlBusinessObjectFieldName,
  slaveBusinessObjectFieldName,
  item,
  businessObjectId,
  fieldDependenceId
}) => {
  var _document$getElements, _document$getElements2, _document$getElementB, _item$get, _item$get3, _item$get3$slice, _item$get5, _item$get5$slice;
  const contentRef = useRef();
  const _useState3 = useState(),
    _useState4 = _slicedToArray(_useState3, 2),
    fourthLastIndex = _useState4[0],
    setFourthLastIndex = _useState4[1];
  const size = useChangeSize(setFourthLastIndex);
  const target160 = (_document$getElements = document.getElementsByClassName('hzero-main-menu')) === null || _document$getElements === void 0 ? void 0 : _document$getElements[0];
  const target150 = (_document$getElements2 = document.getElementsByClassName('hzero-common-layout-container')) === null || _document$getElements2 === void 0 ? void 0 : _document$getElements2[0];
  const targetContainer = (_document$getElementB = document.getElementById('root')) === null || _document$getElementB === void 0 ? void 0 : _document$getElementB.firstChild;
  // TypeError: Failed to execute 'observe' on 'MutationObserver': parameter 1 is not of type 'Node'.
  // 【问题原因】该报错是由于 target 未获取到dom节点，MutationObserver监听的元素不存在，根本原因：不同主题或版本监听的dom类名不同。
  // 【解决方案】寻找Hzero左侧菜单收起展开类型变化的dom元素并监听它。
  const target = target160 || target150 || targetContainer; // hzero-front 不同版本下hzero菜单class类名不一致
  const mutationObserver = useMemo(() => new MutationObserver(mutations => {
    mutations.forEach(() => {
      setFourthLastIndex(undefined);
      setTimeout(() => changeIndex(), 300);
    });
  }), []);
  mutationObserver.observe(target, {
    attributes: true
  });
  useEffect(() => {
    return () => {
      mutationObserver.disconnect();
    };
  });
  const changeIndex = () => {
    const _contentRef$current = contentRef.current,
      offsetHeight = _contentRef$current.offsetHeight,
      offsetLeft = _contentRef$current.offsetLeft,
      offsetTop = _contentRef$current.offsetTop,
      offsetWidth = _contentRef$current.offsetWidth,
      childNodes = _contentRef$current.childNodes,
      scrollHeight = _contentRef$current.scrollHeight;
    setFourthLastIndex(undefined);
    if (scrollHeight <= 108) {
      setMoreFlag(false);
      return;
    }
    const childList = _toArray(childNodes).filter(child => !child.className);
    if (!_isEmpty(childList)) {
      const res = childList.some((child, index) => {
        const childHeight = child.offsetHeight,
          childLeft = child.offsetLeft,
          childTop = child.offsetTop,
          childWidth = child.offsetWidth;
        if (childTop > offsetTop + offsetHeight - 12 || childTop + childHeight + 4 >= offsetHeight + offsetTop && offsetLeft + offsetWidth - childWidth - childLeft <= 36 && index !== childList.length - 1) {
          setFourthLastIndex(index);
          return true;
        } else {
          return false;
        }
      });
      if (!res) {
        setFourthLastIndex(undefined);
        setMoreFlag(false);
      }
    }
  };
  useEffect(() => {
    changeIndex();
  }, [(_item$get = item.get('valueMap')) === null || _item$get === void 0 ? void 0 : _item$get.length, size]);
  const _useState5 = useState(false),
    _useState6 = _slicedToArray(_useState5, 2),
    moreFlag = _useState6[0],
    setMoreFlag = _useState6[1];
  const _useState7 = useState(''),
    _useState8 = _slicedToArray(_useState7, 2),
    checkboxSearch = _useState8[0],
    setCheckboxSearch = _useState8[1];
  const checkOptions = useMemo(() => {
    var _dataSet$getState, _dataSet$getState$fil;
    return (_dataSet$getState = dataSet.getState('valueList')) === null || _dataSet$getState === void 0 ? void 0 : (_dataSet$getState$fil = _dataSet$getState.filter) === null || _dataSet$getState$fil === void 0 ? void 0 : _dataSet$getState$fil.call(_dataSet$getState, ({
      meaning
    }) => !checkboxSearch || (meaning === null || meaning === void 0 ? void 0 : meaning.includes(checkboxSearch)));
  }, [dataSet.getState('valueList'), checkboxSearch]);
  const handleDebounceSearch = _debounce(val => {
    setCheckboxSearch(val);
  }, 200, {
    trailing: true
  });
  const handleSave = async () => {
    await dataSet.submit();
  };
  return /*#__PURE__*/React.createElement("div", {
    className: styles['rely-card'],
    style: moreFlag ? {
      position: 'relative',
      zIndex: 2,
      borderColor: '#0840F8',
      borderRadius: '2px 2px 0 0'
    } : {}
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['rely-card-title']
  }, /*#__PURE__*/React.createElement("span", null, controlBusinessObjectFieldName, ": ", item === null || item === void 0 ? void 0 : item.get('meaning'))), /*#__PURE__*/React.createElement("div", {
    className: styles['rely-card-content'],
    ref: dom => {
      contentRef.current = dom;
    }
  }, /*#__PURE__*/React.createElement(_Tooltip, {
    theme: "light",
    placement: "bottomLeft",
    trigger: 'click',
    onHiddenChange: async visible => {
      if (visible) {
        handleSave();
      }
      handleDebounceSearch('');
    },
    title: /*#__PURE__*/React.createElement("div", {
      className: styles.selectableSlaveFieldList
    }, /*#__PURE__*/React.createElement("span", null, slaveBusinessObjectFieldName), /*#__PURE__*/React.createElement(_TextField, {
      hidden: _isEmpty(dataSet.getState('valueList')),
      value: checkboxSearch,
      onInput: e => {
        var _e$target;
        return handleDebounceSearch((e === null || e === void 0 ? void 0 : (_e$target = e.target) === null || _e$target === void 0 ? void 0 : _e$target.value) || '');
      }
    }), !_isEmpty(checkOptions) ? /*#__PURE__*/React.createElement("div", null, checkOptions.map(({
      meaning,
      value
    }) => {
      return /*#__PURE__*/React.createElement(_CheckBox, {
        name: "valueMap",
        value: value,
        checked: item.get('valueMap').some(({
          slaveValue
        }) => slaveValue === value),
        onChange: val => {
          const valueMap = item.get('valueMap');
          if (!val) {
            item.set('valueMap', valueMap.filter(({
              slaveValue
            }) => slaveValue !== value));
          } else {
            var _item$get2;
            item.set('valueMap', [...valueMap, {
              ...(((_item$get2 = item.get('valueMap')) === null || _item$get2 === void 0 ? void 0 : _item$get2.find(({
                slaveValue
              }) => slaveValue === value)) || {}),
              controlValue: item.get('value'),
              slaveValue: value,
              slaveMeaning: meaning,
              businessObjectId,
              fieldDependenceId,
              tenantId
            }]);
          }
        }
      }, meaning);
    })) : /*#__PURE__*/React.createElement("div", {
      style: {
        margin: 20,
        textAlign: 'center'
      }
    }, intl.get('hmde.common.nodata').d('暂无数据')))
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['rely-field-add']
  }, /*#__PURE__*/React.createElement(_Icon, {
    type: "add",
    style: {
      marginRight: 4
    }
  }), intl.get('hmde.common.button.add').d('添加'))), (_item$get3 = item.get('valueMap')) === null || _item$get3 === void 0 ? void 0 : (_item$get3$slice = _item$get3.slice(0, fourthLastIndex)) === null || _item$get3$slice === void 0 ? void 0 : _item$get3$slice.map(field => {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SpringTooltip, {
      title: field.slaveMeaning
    }, stRef => /*#__PURE__*/React.createElement("span", {
      ref: stRef
    }, field.slaveMeaning)), /*#__PURE__*/React.createElement(ImgIcon, {
      className: styles['field-delete'],
      name: "failed@3x.png",
      size: 12,
      onClick: () => {
        var _item$get4;
        item.set('valueMap', (_item$get4 = item.get('valueMap')) === null || _item$get4 === void 0 ? void 0 : _item$get4.filter(i => i.slaveValue !== field.slaveValue));
        handleSave();
      }
    }));
  }), /*#__PURE__*/React.createElement("div", {
    className: styles['rely-field-more'],
    hidden: !fourthLastIndex,
    onClick: () => setMoreFlag(!moreFlag)
  }, /*#__PURE__*/React.createElement(_Icon, {
    type: moreFlag ? 'baseline-arrow_drop_up' : 'baseline-arrow_drop_down'
  })), fourthLastIndex && ((_item$get5 = item.get('valueMap')) === null || _item$get5 === void 0 ? void 0 : (_item$get5$slice = _item$get5.slice(fourthLastIndex)) === null || _item$get5$slice === void 0 ? void 0 : _item$get5$slice.map(field => {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SpringTooltip, {
      title: field.slaveMeaning
    }, stRef => /*#__PURE__*/React.createElement("span", {
      ref: stRef
    }, field.slaveMeaning)), /*#__PURE__*/React.createElement(ImgIcon, {
      className: styles['field-delete'],
      name: "failed@3x.png",
      size: 12,
      onClick: () => {
        var _item$get6;
        item.set('valueMap', (_item$get6 = item.get('valueMap')) === null || _item$get6 === void 0 ? void 0 : _item$get6.filter(i => i.slaveValue !== field.slaveValue));
        handleSave();
      }
    }));
  }))), fourthLastIndex && /*#__PURE__*/React.createElement("div", {
    className: styles['more-filed-content'],
    style: !moreFlag ? {} : {
      display: 'block'
    }
  }, item.get('valueMap').slice(fourthLastIndex).map(field => {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SpringTooltip, {
      title: field.slaveMeaning
    }, stRef => /*#__PURE__*/React.createElement("span", {
      ref: stRef
    }, field.slaveMeaning)), /*#__PURE__*/React.createElement(ImgIcon, {
      className: styles['field-delete'],
      name: "failed@3x.png",
      size: 12,
      onClick: () => {
        var _item$get7;
        item.set('valueMap', (_item$get7 = item.get('valueMap')) === null || _item$get7 === void 0 ? void 0 : _item$get7.filter(i => i.slaveValue !== field.slaveValue));
        handleSave();
      }
    }));
  })));
});
export default formatterCollections({
  code: ['hmde.common', 'hmde.bo']
})(observer(Index));