import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
/*
 * @空tab页
 * @Date: 2021-04-01
 * @Author: 汪渊  <yuan.wang07@hand-china.com>
 * @version: 1.0.0
 * @copyright: copyright: HAND ® 2020
 */
import React, { useEffect, useState } from 'react';
import ImgIcon from "hzero-front-hmde/lib/utils/ImgIcon";
const defaultStyles = {
  // imgWrapperHeight: 250,
  imgWrapperWidth: 572,
  imgWrapperMargin: '0px auto',
  marginLeft: 40,
  helpFontSize: '16px',
  helpColor: 'rgba(0,0,0,0.65)',
  messageFontSize: '22px',
  messageMarginTop: 10
};
const Index = ({
  help,
  message,
  styles = {}
}) => {
  const _useState = useState({}),
    _useState2 = _slicedToArray(_useState, 2),
    emptyStyle = _useState2[0],
    setEmptyStyle = _useState2[1];
  useEffect(() => {
    const newStyle = {
      ...defaultStyles,
      ...styles
    };
    setEmptyStyle(newStyle);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      // height: emptyStyle.imgWrapperHeight,
      margin: emptyStyle.imgWrapperMargin,
      width: emptyStyle.imgWrapperWidth
    }
  }, /*#__PURE__*/React.createElement(ImgIcon, {
    name: "no-model@2x.png",
    size: 250
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: emptyStyle.marginLeft
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: emptyStyle.helpFontSize,
      color: emptyStyle.color
    }
  }, help), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: emptyStyle.messageFontSize,
      marginTop: emptyStyle.messageMarginTop
    }
  }, message)));
};
export default Index;