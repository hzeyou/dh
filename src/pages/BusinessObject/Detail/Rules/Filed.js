import _Icon from "choerodon-ui/lib/icon";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import ImgIcon from "hzero-front-hmde/lib/utils/ImgIcon";
import styles from "./index.less?modules";
const ItemTypes = {
  CARD: 'card'
};
export default (({
  id,
  text,
  index,
  moveCard,
  handleDelete,
  tenantReadOnly,
  physicalModelType
}) => {
  const ref = useRef(null);
  const _useDrop = useDrop({
      accept: ItemTypes.CARD,
      collect(monitor) {
        return {
          handlerId: monitor.getHandlerId()
        };
      },
      hover(item, monitor) {
        var _ref$current;
        if (!ref.current) {
          return;
        }
        const dragIndex = item.index;
        const hoverIndex = index;

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
          return;
        }

        // Determine rectangle on screen
        const hoverBoundingRect = (_ref$current = ref.current) === null || _ref$current === void 0 ? void 0 : _ref$current.getBoundingClientRect();

        // Get vertical middle
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

        // Determine mouse position
        const clientOffset = monitor.getClientOffset();

        // Get pixels to the top
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        // Only perform the move when the mouse has crossed half of the items height
        // When dragging downwards, only move when the cursor is below 50%
        // When dragging upwards, only move when the cursor is above 50%

        // Dragging downwards
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
          return;
        }

        // Dragging upwards
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
          return;
        }

        // Time to actually perform the action
        moveCard(dragIndex, hoverIndex);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        // eslint-disable-next-line no-param-reassign
        item.index = hoverIndex;
      }
    }),
    _useDrop2 = _slicedToArray(_useDrop, 2),
    handlerId = _useDrop2[0].handlerId,
    drop = _useDrop2[1];
  const _useDrag = useDrag({
      item: {
        id,
        index,
        type: ItemTypes.CARD
      },
      collect: monitor => ({
        isDragging: monitor.isDragging()
      })
    }),
    _useDrag2 = _slicedToArray(_useDrag, 2),
    isDragging = _useDrag2[0].isDragging,
    drag = _useDrag2[1];
  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));
  return /*#__PURE__*/React.createElement("div", {
    ref: !tenantReadOnly ? ref : undefined,
    className: styles['field-contain'],
    style: {
      opacity
    },
    "data-handler-id": handlerId
  }, /*#__PURE__*/React.createElement("div", {
    className: styles['field-item']
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(_Icon, {
    type: "view_headline"
  }), /*#__PURE__*/React.createElement("span", null, +index + 1), /*#__PURE__*/React.createElement("span", null, text)), (id !== 'tenantId' || physicalModelType === 'API') && /*#__PURE__*/React.createElement(ImgIcon, {
    name: "blue-button-delet@1x.svg",
    size: 16,
    style: {
      cursor: 'pointer'
    },
    onClick: () => handleDelete(id),
    hidden: tenantReadOnly
  })));
});