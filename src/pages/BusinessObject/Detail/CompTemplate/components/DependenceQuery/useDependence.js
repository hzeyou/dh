import _useModal from "choerodon-ui/pro/lib/use-modal";
import React, { useCallback } from 'react';
// import { DataSetProps } from 'choerodon-ui/pro/lib/data-set/DataSet';
import DependenceQuery from "./DependenceQuery";
export const useDependenceQuery = () => {
  const Modal = _useModal();
  const handleOpenDependence = useCallback(({
    pageCode
  }) => {
    // 默认值
    Modal.open({
      title: '依赖查询',
      style: {
        width: 957
      },
      closable: true,
      destroyOnClose: true,
      children: /*#__PURE__*/React.createElement(DependenceQuery, {
        pageCode: pageCode
      }),
      autoCenter: true,
      okButton: false,
      cancelText: '关闭'
    });
  }, []);
  return {
    handleOpenDependence
  };
};