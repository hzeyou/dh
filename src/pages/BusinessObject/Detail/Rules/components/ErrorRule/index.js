import _Icon from "choerodon-ui/pro/lib/icon";
import _Tooltip from "@hzero-front-ui/c7n-ui/lib/TooltipPro";
import _TextArea from "@hzero-front-ui/c7n-ui/lib/TextAreaPro";
import _extends from "@babel/runtime/helpers/esm/extends";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _useModal from "choerodon-ui/pro/lib/use-modal";
import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import intl from 'utils/intl';
import { LabelLayout } from 'choerodon-ui/pro/lib/form/enum';
import useThemeColor from "hzero-front-apaas/lib/hooks/useThemeColor";
import { useBoStore } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/stores";
import IntlLanguage, { ErrorInfoType } from "../IntlLanguage";
import styles from "./index.less?modules";
const ErrorRule = ({
  disabled,
  record,
  name,
  ...rest
}) => {
  var _baseInfoDS$current;
  const Modal = _useModal();
  const boStore = useBoStore();
  const baseInfoDS = boStore === null || boStore === void 0 ? void 0 : boStore.getState('baseInfoDS');
  const domainCode = baseInfoDS === null || baseInfoDS === void 0 ? void 0 : (_baseInfoDS$current = baseInfoDS.current) === null || _baseInfoDS$current === void 0 ? void 0 : _baseInfoDS$current.get('domainCode');
  const _useThemeColor = useThemeColor(),
    primary = _useThemeColor.primary;
  const textAreaRef = useRef(null);
  const _useState = useState('rgb(251, 173, 0)'),
    _useState2 = _slicedToArray(_useState, 2),
    extraBorderColor = _useState2[0],
    setExtraBorderColor = _useState2[1];
  const isTypePlatform = (record === null || record === void 0 ? void 0 : record.get('errorInfoType')) === ErrorInfoType.PLATFORM;

  // 用于获取边框校验状态的颜色
  useEffect(() => {
    if (!isTypePlatform) {
      var _textAreaRef$current, _textAreaRef$current$;
      if ((_textAreaRef$current = textAreaRef.current) !== null && _textAreaRef$current !== void 0 && (_textAreaRef$current$ = _textAreaRef$current.element.parentElement) !== null && _textAreaRef$current$ !== void 0 && _textAreaRef$current$.parentElement) {
        var _textAreaRef$current3;
        const mutationObserver = new MutationObserver(() => {
          var _textAreaRef$current2;
          if ((_textAreaRef$current2 = textAreaRef.current) !== null && _textAreaRef$current2 !== void 0 && _textAreaRef$current2.element) {
            // 获取 TextArea 上的颜色
            const borderColor = getComputedStyle(textAreaRef.current.element).borderColor;
            if (borderColor) {
              setExtraBorderColor(borderColor);
            }
          }
        });
        mutationObserver.observe((_textAreaRef$current3 = textAreaRef.current) === null || _textAreaRef$current3 === void 0 ? void 0 : _textAreaRef$current3.element.parentElement.parentElement, {
          attributes: true,
          attributeFilter: ['class']
        });
      }
    } else {
      setExtraBorderColor('rgb(230,230,230)');
    }
  }, [isTypePlatform]);
  const handleOpenIntlLanguage = () => {
    if (domainCode) {
      Modal.open({
        title: intl.get('hmde.bo.intl.language').d('多语言'),
        closable: true,
        style: {
          width: 595
        },
        children: /*#__PURE__*/React.createElement(IntlLanguage, {
          record: record,
          disabled: disabled,
          domainCode: domainCode
        }),
        okProps: {
          disabled
        }
      });
    }
  };
  const renderTextArea = () => {
    const textDom = /*#__PURE__*/React.createElement(_TextArea, _extends({
      ref: textAreaRef,
      record: record,
      name: name,
      disabled: disabled || isTypePlatform
    }, rest, {
      labelLayout: "horizontal"
    }));
    if (isTypePlatform) {
      return /*#__PURE__*/React.createElement(_Tooltip, {
        title: intl.get('hmde.bo.language.templateDisableTips').d('已引用多语言模板，禁止编辑，请至多语言弹窗内进行维护')
      }, textDom);
    } else {
      return textDom;
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: styles.wrapper
  }, renderTextArea(), /*#__PURE__*/React.createElement("div", {
    style: {
      borderColor: extraBorderColor
    },
    className: styles.extra,
    onClick: handleOpenIntlLanguage
  }, /*#__PURE__*/React.createElement(_Icon, {
    type: "language",
    style: {
      color: isTypePlatform ? primary : undefined
    }
  })));
};
export default observer(ErrorRule);