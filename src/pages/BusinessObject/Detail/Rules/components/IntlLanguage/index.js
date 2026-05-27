import _Spin from "@hzero-front-ui/c7n-ui/lib/SpinPro";
import _Lov from "@hzero-front-ui/c7n-ui/lib/LovPro";
import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
import _SelectBox from "@hzero-front-ui/c7n-ui/lib/SelectBoxPro";
import _useDataSet from "choerodon-ui/pro/lib/use-data-set";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _useModal from "choerodon-ui/pro/lib/use-modal";
import _isArray from "lodash/isArray";
import _forOwn from "lodash/forOwn";
import React, { useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { ButtonColor, FuncType } from 'choerodon-ui/pro/lib/button/enum';
import { getCurrentLanguage, getResponse } from 'utils/utils';
import { toJS } from 'mobx';
import { useSafeState } from 'ahooks';
import { ViewMode } from 'choerodon-ui/pro/lib/lov/enum';
import intl from 'utils/intl';
import { queryIntlMultiLanguageService } from "hzero-front-hmde/lib/services/commonService";
import { getBoErrorRuleInfoTemplate, saveBoErrorRuleInfoTemplate } from "hzero-front-hmde/lib/services/businessObjectService";
import languageDS, { FN as LanguageFN, LanguageType } from "../../datasets/languageDS";
import languageDiyDS from "../../datasets/languageDiyDS";
import languageTemplateDS, { FN as LanguageTemplateFN } from "../../datasets/languageTemplateDS";
import lovTemplateDS, { FN as LovTemplateFN } from "../../datasets/lovTemplateDS";
import Diy from "./components/DiyCom";
import Template from "./components/Template";
import CreateLanguageTemplateModal from "./components/CreateLanguageTemplateModal";
import { buildLanguageTemplate } from "../../utils";
import styles from "./index.less?modules";
export let ErrorInfoType = /*#__PURE__*/function (ErrorInfoType) {
  ErrorInfoType["PLATFORM"] = "PLATFORM";
  ErrorInfoType["CUSTOM"] = "CUSTOM";
  return ErrorInfoType;
}({});
const IntlLanguage = ({
  disabled,
  record,
  modal,
  domainCode
}) => {
  var _languageDs$current;
  const Modal = _useModal();
  // 获取当前系统所有多语言
  const supportLanguage = useMemo(() => window.dvaApp._store.getState().global.supportLanguage || [], []);
  const _useSafeState = useSafeState(false),
    _useSafeState2 = _slicedToArray(_useSafeState, 2),
    loading = _useSafeState2[0],
    setLoading = _useSafeState2[1];
  const languageDs = _useDataSet(() => languageDS(), []);
  const languageDiyDs = _useDataSet(() => languageDiyDS(supportLanguage), [supportLanguage]);
  const languageTemplateDs = _useDataSet(() => languageTemplateDS(supportLanguage), [supportLanguage]);
  const lovTemplateDs = _useDataSet(() => lovTemplateDS(), []);
  const languageType = (_languageDs$current = languageDs.current) === null || _languageDs$current === void 0 ? void 0 : _languageDs$current.get(LanguageFN.TYPE);

  // 初始化
  useEffect(() => {
    init();
  }, []);
  const init = async () => {
    // 判断是自定义还是选择模版
    const errorInfoType = record.get('errorInfoType');
    if (errorInfoType) {
      var _languageDs$current2;
      (_languageDs$current2 = languageDs.current) === null || _languageDs$current2 === void 0 ? void 0 : _languageDs$current2.set(LanguageFN.TYPE, errorInfoType);
      // 自定义
      if (errorInfoType === ErrorInfoType.CUSTOM) {
        // 如果能拿到多语言数据,直接回填
        const _tls = toJS(record.get('_tls')) || {};
        const errorInfoTls = _tls.errorInfo;
        if (errorInfoTls) {
          _forOwn(errorInfoTls, (value, key) => {
            var _languageDiyDs$curren;
            (_languageDiyDs$curren = languageDiyDs.current) === null || _languageDiyDs$curren === void 0 ? void 0 : _languageDiyDs$curren.set(key, value);
          });
        } else {
          setLoading(true);
          const res = await queryIntlMultiLanguageService({
            fieldName: 'errorInfo',
            _token: record.get('_token')
          });
          setLoading(false);
          if (getResponse(res) && _isArray(res)) {
            res.forEach(item => {
              var _languageDiyDs$curren2;
              (_languageDiyDs$curren2 = languageDiyDs.current) === null || _languageDiyDs$curren2 === void 0 ? void 0 : _languageDiyDs$curren2.set(item.code, item.value);
            });
          }
        }
      } else if (errorInfoType === ErrorInfoType.PLATFORM) {
        setLoading(true);
        const res = await getBoErrorRuleInfoTemplate({
          code: record.get('errorInfo')
        });
        setLoading(false);
        if (getResponse(res)) {
          languageTemplateDs.create(getLanguageTemplateData(res));
        }
      }
    }
    // 回填外部填写的多语言内容,到当前语言
    const curValue = record.get('errorInfoMeaning');
    if (curValue) {
      var _languageDs$current3, _languageDs$current4;
      if (((_languageDs$current3 = languageDs.current) === null || _languageDs$current3 === void 0 ? void 0 : _languageDs$current3.get(LanguageFN.TYPE)) === ErrorInfoType.CUSTOM) {
        var _languageDiyDs$curren3;
        (_languageDiyDs$curren3 = languageDiyDs.current) === null || _languageDiyDs$curren3 === void 0 ? void 0 : _languageDiyDs$curren3.set(getCurrentLanguage(), curValue);
      } else if (((_languageDs$current4 = languageDs.current) === null || _languageDs$current4 === void 0 ? void 0 : _languageDs$current4.get(LanguageFN.TYPE)) === ErrorInfoType.PLATFORM) {
        var _languageTemplateDs$c;
        (_languageTemplateDs$c = languageTemplateDs.current) === null || _languageTemplateDs$c === void 0 ? void 0 : _languageTemplateDs$c.set(getCurrentLanguage(), curValue);
      }
    }
  };
  useEffect(() => {
    modal === null || modal === void 0 ? void 0 : modal.handleOk(async () => {
      // 确定多语言类型
      record.set('errorInfoType', languageType);
      // 如果选择了自定义,需要回填多语言数据
      if (languageType === LanguageType.CUSTOM) {
        var _languageDiyDs$curren6;
        const flag = await languageDiyDs.validate();
        if (!flag) return false;
        // 如果存在为空的数据,需要用当前语言数据进行回填
        const errorInfo = {};
        languageDiyDs.fields.forEach((_, key) => {
          var _languageDiyDs$curren4, _languageDiyDs$curren5;
          const value = (_languageDiyDs$curren4 = languageDiyDs.current) === null || _languageDiyDs$curren4 === void 0 ? void 0 : _languageDiyDs$curren4.get(key);
          errorInfo[key] = value !== null && value !== void 0 ? value : (_languageDiyDs$curren5 = languageDiyDs.current) === null || _languageDiyDs$curren5 === void 0 ? void 0 : _languageDiyDs$curren5.get(getCurrentLanguage());
        });
        const currentLanguageErrorInfo = (_languageDiyDs$curren6 = languageDiyDs.current) === null || _languageDiyDs$curren6 === void 0 ? void 0 : _languageDiyDs$curren6.get(getCurrentLanguage());
        record.set({
          errorInfo: currentLanguageErrorInfo,
          errorInfoMeaning: currentLanguageErrorInfo
        });
        const _tls = toJS(record.get('_tls')) || {};
        record.set('_tls', {
          ..._tls,
          errorInfo: errorInfo
        });
      } else if (languageType === LanguageType.PLATFORM) {
        var _languageTemplateDs$c2;
        const flag = await languageTemplateDs.validate();
        if (!flag) return false;
        // 保存
        const data = buildLanguageTemplate((_languageTemplateDs$c2 = languageTemplateDs.current) === null || _languageTemplateDs$c2 === void 0 ? void 0 : _languageTemplateDs$c2.toData());
        const res = await saveBoErrorRuleInfoTemplate(data);
        if (getResponse(res)) {
          var _languageTemplateDs$c3, _languageTemplateDs$c4;
          // 回填
          record.set({
            errorInfo: (_languageTemplateDs$c3 = languageTemplateDs.current) === null || _languageTemplateDs$c3 === void 0 ? void 0 : _languageTemplateDs$c3.get(LanguageTemplateFN.ERROR_INFO),
            errorInfoMeaning: (_languageTemplateDs$c4 = languageTemplateDs.current) === null || _languageTemplateDs$c4 === void 0 ? void 0 : _languageTemplateDs$c4.get(getCurrentLanguage())
          });
          // 删除自定义多语言
          const _tls = toJS(record.get('_tls')) || {};
          delete _tls.errorInfo;
          record.set('_tls', _tls);
        } else {
          return false;
        }
      }
      return true;
    });
  }, [modal, languageType, languageDiyDs, languageDiyDs]);

  // 填充模板数据
  const fillLanguageTemplate = data => {
    var _languageDs$current5;
    (_languageDs$current5 = languageDs.current) === null || _languageDs$current5 === void 0 ? void 0 : _languageDs$current5.set(LanguageFN.TYPE, LanguageType.PLATFORM);
    languageTemplateDs.loadData([getLanguageTemplateData(data)]);
  };
  const handleOpenCreateLanguage = () => {
    var _languageDs$current6;
    Modal.open({
      title: intl.get('hmde.bo.language.createTemplate').d('新建多语言模板'),
      closable: true,
      style: {
        width: 595
      },
      children: /*#__PURE__*/React.createElement(CreateLanguageTemplateModal, {
        supportLanguage: supportLanguage,
        fillLanguageTemplate: fillLanguageTemplate,
        languageType: (_languageDs$current6 = languageDs.current) === null || _languageDs$current6 === void 0 ? void 0 : _languageDs$current6.get(LanguageFN.TYPE),
        languageDiyDs: languageDiyDs,
        domainCode: domainCode
      }),
      okText: intl.get('hzero.common.button.save').d('保存')
    });
  };

  // 选择了多语言模板
  const onTemplateChange = value => {
    setLoading(true);
    getBoErrorRuleInfoTemplate({
      code: value.code
    }).then(res => {
      setLoading(false);
      if (getResponse(res)) {
        const data = getLanguageTemplateData(res);
        if (languageTemplateDs.length === 0) {
          languageTemplateDs.create(data);
        } else {
          languageTemplateDs.loadData([data]);
        }
      }
    });
  };
  function getLanguageTemplateData(res) {
    const data = {
      [LanguageTemplateFN.ERROR_INFO]: res.errorInfo,
      [LanguageTemplateFN.TYPE]: res.type
    };
    const responseMessages = res.responseMessages || [];
    responseMessages.forEach(item => {
      data[item.lang] = item.description;
    });
    return data;
  }
  return /*#__PURE__*/React.createElement(_Spin, {
    spinning: loading
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.wrapper
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.head
  }, /*#__PURE__*/React.createElement(_SelectBox, {
    dataSet: languageDs,
    name: LanguageFN.TYPE
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(_Button, {
    funcType: "link",
    color: "primary",
    icon: "add",
    disabled: disabled,
    onClick: handleOpenCreateLanguage
  }, intl.get('hmde.bo.language.createTemplate').d('新建多语言模板')), languageType === LanguageType.PLATFORM && /*#__PURE__*/React.createElement(_Lov, {
    dataSet: lovTemplateDs,
    name: LovTemplateFN.CODE,
    mode: "button",
    icon: "LOV-o",
    funcType: "link",
    color: "primary",
    clearButton: false,
    onChange: onTemplateChange,
    disabled: disabled
  }, intl.get('hmde.bo.view.selectTemplate').d('选择模板')))), languageType === LanguageType.CUSTOM && /*#__PURE__*/React.createElement(Diy, {
    languageDiyDs: languageDiyDs
  }), languageType === LanguageType.PLATFORM && /*#__PURE__*/React.createElement(Template, {
    languageTemplateDs: languageTemplateDs,
    supportLanguage: supportLanguage
  })));
};
export default observer(IntlLanguage);