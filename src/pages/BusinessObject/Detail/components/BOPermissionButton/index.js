import _Button from "@hzero-front-ui/c7n-ui/lib/ButtonPro";
import React from 'react';
import { observer } from 'mobx-react-lite';
import { useBoStore } from "hzero-front-hmde/lib/routes/BusinessObject/Detail/stores";
const BOPermissionButton = ({
  children,
  componentType = 'button',
  disabled,
  hidden,
  ...rest
}) => {
  var _boStore$getState;
  const boStore = useBoStore();
  const hasPermission = (_boStore$getState = boStore === null || boStore === void 0 ? void 0 : boStore.getState('hasPermission')) !== null && _boStore$getState !== void 0 ? _boStore$getState : true;
  if (hidden) {
    return null;
  }
  const Component = componentType === 'a' ? 'a' : _Button;
  return /*#__PURE__*/React.createElement(Component,
  // @ts-ignore
  {
    disabled: disabled || !hasPermission,
    ...rest
  }, children);
};
export default observer(BOPermissionButton);