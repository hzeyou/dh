import _Row from "choerodon-ui/pro/lib/row";
import _Col from "choerodon-ui/pro/lib/col";
import React from 'react';
import intl from 'utils/intl';
import ImgIcon from "hzero-front-hmde/lib/utils/ImgIcon";
// import { handleCopy } from '@hmde/utils/common';

// import { openTab } from 'utils/menuTab';
// import pageIcon from '@hmde/assets/page.svg';
import styles from "./index.less?modules";
export default function PublishedModalContent({
  routerList
}) {
  // const copyInfo = (e, text: string, successMessage?: any) => {
  //   e.stopPropagation();
  //   e.preventDefault();
  //   handleCopy(text, successMessage);
  // };

  // const renderPublishLink = () => {
  //   const empty = (
  //     <div className={styles.empty}>
  //       <ImgIcon name="no-page.png" size={140} />
  //       <p>{intl.get('hmde.bo.page.publishNone').d('暂无已发布的交互视图')}</p>
  //     </div>
  //   );

  //   return Array.isArray(routerList) && routerList.length
  //     ? routerList.map((o) => {
  //         const { pageName, pageCode, route = '' } = o;
  //         const basePath = `${process.env.BASE_PATH}`;
  //         const path = basePath.endsWith('/') && route.startsWith('/') ? route.slice(1) : route; // 解决路径拼接出现双划线问题/
  //         const showRouterUrl = `${window.location.protocol}//${window.location.host}${basePath}${path}`;
  //         return (
  //           <Row key={pageCode + route} className={styles['link-list-item']} gutter={24}>
  //             <Col span={6}>{pageName}</Col>
  //             <Col span={18}>
  //               <a
  //                 href="javascript: void(0)" // eslint-disable-line
  //                 onClick={(e) => copyInfo(e, showRouterUrl)}
  //               >
  //                 {showRouterUrl}
  //               </a>
  //             </Col>
  //           </Row>
  //         );
  //       })
  //     : empty;
  // };

  const renderPublishLink = () => {
    var _Array, _ref;
    const empty = /*#__PURE__*/React.createElement("div", {
      className: styles.empty
    }, /*#__PURE__*/React.createElement(ImgIcon, {
      name: "no-page.png",
      size: 140
    }), /*#__PURE__*/React.createElement("p", null, intl.get('hmde.bo.page.publishNone').d('暂无已发布的交互视图')));
    const rowArr = (_Array = new Array(Math.ceil(((_ref = routerList || []) === null || _ref === void 0 ? void 0 : _ref.length) / 2))) === null || _Array === void 0 ? void 0 : _Array.fill(1);
    return Array.isArray(rowArr) && rowArr.length ? rowArr.map((o, ind) => {
      var _routerList, _routerList2;
      const col1 = (_routerList = routerList[ind * 2]) === null || _routerList === void 0 ? void 0 : _routerList.pageName;
      const col2 = (_routerList2 = routerList[ind * 2 + 1]) === null || _routerList2 === void 0 ? void 0 : _routerList2.pageName;
      return /*#__PURE__*/React.createElement(_Row, {
        className: styles['link-list-item'],
        style: {
          backgroundColor: ind % 2 !== 0 ? '#FAFBFF' : '#ffffff'
        },
        gutter: 24
      }, col1 && /*#__PURE__*/React.createElement(_Col, {
        span: 12
      }, /*#__PURE__*/React.createElement(ImgIcon, {
        name: "page.svg"
      }), col1), col2 && /*#__PURE__*/React.createElement(_Col, {
        span: 12
      }, /*#__PURE__*/React.createElement(ImgIcon, {
        name: "page.svg"
      }), col2));
    }) : empty;
  };

  // const goToMenuConfig = () => {
  //   openTab({
  //     title: intl.get('hmde.bo.page.publisTitle').d('菜单配置'),
  //     key: '/hiam/menu',
  //     path: '/hiam/menu',
  //     icon: 'edit',
  //     closable: true,
  //   });
  // };

  return /*#__PURE__*/React.createElement("div", {
    className: styles['published-modal-content']
  }, /*#__PURE__*/React.createElement("h4", null, intl.get('hmde.bo.page.hasPublishText').d('已发布的交互视图')), /*#__PURE__*/React.createElement("div", {
    className: styles['publish-link-list']
  }, renderPublishLink()));
}