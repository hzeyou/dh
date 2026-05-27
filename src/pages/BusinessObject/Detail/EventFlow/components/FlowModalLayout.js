import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
import _Dropdown from "@hzero-front-ui/c7n-ui/lib/Dropdown";
import _Menu from "@hzero-front-ui/c7n-ui/lib/Menu";
import _Output from "@hzero-front-ui/c7n-ui/lib/OutputPro";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _Icon from "choerodon-ui/lib/icon";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { useEffect, useState } from 'react';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { observer } from 'mobx-react-lite';
import ImgIcon from "hzero-front-hmde/lib/utils/ImgIcon";
import Popconfirm from "hzero-front-hmde/lib/businessComponents/Popconfirm";
import styles from "../index.less?modules";
const Index = ({
  dataSet,
  title,
  name,
  children
}) => {
  var _dataSet$data, _dataSet$data$filter, _records$;
  const records = (_dataSet$data = dataSet.data) === null || _dataSet$data === void 0 ? void 0 : (_dataSet$data$filter = _dataSet$data.filter(record => !(record !== null && record !== void 0 && record.get('defaultFlag')))) === null || _dataSet$data$filter === void 0 ? void 0 : _dataSet$data$filter.sort((a, b) => (a === null || a === void 0 ? void 0 : a.get('orderSeq')) - (b === null || b === void 0 ? void 0 : b.get('orderSeq')));
  const _useState = useState(String(records === null || records === void 0 ? void 0 : (_records$ = records[0]) === null || _records$ === void 0 ? void 0 : _records$.id) || ''),
    _useState2 = _slicedToArray(_useState, 2),
    selectKey = _useState2[0],
    setSelectKey = _useState2[1];
  useEffect(() => {
    var _dataSet$findRecordBy;
    dataSet.locate((dataSet === null || dataSet === void 0 ? void 0 : (_dataSet$findRecordBy = dataSet.findRecordById(selectKey)) === null || _dataSet$findRecordBy === void 0 ? void 0 : _dataSet$findRecordBy.index) || 0);
  }, [selectKey]);
  const handleSelectMenuItem = async key => {
    if (await dataSet.validate()) {
      setSelectKey(key);
    }
  };
  const handleAddRecord = () => {
    const newRecord = dataSet.create({});
    newRecord.setState('editing', true);
    setSelectKey(String(newRecord === null || newRecord === void 0 ? void 0 : newRecord.id));
  };
  const handleDropDownMenuItem = async (key, record) => {
    if (key === 'edit') {
      record.setState('editing', true);
    }
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, records.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: styles['flow-modal-layout']
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['flow-modal-left']
  }, /*#__PURE__*/React.createElement("header", null, /*#__PURE__*/React.createElement("strong", null, "\u9875\u9762", title), /*#__PURE__*/React.createElement("a", {
    onClick: () => handleAddRecord()
  }, /*#__PURE__*/React.createElement(_Icon, {
    type: "add",
    style: {
      fontSize: 16,
      verticalAlign: 'unset'
    }
  }))), /*#__PURE__*/React.createElement(_Menu, {
    selectedKeys: [selectKey],
    onSelect: ({
      key
    }) => handleSelectMenuItem(key)
  }, records === null || records === void 0 ? void 0 : records.map(record => /*#__PURE__*/React.createElement(_Menu.Item, {
    key: record.id,
    style: {
      height: 'auto',
      paddingLeft: 8,
      paddingRight: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['flow-modal-left-menuitem']
  }, record.getState('editing') ? /*#__PURE__*/React.createElement(_TextField, {
    record: record,
    name: name,
    autoFocus: true,
    onBlur: async () => {
      if (await record.validate()) {
        record.setState('editing', false);
      }
    }
  }) : /*#__PURE__*/React.createElement(_Output, {
    record: record,
    name: name
  }), /*#__PURE__*/React.createElement(_Dropdown, {
    overlay: /*#__PURE__*/React.createElement(_Menu, {
      onClick: ({
        key
      }) => handleDropDownMenuItem(key, record)
    }, /*#__PURE__*/React.createElement(_Menu.Item, {
      key: "edit",
      disabled: record.getState('editing')
    }, intl.get('hmde.common.button.edit').d('编辑')), /*#__PURE__*/React.createElement(_Menu.Item, {
      key: "delete"
    }, /*#__PURE__*/React.createElement(Popconfirm, {
      title: intl.get('hmde.bo.businessObject.deletetip').d('是否删除'),
      content: intl.get('hmde.bo.view.deletethisdata').d('确定删除该条数据吗？'),
      placement: "rightTop",
      handleOk: async e => {
        e.stopPropagation();
        await dataSet.delete(record, false);
        if (String(record.id) === selectKey) {
          var _dataSet$data2, _dataSet$data2$filter, _dataSet$data2$filter2, _dataSet$data2$filter3;
          setSelectKey(String((_dataSet$data2 = dataSet.data) === null || _dataSet$data2 === void 0 ? void 0 : (_dataSet$data2$filter = _dataSet$data2.filter(item => !item.get('defaultFlag'))) === null || _dataSet$data2$filter === void 0 ? void 0 : (_dataSet$data2$filter2 = _dataSet$data2$filter.sort((a, b) => (a === null || a === void 0 ? void 0 : a.get('orderSeq')) - (b === null || b === void 0 ? void 0 : b.get('orderSeq')))) === null || _dataSet$data2$filter2 === void 0 ? void 0 : (_dataSet$data2$filter3 = _dataSet$data2$filter2[0]) === null || _dataSet$data2$filter3 === void 0 ? void 0 : _dataSet$data2$filter3.id));
        }
      }
    }, /*#__PURE__*/React.createElement("div", {
      onClick: e => e.stopPropagation()
    }, intl.get('hmde.common.button.delete').d('删除')))))
  }, /*#__PURE__*/React.createElement(_Icon, {
    type: "more_vert",
    style: {
      fontSize: 16,
      margin: 0
    }
  })))))), /*#__PURE__*/React.createElement("h2", {
    hidden: selectKey !== 'undefined'
  }, intl.get('hmde.common.nodata').d('暂无数据'), selectKey)), /*#__PURE__*/React.createElement("div", {
    className: styles['flow-modal-right']
  }, children)), records.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: styles['flow-modal-empty']
  }, /*#__PURE__*/React.createElement(ImgIcon, {
    name: "emptyState.png",
    size: 100,
    style: {
      marginBottom: 8
    }
  }), /*#__PURE__*/React.createElement("div", null, intl.get('hmde.common.message.nodata').d('暂无'), title), /*#__PURE__*/React.createElement("div", null, intl.get('hmde.common.view.clickbtn').d('请点击按钮进行添加')), /*#__PURE__*/React.createElement(_Button, {
    color: 'primary',
    icon: "add",
    style: {
      marginTop: 8
    },
    onClick: () => handleAddRecord()
  }, "\u6DFB\u52A0", title)));
};
export default formatterCollections({
  code: ['hmde.bo']
})(observer(Index));