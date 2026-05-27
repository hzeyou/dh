import _Tooltip from "@hzero-front-ui/c7n-ui/lib/Tooltip";
import React, { useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import intl from 'utils/intl';
import ImgErArrowRed from "hzero-front-hmde/lib/assets/icon/er_arrow_red.svg";
import ImgErArrowBlue from "hzero-front-hmde/lib/assets/icon/er_arrow_blue.svg";
import ImgErArrowGray from "hzero-front-hmde/lib/assets/icon/er_arrow_gray.svg";
import styles from "./index.less?modules";
const Legend = ({
  hidden
}) => {
  const legendList = useMemo(() => {
    return [{
      label: /*#__PURE__*/React.createElement("span", {
        className: styles.star
      }, "*"),
      text: intl.get('hmde.bo.businessObject.willLoseField').d('必输字段')
    }, {
      label: '1 - 1',
      text: intl.get('hmde.bo.businessObject.legendList.text1').d('主对象与从对象1-1关联')
    }, {
      label: '1 - N',
      text: intl.get('hmde.bo.businessObject.legendList.text2').d('主对象与从对象1-N关联')
    }, {
      label: /*#__PURE__*/React.createElement("img", {
        src: ImgErArrowRed,
        alt: "erArrow"
      }),
      text: intl.get('hmde.bo.businessObject.legendList.text3').d('从主关系、高级关系（从主）')
    }, {
      label: /*#__PURE__*/React.createElement("img", {
        src: ImgErArrowBlue,
        alt: "erArrow"
      }),
      text: intl.get('hmde.bo.businessObject.legendList.text4').d('关联关系、高级关系（关联）')
    }, {
      label: /*#__PURE__*/React.createElement("img", {
        src: ImgErArrowGray,
        alt: "erArrow"
      }),
      text: intl.get('hmde.bo.businessObject.legendList.text5').d('高级关系（条件）')
    }];
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: styles.legend,
    hidden: hidden
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.title
  }, intl.get('hmde.bo.businessObject.legend').d('图例')), /*#__PURE__*/React.createElement("div", {
    className: styles.list
  }, legendList.map(({
    label,
    text
  }) => /*#__PURE__*/React.createElement("div", {
    className: styles.item
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.label
  }, label), /*#__PURE__*/React.createElement(_Tooltip, {
    placement: "top",
    title: text
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.text
  }, text))))));
};
export default observer(Legend);