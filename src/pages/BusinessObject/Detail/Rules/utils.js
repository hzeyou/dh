import _pick from "lodash/pick";
import _omit from "lodash/omit";
import _forOwn from "lodash/forOwn";
import { getCurrentLanguage } from 'utils/utils';
import { BlockReg } from "hzero-front-apaas/lib/constants/businessObject";
import { FN } from "./datasets/languageTemplateDS";
export const dataMapTransfer = (initValue, mapList, from, to) => {
  var _temp, _temp2;
  let temp = initValue;
  // const reg = new RegExp('#(.*?)#', 'g');
  const matchList = (((_temp = temp) === null || _temp === void 0 ? void 0 : _temp.match(/(CASCADE|CURRENT)\(.*?\)/g)) || []).concat(((_temp2 = temp) === null || _temp2 === void 0 ? void 0 : _temp2.match(BlockReg)) || []);
  // eslint-disable-next-line no-unused-expressions
  matchList === null || matchList === void 0 ? void 0 : matchList.forEach(item => {
    var _temp3;
    const matchItem = mapList.find(i => (i === null || i === void 0 ? void 0 : i[from]) === item);
    temp = (_temp3 = temp) === null || _temp3 === void 0 ? void 0 : _temp3.replace(item, matchItem === null || matchItem === void 0 ? void 0 : matchItem[to]);
  });
  return temp;
};
export const formula2Desc = (formula, mappingList) => {
  let temp = formula;
  // eslint-disable-next-line no-unused-expressions
  mappingList.forEach(i => {
    var _temp4;
    temp = (_temp4 = temp) === null || _temp4 === void 0 ? void 0 : _temp4.replace(i.value, i.meaning);
  });
  return temp;
};

/**
 * 构建多语言模板数据
 */
export const buildLanguageTemplate = (data, codeBefore = '') => {
  // 删除以 _ 开头的数据
  let _data = _omit(data, Object.keys(data).filter(key => key.startsWith('_')));
  // 补充前缀
  _data[FN.ERROR_INFO] = `${codeBefore}${_data[FN.ERROR_INFO]}`;
  _data[FN.RESPONSE_MESSAGES] = [];
  _forOwn(_data, (value, key) => {
    if (![FN.ERROR_INFO, FN.TYPE, FN.RESPONSE_MESSAGES].includes(key)) {
      _data[FN.RESPONSE_MESSAGES].push({
        lang: key,
        description: value
      });
    }
  });
  _data = _pick(_data, [FN.ERROR_INFO, FN.TYPE, FN.RESPONSE_MESSAGES]);
  return _data;
};
export const intlMontage = (...arr) => {
  const _tls = {};
  const multiStr = JSON.parse(sessionStorage.getItem('multiLanguageStr') !== 'undefined' ? sessionStorage.getItem('multiLanguageStr') : '[]');
  multiStr === null || multiStr === void 0 ? void 0 : multiStr.forEach(v => {
    var _arr$forEach;
    let str = '';
    arr === null || arr === void 0 ? void 0 : (_arr$forEach = arr.forEach) === null || _arr$forEach === void 0 ? void 0 : _arr$forEach.call(arr, item => {
      if (Array.isArray(item)) {
        var _item$forEach;
        item === null || item === void 0 ? void 0 : (_item$forEach = item.forEach) === null || _item$forEach === void 0 ? void 0 : _item$forEach.call(item, (_item, index) => {
          str += `${index === 0 ? ' ' : ''}${(_item === null || _item === void 0 ? void 0 : _item[v.code]) || (_item === null || _item === void 0 ? void 0 : _item[getCurrentLanguage()]) || ''}${index < item.length - 1 ? '、' : ' '}`;
        });
      } else {
        str += (item === null || item === void 0 ? void 0 : item[v.code]) || (item === null || item === void 0 ? void 0 : item[getCurrentLanguage()]) || '';
      }
    });
    _tls[v.code] = str || '';
  });
  return _tls;
};