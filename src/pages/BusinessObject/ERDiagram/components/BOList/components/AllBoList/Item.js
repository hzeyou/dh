import _CheckBox from "@hzero-front-ui/c7n-ui/lib/CheckBoxPro";
import React from 'react';
import { observer } from 'mobx-react-lite';
import { BoFN } from "../../../../datasets/boDS";
import styles from "./index.less?modules";
const Item = ({
  record,
  boDs
}) => {
  const handleChange = () => {
    if (record.isSelected) {
      boDs.unSelect(record);
    } else {
      boDs.select(record);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: styles.item
  }, /*#__PURE__*/React.createElement(_CheckBox, {
    checked: record.isSelected,
    value: record.get(BoFN.ID),
    onChange: handleChange
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.name
  }, record.get(BoFN.NAME), " (", record.get(BoFN.CODE), ")")));
};
export default observer(Item);