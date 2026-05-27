import _Row from "choerodon-ui/pro/lib/row";
import _Output from "@hzero-front-ui/c7n-ui/lib/OutputPro";
import _Form from "@hzero-front-ui/c7n-ui/lib/FormPro";
import _TextArea from "@hzero-front-ui/c7n-ui/lib/TextAreaPro";
import _TextField from "@hzero-front-ui/c7n-ui/lib/TextFieldPro";
import _IntlField from "@hzero-front-ui/c7n-ui/lib/IntlFieldPro";
import _DataSet from "choerodon-ui/pro/lib/data-set";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _SelectBox from "@hzero-front-ui/c7n-ui/lib/SelectBoxPro";
import React, { useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { LabelAlign } from 'choerodon-ui/pro/lib/form/enum';
import { getResponse } from 'hzero-front/lib/utils/utils';
import notification from 'utils/notification';
import intl from 'utils/intl';
import uuid from 'uuid/v4';
import { enableRender } from "hzero-front-apaas/lib/utils/render";
import { publishStatusRender } from "../common";
import SelectItem from "../SelectItem";
import { platformList, platformType, TemplateList, TemplateType } from "../../commonCode";
import { codeHandle, PlatformDS, savePage, TemplatePageDS } from "./ds";
import styles from "./index.less?modules";
const Option = _SelectBox.Option;
export default observer(({
  modal,
  dataSet,
  isEdit,
  businessObjectCode,
  domainId
}, ref) => {
  const _useState = useState(TemplateType.TABLE),
    _useState2 = _slicedToArray(_useState, 2),
    actTpl = _useState2[0],
    setActTpl = _useState2[1];
  const _useState3 = useState([platformType.PC, platformType.MOBILE]),
    _useState4 = _slicedToArray(_useState3, 2),
    platforms = _useState4[0],
    setPlatforms = _useState4[1];
  const platformDS = useMemo(() => new _DataSet(PlatformDS()), []);
  const pcTemplatePageDS = useMemo(() => new _DataSet(TemplatePageDS(businessObjectCode, domainId)), []);
  const mobileTemplatePageDS = useMemo(() => new _DataSet(TemplatePageDS(businessObjectCode, domainId)), []);
  useImperativeHandle(ref, () => ({
    save: async () => {
      let flag = true;
      if (isEdit) {
        var _dataSet$current;
        // 编辑
        flag = await (dataSet === null || dataSet === void 0 ? void 0 : (_dataSet$current = dataSet.current) === null || _dataSet$current === void 0 ? void 0 : _dataSet$current.validate());
      } else {
        // 新建
        const validateList = [platformDS === null || platformDS === void 0 ? void 0 : platformDS.validate()];
        if (platforms.includes(platformType.PC)) {
          validateList.push(pcTemplatePageDS === null || pcTemplatePageDS === void 0 ? void 0 : pcTemplatePageDS.validate());
        }
        if (platforms.includes(platformType.MOBILE)) {
          validateList.push(mobileTemplatePageDS === null || mobileTemplatePageDS === void 0 ? void 0 : mobileTemplatePageDS.validate());
        }
        const result = await Promise.all([...validateList]);
        flag = result.every(item => item);
      }
      if (!flag) {
        return false;
      }
      let res;
      if (!isEdit) {
        var _dataSet$current2;
        // 新建
        // 校验预设页面编码唯一性
        if (platforms.includes(platformType.PC) && platforms.includes(platformType.MOBILE)) {
          var _pcTemplatePageDS$cur, _mobileTemplatePageDS;
          if ((pcTemplatePageDS === null || pcTemplatePageDS === void 0 ? void 0 : (_pcTemplatePageDS$cur = pcTemplatePageDS.current) === null || _pcTemplatePageDS$cur === void 0 ? void 0 : _pcTemplatePageDS$cur.get('pageCode')) === (mobileTemplatePageDS === null || mobileTemplatePageDS === void 0 ? void 0 : (_mobileTemplatePageDS = mobileTemplatePageDS.current) === null || _mobileTemplatePageDS === void 0 ? void 0 : _mobileTemplatePageDS.get('pageCode'))) {
            notification.warning({
              message: intl.get('hmde.bo.businessObject.compTemplateNameErrorRepeat').d('已存在相同编码的预设页面')
            });
            return false;
          }
        }
        const pages = [];
        if (platforms.includes(platformType.PC)) {
          const pcTemplatePageData = pcTemplatePageDS.toData()[0];
          pages.push({
            ...pcTemplatePageData,
            pageCode: codeHandle(businessObjectCode) + pcTemplatePageData.pageCode,
            platform: platformType.PC
          });
        }
        if (platforms.includes(platformType.MOBILE)) {
          const mobileTemplatePageData = mobileTemplatePageDS.toData()[0];
          pages.push({
            ...mobileTemplatePageDS.toData()[0],
            pageCode: codeHandle(businessObjectCode) + mobileTemplatePageData.pageCode,
            platform: platformType.MOBILE
          });
        }
        (_dataSet$current2 = dataSet.current) === null || _dataSet$current2 === void 0 ? void 0 : _dataSet$current2.set('params', {
          pages,
          pageTemplate: actTpl,
          businessObjectCode,
          domainId
        });
        res = await savePage(dataSet.toData());
      } else {
        res = await dataSet.submit();
      }
      if (getResponse(res)) {
        return res;
      } else {
        notification.error({
          description: res.message
        });
        return false;
      }
    }
  }));
  const selectTpl = temp => {
    setActTpl(temp);
  };

  // 当前选择模板
  const ActTplObj = useMemo(() => TemplateList.find(item => item.value === actTpl), [actTpl]);
  useEffect(() => {
    if (platforms.includes(platformType.MOBILE)) {
      var _mobileTemplatePageDS2, _mobileTemplatePageDS3;
      const pageCode = `${ActTplObj.value}_${uuid().slice(-5).toUpperCase()}`;
      mobileTemplatePageDS === null || mobileTemplatePageDS === void 0 ? void 0 : (_mobileTemplatePageDS2 = mobileTemplatePageDS.current) === null || _mobileTemplatePageDS2 === void 0 ? void 0 : _mobileTemplatePageDS2.set('pageName', ActTplObj.name);
      mobileTemplatePageDS === null || mobileTemplatePageDS === void 0 ? void 0 : (_mobileTemplatePageDS3 = mobileTemplatePageDS.current) === null || _mobileTemplatePageDS3 === void 0 ? void 0 : _mobileTemplatePageDS3.set('pageCode', pageCode);
    }
    if (platforms.includes(platformType.PC)) {
      var _pcTemplatePageDS$cur2, _pcTemplatePageDS$cur3;
      const pageCode = `${ActTplObj.value}_${uuid().slice(-5).toUpperCase()}`;
      pcTemplatePageDS === null || pcTemplatePageDS === void 0 ? void 0 : (_pcTemplatePageDS$cur2 = pcTemplatePageDS.current) === null || _pcTemplatePageDS$cur2 === void 0 ? void 0 : _pcTemplatePageDS$cur2.set('pageName', ActTplObj.name);
      pcTemplatePageDS === null || pcTemplatePageDS === void 0 ? void 0 : (_pcTemplatePageDS$cur3 = pcTemplatePageDS.current) === null || _pcTemplatePageDS$cur3 === void 0 ? void 0 : _pcTemplatePageDS$cur3.set('pageCode', pageCode);
    }
  }, [actTpl]);

  // 模板表单
  const TemplateForm = DS => {
    var _modal$props;
    return /*#__PURE__*/React.createElement(_Form, {
      dataSet: DS
      // useColon={false}
      ,
      labelAlign: "left",
      labelWidth: 60
    }, /*#__PURE__*/React.createElement(_IntlField, {
      name: "pageName",
      placeholder: intl.get('hmde.common.pleaseInput').d('请输入')
    }), /*#__PURE__*/React.createElement(_TextField, {
      addonBefore: `${modal === null || modal === void 0 ? void 0 : (_modal$props = modal.props) === null || _modal$props === void 0 ? void 0 : _modal$props.businessObjectCode}_`,
      name: "pageCode",
      restrict: "0-9a-zA-Z_",
      placeholder: intl.get('hmde.common.pleaseInput').d('请输入')
    }), /*#__PURE__*/React.createElement(_TextArea, {
      name: "remark",
      style: {
        height: 50
      }
    }));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: styles.addNewPageLayout
  }, isEdit ? /*#__PURE__*/React.createElement(_Form, {
    dataSet: dataSet,
    labelWidth: 100
  }, /*#__PURE__*/React.createElement(_IntlField, {
    name: "pageName",
    placeholder: intl.get('hmde.common.pleaseInput').d('请输入')
  }), /*#__PURE__*/React.createElement(_Output, {
    name: "platform",
    renderer: ({
      value
    }) => {
      if (value === platformType.MOBILE) {
        return intl.get('hmde.common.platformMobile').d('移动端');
      }
      return intl.get('hmde.common.platformPc').d('PC端');
    }
  }), /*#__PURE__*/React.createElement(_Output, {
    name: "pageCode"
  }), /*#__PURE__*/React.createElement(_Output, {
    name: "publishStatus",
    renderer: publishStatusRender
  }), /*#__PURE__*/React.createElement(_Output, {
    name: "pageType"
  }), /*#__PURE__*/React.createElement(_TextArea, {
    name: "remark"
  }), /*#__PURE__*/React.createElement(_Output, {
    name: "enabledFlag",
    renderer: ({
      value
    }) => enableRender(value)
  }), /*#__PURE__*/React.createElement(_Output, {
    name: "creator"
  }), /*#__PURE__*/React.createElement(_Output, {
    name: "creationDate"
  }), /*#__PURE__*/React.createElement(_Output, {
    name: "updater"
  }), /*#__PURE__*/React.createElement(_Output, {
    name: "lastUpdateDate"
  })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "templateSelection"
  }, TemplateList.map(item => /*#__PURE__*/React.createElement(SelectItem, {
    key: item.value,
    item: item,
    isAct: item.value === actTpl,
    selectTpl: selectTpl,
    platform: platforms
  }))), /*#__PURE__*/React.createElement("div", {
    className: "exampleWrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "addNewPageLayoutForm"
  }, /*#__PURE__*/React.createElement(_Form, {
    dataSet: platformDS,
    labelWidth: 72
  }, /*#__PURE__*/React.createElement(_Row, null, /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '0 0 8px 0'
    },
    className: "platformTitle"
  }, "\u5BA2\u6237\u7AEF")), /*#__PURE__*/React.createElement(_Row, null, /*#__PURE__*/React.createElement("div", {
    className: "platformSelect"
  }, /*#__PURE__*/React.createElement(_SelectBox, {
    name: "platform",
    onChange: () => {
      var _platformDS$current, _platformDS$current$g;
      return setPlatforms(platformDS === null || platformDS === void 0 ? void 0 : (_platformDS$current = platformDS.current) === null || _platformDS$current === void 0 ? void 0 : (_platformDS$current$g = _platformDS$current.get('platform')) === null || _platformDS$current$g === void 0 ? void 0 : _platformDS$current$g.toJS());
    }
  }, platformList.map(item => /*#__PURE__*/React.createElement(Option, {
    value: item.value,
    key: item.value
  }, item.name)))))), platforms.includes(platformType.PC) && /*#__PURE__*/React.createElement("div", {
    className: "platformForm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "platformTitle"
  }, "PC"), TemplateForm(pcTemplatePageDS)), platforms.includes(platformType.MOBILE) && /*#__PURE__*/React.createElement("div", {
    className: "platformForm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "platformTitle"
  }, "\u79FB\u52A8\u7AEF"), TemplateForm(mobileTemplatePageDS))))));
}, {
  forwardRef: true
});