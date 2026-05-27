import React from 'react';
import emptyMobile from "hzero-front-hmde/lib/routes/BusinessObject/Detail/CompTemplate/assets/tplimg/empty_mobile.png";
import emptyPcMobile from "hzero-front-hmde/lib/routes/BusinessObject/Detail/CompTemplate/assets/tplimg/empty_pc_mobile.png";
import emptyPc from "hzero-front-hmde/lib/routes/BusinessObject/Detail/CompTemplate/assets/tplimg/empty_pc.png";
import formMobile from "hzero-front-hmde/lib/routes/BusinessObject/Detail/CompTemplate/assets/tplimg/form_mobile.png";
import formPcMobile from "hzero-front-hmde/lib/routes/BusinessObject/Detail/CompTemplate/assets/tplimg/form_pc_mobile.png";
import formPc from "hzero-front-hmde/lib/routes/BusinessObject/Detail/CompTemplate/assets/tplimg/form_pc.png";
import tableMobile from "hzero-front-hmde/lib/routes/BusinessObject/Detail/CompTemplate/assets/tplimg/table_mobile.png";
import tablePcMobile from "hzero-front-hmde/lib/routes/BusinessObject/Detail/CompTemplate/assets/tplimg/table_pc_mobile.png";
import tablePc from "hzero-front-hmde/lib/routes/BusinessObject/Detail/CompTemplate/assets/tplimg/table_pc.png";
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
const imgobj = {
  empty_mobile: emptyMobile,
  empty_pc_mobile: emptyPcMobile,
  empty_pc: emptyPc,
  form_mobile: formMobile,
  form_pc_mobile: formPcMobile,
  form_pc: formPc,
  table_mobile: tableMobile,
  table_pc_mobile: tablePcMobile,
  table_pc: tablePc
};
function getTplImgStr(ActTplObj, selectTplTypes) {
  const typestr = ActTplObj.value.toLocaleLowerCase();
  const selectStr = selectTplTypes.sort().reverse().join('_').toLocaleLowerCase();
  const str = `${typestr}_${selectStr}`;
  return str;
}
export default observer(props => {
  const ActTplObj = props.ActTplObj,
    selectTplTypes = props.selectTplTypes;
  const iconStr = getTplImgStr(ActTplObj, selectTplTypes);
  const parr = iconStr.split('_');
  const isOnlyMobile = parr.includes('mobile') && !parr.includes('pc');
  return /*#__PURE__*/React.createElement("div", {
    className: "examplecon"
  }, /*#__PURE__*/React.createElement("div", {
    className: "examplecon_h"
  }, /*#__PURE__*/React.createElement("span", {
    className: "t1"
  }, "\u793A\u4F8B"), /*#__PURE__*/React.createElement("span", {
    className: "t2"
  }, ActTplObj.name)), /*#__PURE__*/React.createElement("div", {
    className: "examplecon_img"
  }, selectTplTypes.length ? /*#__PURE__*/React.createElement("img", {
    className: classnames('imgshow', {
      ismobile: isOnlyMobile
    }),
    src: imgobj[iconStr],
    alt: "\u793A\u4F8B\u56FE"
  }) : null));
});