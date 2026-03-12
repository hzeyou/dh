import { isString } from 'lodash';
import moment, { Moment } from 'moment';

import request from 'utils/request';
import notification from 'utils/notification';

/*
 * @description: 函数式编程工具
 */
export const compose = (...fns) => (...args) => {
  const [...tmpFns] = fns;
  const composed = (...restArgs) => {
    if (tmpFns.length === 0) {
      return restArgs[0];
    }
    return composed(tmpFns.pop()(...restArgs));
  };
  return composed(...args);
};
//
// /**
//  * @description request下载文件
//  */
// export interface DownloadFileParams {
//   requestUrl: string;
//   method?: 'GET' | 'POST';
//   queryParams?: object;
//   queryData?: any;
//   downloadFileNotification?: boolean;
// }
// export const downloadFileByRequest = async (params: DownloadFileParams, fileName: string) => {
//   const { requestUrl, method = 'GET', queryParams = {}, queryData = {}, downloadFileNotification = true } = params;
//   try {
//     const res = await request(requestUrl, {
//       method,
//       responseType: 'blob',
//       query: queryParams,
//       ...(method === 'GET' ? {} : { data: queryData }),
//     });
//
//     if (typeof (window.navigator as any)?.msSaveBlob !== 'undefined') {
//       // 兼容IE，window.navigator.msSaveBlob：以本地方式保存文件
//       // eslint-disable-next-line no-unused-expressions
//       (window.navigator as any)?.msSaveBlob(res, decodeURI(fileName));
//     } else {
//       // 创建新的URL并指向File对象或者Blob对象的地址
//       const blobURL = window.URL.createObjectURL(res);
//       // 创建a标签，用于跳转至下载链接
//       const tempLink = document.createElement('a');
//       tempLink.style.display = 'none';
//       tempLink.href = blobURL;
//       tempLink.setAttribute('download', decodeURI(fileName));
//       // 兼容：某些浏览器不支持HTML5的download属性
//       if (typeof tempLink.download === 'undefined') {
//         tempLink.setAttribute('target', '_blank');
//       }
//       // 挂载a标签
//       document.body.appendChild(tempLink);
//       tempLink.click();
//       document.body.removeChild(tempLink);
//       // 释放blob URL地址
//       window.URL.revokeObjectURL(blobURL);
//       if (downloadFileNotification) {
//         setTimeout(() => {
//           notification.success({ description: '' });
//         }, 1000);
//       }
//     }
//   } catch (error) {
//     notification.error({ description: '' });
//   }
// };
//
// /**
//  * @description 根据值列表value获取对应的meaning
//  */
// export const getLookupMeanByValue = (lookupValues: Array<{ value: string; meaning: string }> = [], code: string) => {
//   const target = lookupValues.find(item => item.value === code);
//   return target ? target.meaning : code;
// }
//
// /**
//  * @description 处理时间为当天00:00:00
//  */
// export const handleDayTimeStart = (time: string | Moment) => {
//   // moment 格式直接处理
//   if (moment.isMoment(time)) {
//     return time.startOf('day').format('YYYY-MM-DD HH:mm:ss');
//   }
//
//   // 非字符串直接返回
//   if (!isString(time) || !time) return time;
//
//   // 字符串转时间失败直接返回
//   if (!moment(time).isValid()) {
//     return time;
//   }
//
//   // 字符串转时间成功处理后返回
//   return moment(time).startOf('day').format('YYYY-MM-DD HH:mm:ss');
// };
//
// /**
//  * @description 处理时间为当天00:00:00
//  */
// export const handleDayTimeEnd = (time: string | Moment) => {
//   // moment 格式直接处理
//   if (moment.isMoment(time)) {
//     return time.endOf('day').format('YYYY-MM-DD HH:mm:ss');
//   }
//
//   // 非字符串直接返回
//   if (!isString(time) || !time) return time;
//
//   // 字符串转时间失败直接返回
//   if (!moment(time).isValid()) {
//     return time;
//   }
//
//   // 字符串转时间成功处理后返回
//   return moment(time).endOf('day').format('YYYY-MM-DD HH:mm:ss');
// };
