const getColumnsIndexObj = columns => {
  const indexObj = {};
  columns.forEach((col, index) => {
    if (col.name) {
      indexObj[col.name] = index;
    }
  });
  return indexObj;
};
export const onKeyDown = (e, {
  colNum,
  formRef,
  handleAdd,
  record,
  tableDs,
  columns,
  name
}) => {
  const keyCode = e.keyCode || e.which || e.charCode; // 兼容不同浏览器
  if (keyCode !== 86) {
    e.stopPropagation();
    const colNumber = colNum; // 列数
    const rowNumber = getColumnsIndexObj === null || getColumnsIndexObj === void 0 ? void 0 : getColumnsIndexObj(columns)[name]; // 当前第几列
    const cNumber = tableDs.findIndex(_record => record.id === _record.id); // 当前第几行
    const idx = rowNumber + cNumber * colNumber;
    const checkItems = formRef.current.querySelectorAll('.checkItemPar');
    const focus = focusNumber => {
      setTimeout(() => {
        var _checkItems$focusNumb, _checkItems$focusNumb2, _checkItems$focusNumb3, _checkItems$focusNumb4, _checkItems$focusNumb5, _checkItems$focusNumb6;
        (_checkItems$focusNumb = checkItems[focusNumber]) === null || _checkItems$focusNumb === void 0 ? void 0 : (_checkItems$focusNumb2 = _checkItems$focusNumb.childNodes[0]) === null || _checkItems$focusNumb2 === void 0 ? void 0 : (_checkItems$focusNumb3 = _checkItems$focusNumb2.focus) === null || _checkItems$focusNumb3 === void 0 ? void 0 : _checkItems$focusNumb3.call(_checkItems$focusNumb2); // 设置焦点
        (_checkItems$focusNumb4 = checkItems[focusNumber]) === null || _checkItems$focusNumb4 === void 0 ? void 0 : (_checkItems$focusNumb5 = _checkItems$focusNumb4.childNodes[0]) === null || _checkItems$focusNumb5 === void 0 ? void 0 : (_checkItems$focusNumb6 = _checkItems$focusNumb5.select) === null || _checkItems$focusNumb6 === void 0 ? void 0 : _checkItems$focusNumb6.call(_checkItems$focusNumb5); // 选中文字
      }, 0);
    };

    // 按下 shift + tab 组合键,返回上一单元格(换行)
    if (keyCode === 9 && e.shiftKey) {
      e.preventDefault();
      const minLeftNumber = 0;
      const nextNumber = idx - 1;
      if (nextNumber >= minLeftNumber) {
        focus(nextNumber);
      }
    }
    if (keyCode === 13 || keyCode === 9) {
      var _checkItems$idx, _checkItems$idx$query;
      e.preventDefault();
      // 判断所按是否回车键
      if (checkItems !== null && checkItems !== void 0 && (_checkItems$idx = checkItems[idx]) !== null && _checkItems$idx !== void 0 && (_checkItems$idx$query = _checkItems$idx.querySelector) !== null && _checkItems$idx$query !== void 0 && _checkItems$idx$query.call(_checkItems$idx, '.c7n-pro-select-expand')) {
        return;
      }
      if (keyCode === 9 && checkItems.length - 1 === idx || keyCode === 13 && checkItems.length - idx <= colNumber) {
        handleAdd();
        setTimeout(() => {
          var _inputs, _inputs2, _inputs2$childNodes$, _inputs2$childNodes$$;
          const formDom = formRef.current; // 获取表单中的所有输入框
          const inputs = formDom.querySelectorAll('.checkItemPar');
          (_inputs = inputs[inputs.length - colNumber]) === null || _inputs === void 0 ? void 0 : _inputs.childNodes[0].focus(); // 设置焦点
          (_inputs2 = inputs[inputs.length - colNumber]) === null || _inputs2 === void 0 ? void 0 : (_inputs2$childNodes$ = _inputs2.childNodes[0]) === null || _inputs2$childNodes$ === void 0 ? void 0 : (_inputs2$childNodes$$ = _inputs2$childNodes$.select) === null || _inputs2$childNodes$$ === void 0 ? void 0 : _inputs2$childNodes$$.call(_inputs2$childNodes$); // 选中文字
        });
      } else if (e.which === 13) {
        focus(idx + colNumber);
      } else {
        focus(idx + 1);
      }
    }
    return false;
  }
};