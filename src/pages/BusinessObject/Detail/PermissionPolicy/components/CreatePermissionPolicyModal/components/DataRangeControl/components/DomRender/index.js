import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _isEqual from "lodash/isEqual";
import _fromPairs from "lodash/fromPairs";
const _excluded = ["children"];
import { useCallback, useEffect, useState, Children, useRef, cloneElement } from 'react';
// 允许渲染出真实dom后再计算参数，只接受一个dom元素作为子元素，dom元素的标签需要用泛型标注
function DomRender(props) {
  const children = props.children,
    otherProps = _objectWithoutProperties(props, _excluded);
  const _useState = useState({}),
    _useState2 = _slicedToArray(_useState, 2),
    dynamicProps = _useState2[0],
    setDynamicProps = _useState2[1];
  const child = Children.only(children);
  const ref = useRef();
  const handleRef = useCallback(dom => {
    ref.current = dom;
    if (!child) {
      return;
    }
    if (typeof child.ref === 'function') {
      child.ref(dom);
    } else if (child.ref && typeof child.ref === 'object') {
      child.ref.current = dom;
    }
  }, [child === null || child === void 0 ? void 0 : child.ref]);
  const newChild = /*#__PURE__*/cloneElement(child, {
    ref: handleRef,
    ...dynamicProps
  });
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const entries = Object.keys(otherProps).map(key => {
        var _otherProps$key;
        return [key, (_otherProps$key = otherProps[key]) === null || _otherProps$key === void 0 ? void 0 : _otherProps$key.call(otherProps, ref.current)];
      });
      const newDynamicProps = _fromPairs(entries);
      setDynamicProps(pre => _isEqual(newDynamicProps, pre) ? pre : newDynamicProps);
    });
    if (!ref.current) {
      return;
    }
    observer.observe(ref.current, {
      attributes: true,
      characterData: true,
      subtree: true,
      childList: true
    });
    return () => observer.disconnect();
  }, [ref.current]);
  return newChild;
}
export default DomRender;