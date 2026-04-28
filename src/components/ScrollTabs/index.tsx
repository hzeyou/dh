import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Tabs } from 'choerodon-ui/pro';
import styles from './index.less';

/* ==================== ScrollTab ==================== */

export interface ScrollTabProps {
  /** 唯一标识，同时作为滚动锚点 id */
  tab: string;
  /** Tab 显示文本，不传则使用 tab */
  label?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ScrollTab - 滚动区域面板，配合 ScrollTabs 使用
 */
function ScrollTab(props: ScrollTabProps) {
  const { tab, label, children, className, style } = props;
  const cls = className
    ? `${styles['scroll-tab']} ${className}`
    : styles['scroll-tab'];
  return (
    <div id={tab} className={cls} style={style}>
      <span>{label}</span>
      {children}
    </div>
  );
}

/* ==================== ScrollTabs ==================== */

export interface ScrollTabsProps {
  children: React.ReactNode;
  /** IntersectionObserver 的 rootMargin，默认 '-20px 0px 0px 0px' */
  rootMargin?: string;
}

/**
 * ScrollTabs - 滚动联动 Tabs 组件（复合组件模式）
 *
 * 用法：
 * ```tsx
 * <ScrollTabs>
 *   <ScrollTabs.ScrollTab tab="basic" label="基本信息">
 *     ...
 *   </ScrollTabs.ScrollTab>
 *   <ScrollTabs.ScrollTab tab="detail" label="明细">
 *     ...
 *   </ScrollTabs.ScrollTab>
 * </ScrollTabs>
 * ```
 */
function ScrollTabs(props: ScrollTabsProps) {
  const { children, rootMargin = '-90px 0px 0px 0px' } = props;

  // 从 children 中提取 ScrollTab 的 tab/label 信息
  const tabItems = useMemo(() => {
    const items: { tab: string; label: React.ReactNode }[] = [];
    React.Children.forEach(children, (child) => {
      if (React.isValidElement<ScrollTabProps>(child) && child.type === ScrollTab) {
        items.push({
          tab: child.props.tab,
          label: child.props.label ?? child.props.tab,
        });
      }
    });
    return items;
  }, [children]);

  const [activeKey, setActiveKey] = useState(tabItems[0]?.tab);
  const containerRef = useRef<HTMLDivElement>(null);
  // 点击 Tab 滚动期间，忽略 observer 的更新，防止高亮闪烁
  const isClickScrollingRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current?.closest('.page-content');
    if (!container) return;

    const targets = tabItems
      .map((item) => container.querySelector<HTMLElement>(`#${item.tab}`))
      .filter(Boolean) as HTMLElement[];

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          (entry.target as any)._isIntersecting = entry.isIntersecting;
        });
        // 点击触发的滚动期间不更新 activeKey
        if (isClickScrollingRef.current) return;
        const first = targets.find((t) => (t as any)._isIntersecting);
        if (first?.id) {
          setActiveKey(first.id);
        }
      },
      { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1], root: container, rootMargin }
    );

    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [tabItems, rootMargin]);

  const handleTabChange = useCallback((key: string) => {
    setActiveKey(key);
    isClickScrollingRef.current = true;
    const container = containerRef.current?.closest('.page-content');
    if (!container) return;
    container.querySelector<HTMLElement>(`#${key}`)?.scrollIntoView({
      block: 'start',
      behavior: 'smooth',
    });
    // 滚动结束后恢复 observer 更新
    const onScrollEnd = () => {
      isClickScrollingRef.current = false;
      container.removeEventListener('scrollend', onScrollEnd);
    };
    container.addEventListener('scrollend', onScrollEnd, { once: true });
  }, []);

  return (
    <>
      <div ref={containerRef} className={styles['scroll-tabs-header']}>
        <Tabs activeKey={activeKey} onChange={handleTabChange}>
          {tabItems.map((item) => (
            <Tabs.TabPane tab={item.label} key={item.tab} />
          ))}
        </Tabs>
      </div>
      {children}
    </>
  );
}

ScrollTabs.ScrollTab = ScrollTab;

export default ScrollTabs;
