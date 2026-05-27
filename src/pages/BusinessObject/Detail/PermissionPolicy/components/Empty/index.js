import _Result from "@hzero-front-ui/c7n-ui/lib/Result";
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useMemo } from 'react';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import EmptyImg from "hzero-front-hmde/lib/assets/icon/noData.png";
/**
 * 空态图
 * @param align
 * @param style
 * @param imgSrc
 * @param imgStyle
 * @param title
 * @param subTitle
 * @param rest
 * @constructor
 */
const Empty = ({
  align,
  style,
  imgSrc,
  imgStyle,
  title,
  subTitle,
  ...rest
}) => {
  const resultStyle = useMemo(() => {
    let _style = {};
    if (align === 'center') {
      _style = {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%,-50%)'
      };
    }
    return {
      ..._style,
      ...style
    };
  }, [style]);
  return /*#__PURE__*/React.createElement(_Result, _extends({
    style: resultStyle,
    icon: /*#__PURE__*/React.createElement("img", {
      src: imgSrc || EmptyImg,
      width: 160,
      height: 160,
      alt: "empty",
      style: imgStyle
    }),
    title: /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'rgba(0, 0, 0, 0.45)',
        fontSize: '12px'
      }
    }, title || intl.get('hmde.common.nodata').d('暂无数据')),
    subTitle: /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'rgba(0, 0, 0, 0.25)'
      }
    }, subTitle)
  }, rest));
};
export default formatterCollections({
  code: ['hmde.common']
})(Empty);