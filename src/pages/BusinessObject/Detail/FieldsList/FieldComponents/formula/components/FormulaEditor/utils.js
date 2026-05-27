import { monaco } from "hzero-front-apaas/lib/components/MonacoEditor";
import { regExpTranscoding } from "hzero-front-hmde/lib/utils/string";
export const registryAutoSelectBlocks = (editor, blocks) => {
  const regExp = new RegExp(`(${blocks.map(regExpTranscoding).join('|')})`, 'g');
  const onEvent = event => {
    const val = editor.getValue();
    const matchs = (val.match(regExp) || []).filter(Boolean);
    const matchIndex = {};
    const lines = val.split('\n');
    const blockDatas = []; // 注意，这里的块的区域，'#field_标题#'，没算上引号的，但是选中要带上引号，
    lines.forEach((line, lineIndex) => {
      matchs.forEach(block => {
        let startIndex;
        if (matchIndex[block]) {
          startIndex = matchIndex[block];
        }
        const indexBlock = line.indexOf(block, startIndex);
        matchIndex[block] = indexBlock + block.length - 1;
        if (indexBlock > -1) {
          const lineNumber = lineIndex + 1;
          const startColumn = indexBlock + 2;
          blockDatas.push({
            endColumn: startColumn + block.length - 1,
            endLineNumber: lineNumber,
            startColumn,
            startLineNumber: lineNumber
          });
        }
      });
    });
    blockDatas.forEach(bData => {
      const rData = [bData === null || bData === void 0 ? void 0 : bData.startLineNumber, bData === null || bData === void 0 ? void 0 : bData.startColumn, bData === null || bData === void 0 ? void 0 : bData.endLineNumber, bData === null || bData === void 0 ? void 0 : bData.endColumn];
      // 块的区域，'#field_标题#'，没算上引号的，但是选中要带上引号，所以startColumn - 1 且 data.endColumn + 1
      const selectData = [bData === null || bData === void 0 ? void 0 : bData.startLineNumber, (bData === null || bData === void 0 ? void 0 : bData.startColumn) - 1, bData === null || bData === void 0 ? void 0 : bData.endLineNumber, bData === null || bData === void 0 ? void 0 : bData.endColumn];
      // @ts-ignore
      const range = new monaco.Range(...rData);
      // @ts-ignore
      const selection = new monaco.Selection(...selectData);
      const currentPosition = editor.getPosition();
      if (currentPosition &&
      // 有光标
      range.containsPosition(currentPosition) // 光标在world里面
      ) {
        const cS = editor.getSelection();
        const selectEqual = (cS === null || cS === void 0 ? void 0 : cS.endColumn) === selection.endColumn;
        if (selectEqual &&
        // 当前选中的就是应该要选中的末尾
        currentPosition.column === selection.endColumn &&
        // 光标在最右边
        (event === null || event === void 0 ? void 0 : event.keyCode) === monaco.KeyCode.RightArrow // 按了右方向键
        ) {
          const selectMoveRightOneCol = [...selectData];
          selectMoveRightOneCol[3] += 1; // 光标右移
          // eslint-disable-next-line prefer-destructuring
          selectMoveRightOneCol[1] = selectMoveRightOneCol[3]; // 没有选区（start === end
          // @ts-ignore
          editor.setSelections([new monaco.Selection(...selectMoveRightOneCol)]);
          // 为了保证代码的美观性，只有表达式位于最后才需要添加空的插入
          const transferStr = val.replace(/\s*CASCADE/, '').replace(/\s/g, '*');
          if (transferStr.length === currentPosition.column || (transferStr === null || transferStr === void 0 ? void 0 : transferStr.length) + 1 === currentPosition.column) {
            // 保证代码块下一次能触发选中
            editor.focus();
          }
        } else {
          editor.setSelections([selection]); // 选中块
        }
      }
    });
    event.preventDefault();
    event.stopPropagation();
  };
  const mouseUpDisposable = editor.onMouseUp(({
    event
  }) => {
    onEvent(event);
  });
  const keyUpDisposable = editor.onKeyUp(keyBoardEvent => {
    if (keyBoardEvent.keyCode === monaco.KeyCode.UpArrow || keyBoardEvent.keyCode === monaco.KeyCode.DownArrow || keyBoardEvent.keyCode === monaco.KeyCode.LeftArrow || keyBoardEvent.keyCode === monaco.KeyCode.RightArrow || keyBoardEvent.keyCode === monaco.KeyCode.Backspace) {
      onEvent(keyBoardEvent);
    }
  });
  return {
    dispose() {
      mouseUpDisposable.dispose();
      keyUpDisposable.dispose();
    }
  };
};

// 设置主题
export const registryEditorTheme = themeName => {
  monaco.editor.defineTheme(themeName, {
    base: 'vs',
    inherit: true,
    rules: [{
      token: 'block',
      foreground: '2b7de6',
      fontStyle: 'bold',
      background: 'EDF9FA'
    }],
    colors: {
      // 相关颜色属性配置
      'editor.background': '#ffffff',
      // 背景色
      'block.background': 'blue',
      'block.foreground': 'blue'
      //  'editor.selectionBackground': 'red',
      //  'editor.inactiveSelectionBackground': 'red',
    }
  });
  monaco.editor.setTheme(themeName);
};

// export const registryMonarchTokensProvider = (languageId: string, blocks: string[]) => {
//   const regExp = new RegExp(`(${blocks.map(regExpTranscoding).join('|')})`);
//   return monaco.languages.setMonarchTokensProvider(languageId, {
//     tokenizer: {
//       root: [[regExp, 'block']],
//     },
//   });
// };

export const registryMonarchTokensProvider = (languageId, blocks) => {
  const blockFilter = blocks.filter(v => !v.includes('@'));
  const regExpList = [];
  blocks.filter(v => v.includes('@')).forEach(v => {
    const handleV = regExpTranscoding(v);
    const arr = handleV.split('@');
    regExpList.push([new RegExp(`${arr[0]}.*${arr[arr.length - 1]}`), 'block']);
  });
  const regExp = new RegExp(`(${blockFilter.map(regExpTranscoding).join('|')})`);
  const rootList = [];
  if (blockFilter.length) {
    rootList.push([regExp, 'block']);
  }
  if (regExpList !== null && regExpList !== void 0 && regExpList.length) {
    rootList.push(...regExpList);
  }
  return monaco.languages.setMonarchTokensProvider(languageId, {
    tokenizer: {
      root: rootList
    }
  });
};

/**
 * 将公式上的cascade字段替换成它的别名
 * @param formula
 * @param analyzeResultList
 * @returns
 */
export const NewCodeTransfer = (formula, analyzeResultList, value, meaning) => {
  let newFormula = formula.replace(/ /g, '');
  analyzeResultList.sort((a, b) => {
    var _b$value, _a$value;
    return (b === null || b === void 0 ? void 0 : (_b$value = b[value]) === null || _b$value === void 0 ? void 0 : _b$value.length) - (a === null || a === void 0 ? void 0 : (_a$value = a[value]) === null || _a$value === void 0 ? void 0 : _a$value.length);
  }).forEach(item => {
    var _item$value;
    const reg = new RegExp(regExpTranscoding((_item$value = item[value]) === null || _item$value === void 0 ? void 0 : _item$value.replace(/ /g, '')), 'g');
    newFormula = newFormula.replace(reg, `  ${item[meaning]}  `);
  });
  return newFormula;
};