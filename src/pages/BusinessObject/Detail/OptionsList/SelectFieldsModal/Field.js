import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { useState } from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import { useDrop, useDrag } from 'react-dnd';
import styles from "./index.less?modules";
export default observer(({
  dndType,
  onDrop = () => {},
  data,
  children,
  style = {}
}) => {
  const _useState = useState(null),
    _useState2 = _slicedToArray(_useState, 2),
    hoverItem = _useState2[0],
    setHoverItem = _useState2[1];
  const _useDrop = useDrop({
      accept: dndType,
      collect: monitor => ({
        isOver: monitor.isOver(),
        // 是否有元素进入该区域
        canDrop: monitor.canDrop() // 是否有元素进行拖动
      }),
      drop: () => ({
        callback: dragData => {
          onDrop(dragData, data, 'left');
        }
      })
    }),
    _useDrop2 = _slicedToArray(_useDrop, 2),
    _useDrop2$ = _useDrop2[0],
    canLeftDrop = _useDrop2$.canDrop,
    isLeftOver = _useDrop2$.isOver,
    sortLeftDrop = _useDrop2[1];
  const _useDrop3 = useDrop({
      accept: dndType,
      collect: monitor => ({
        isOver: monitor.isOver(),
        // 是否有元素进入该区域
        canDrop: monitor.canDrop() // 是否有元素进行拖动
      }),
      drop: () => ({
        callback: dragData => {
          onDrop(dragData, data, 'right');
        }
      })
    }),
    _useDrop4 = _slicedToArray(_useDrop3, 2),
    _useDrop4$ = _useDrop4[0],
    canRightDrop = _useDrop4$.canDrop,
    isRightOver = _useDrop4$.isOver,
    sortRightDrop = _useDrop4[1];
  const _useDrag = useDrag({
      item: {
        type: dndType,
        data
      },
      collect: monitor => ({
        isDragging: monitor.isDragging()
      }),
      begin: () => {
        setHoverItem(data);
      },
      end(item, monitor) {
        setHoverItem(null);
        const dropResult = monitor.getDropResult();
        if (item && dropResult) {
          dropResult.callback(data);
        }
      }
    }),
    _useDrag2 = _slicedToArray(_useDrag, 2),
    isDragging = _useDrag2[0].isDragging,
    drag = _useDrag2[1];
  const isLeftActive = canLeftDrop && isLeftOver;
  const isRightActive = canRightDrop && isRightOver;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      opacity: isDragging ? 0.4 : 1,
      position: 'relative',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: classnames({
      [styles.canDropLine]: true,
      [styles.canDropActive]: isLeftActive
    })
  }), /*#__PURE__*/React.createElement("span", {
    ref: sortLeftDrop,
    className: styles.canLeftDrop,
    style: {
      zIndex: canLeftDrop && !hoverItem ? 1 : -1
    }
  }), /*#__PURE__*/React.createElement("div", {
    ref: drag,
    style: {
      display: 'flex',
      alignItems: 'center'
    },
    onDragEnter: e => {
      e.stopPropagation();
      e.preventDefault();
    },
    onDragOver: e => {
      e.stopPropagation();
      e.preventDefault();
    },
    onDragLeave: e => {
      e.stopPropagation();
      e.preventDefault();
    }
  }, children), /*#__PURE__*/React.createElement("span", {
    ref: sortRightDrop,
    className: styles.canRightDrop,
    style: {
      zIndex: canRightDrop && !hoverItem ? 1 : -1
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: classnames({
      [styles.canDropLine]: true,
      [styles.canDropActive]: isRightActive
    })
  }));
});