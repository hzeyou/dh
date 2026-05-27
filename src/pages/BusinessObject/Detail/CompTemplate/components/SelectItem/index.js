import _Tooltip from "@hzero-front-ui/c7n-ui/lib/TooltipPro";
import React from 'react';
import classnames from 'classnames';
import emptyPcMobile from "hzero-front-hmde/lib/routes/BusinessObject/Detail/CompTemplate/assets/tplimg/empty_pc_mobile.png";
import formPcMobile from "hzero-front-hmde/lib/routes/BusinessObject/Detail/CompTemplate/assets/tplimg/form_pc_mobile.png";
import tablePcMobile from "hzero-front-hmde/lib/routes/BusinessObject/Detail/CompTemplate/assets/tplimg/table_pc_mobile.png";

// import emptyicon from '@hmde/routes/BusinessObject/Detail/CompTemplate/assets/emptyicon.png';
// import formicon from '@hmde/routes/BusinessObject/Detail/CompTemplate/assets/formicon.png';
// import tableicon from '@hmde/routes/BusinessObject/Detail/CompTemplate/assets/tableicon.png';

// import mobileEmpty from '@hmde/routes/BusinessObject/Detail/CompTemplate/assets/mobileEmpty.png';
// import mobileForm from '@hmde/routes/BusinessObject/Detail/CompTemplate/assets/mobileForm.png';
// import mobileTable from '@hmde/routes/BusinessObject/Detail/CompTemplate/assets/mobileTable.png';

import mobileIcon from "hzero-front-hmde/lib/routes/BusinessObject/Detail/CompTemplate/assets/icon/mobile_icon.svg";
import pcIcon from "hzero-front-hmde/lib/routes/BusinessObject/Detail/CompTemplate/assets/icon/pc_icon.svg";
import { TemplateType, platformType } from "../../commonCode";
const iconObj = {
  [TemplateType.EMPTY]: emptyPcMobile,
  [TemplateType.FORM]: formPcMobile,
  [TemplateType.TABLE]: tablePcMobile
};

// const mobileIconObj = {
//   [TemplateType.EMPTY]: mobileEmpty,
//   [TemplateType.FORM]: mobileForm,
//   [TemplateType.TABLE]: mobileTable,
// };

export default function SelectItem(props) {
  const item = props.item,
    isAct = props.isAct,
    selectTpl = props.selectTpl;
  return /*#__PURE__*/React.createElement(_Tooltip, {
    placement: "top",
    title: item.tip
  }, /*#__PURE__*/React.createElement("div", {
    className: classnames({
      select_item: true,
      act: isAct
    }),
    onClick: () => selectTpl(item.value)
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "con"
  }, /*#__PURE__*/React.createElement("img", {
    src: iconObj[item.value],
    alt: ""
  })), /*#__PURE__*/React.createElement("div", {
    className: "bttitle"
  }, item.name)), /*#__PURE__*/React.createElement("div", {
    className: "righttop"
  }, item.type.includes(platformType.MOBILE) && /*#__PURE__*/React.createElement("img", {
    className: "imgicon",
    src: mobileIcon,
    alt: "icon"
  }), item.type.includes(platformType.PC) && /*#__PURE__*/React.createElement("img", {
    className: "imgicon",
    src: pcIcon,
    alt: "icon"
  }))));
}