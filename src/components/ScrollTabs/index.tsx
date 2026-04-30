import React, { useEffect, useRef, useState, useCallback, useMemo, useContext, createContext } from 'react';
import { Tabs } from 'choerodon-ui/pro';
import styles from './index.less';
import useThemeColor from 'hzero-front-apaas/lib/hooks/useThemeColor';

/* ==================== Context ==================== */

interface ScrollTabItem {
  tab: string;
  label: React.ReactNode;
}

interface ScrollTabsContextValue {
  register: (item: ScrollTabItem) => void;
  unregister: (tab: string) => void;
}

const ScrollTabsContext = createContext<ScrollTabsContextValue | null>(null);

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
 * ScrollTab - 滚动区域面板，可放在页面任意位置，通过 Context 自动注册到 ScrollTabs
 */
function ScrollTab(props: ScrollTabProps) {
  const { tab, label, children, className, style } = props;
  const ctx = useContext(ScrollTabsContext);
  const themeColor = useThemeColor();

  useEffect(() => {
    if (!ctx) return;
    ctx.register({ tab, label: label ?? tab });
    return () => ctx.unregister(tab);
  }, [tab, label, ctx]);

  const cls = className
    ? `${styles['scroll-tab']} ${className}`
    : styles['scroll-tab'];

  return (
    <div id={tab} className={cls} style={style}>
      <div className={styles['scroll-tab-title']}>
        <span
          className={styles['scroll-tab-label']}
          style={{
            '--scroll-tab-primary-color': themeColor.primary,
            '--scroll-tab-title-color': themeColor.titleColor1 } as React.CSSProperties}
        >
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

/* ==================== ScrollTabs ==================== */

export interface ScrollTabsProps {
  children: React.ReactNode;
  /** IntersectionObserver 的 rootMargin，默认 '-90px 0px 0px 0px' */
  rootMargin?: string;
}

/**
 * ScrollTabs - 滚动联动 Tabs 组件（Context 模式，不要求嵌套）
 *
 * 用法：
 * ```tsx
 * <ScrollTabs>
 *   <ScrollTabs.ScrollTab tab="basic" label="基本信息">
 *     ...
 *   </ScrollTabs.ScrollTab>
 *   <SomeOtherComponent />
 *   <ScrollTabs.ScrollTab tab="detail" label="明细">
 *     ...
 *   </ScrollTabs.ScrollTab>
 * </ScrollTabs>
 * ```
 *
 * ScrollTab 不需要是 ScrollTabs 的直接子元素，可以嵌套在任意层级中。
 */
function ScrollTabs(props: ScrollTabsProps) {
  const { children, rootMargin = '-90px 0px 0px 0px' } = props;

  // 用 ref 存储注册顺序，用 state 触发渲染
  const tabOrderRef = useRef<string[]>([]);
  const [tabItems, setTabItems] = useState<ScrollTabItem[]>([]);

  const contextValue = useMemo<ScrollTabsContextValue>(() => ({
    register: (item: ScrollTabItem) => {
      // 保持注册顺序：如果已存在则更新 label，否则追加
      setTabItems((prev) => {
        const exists = prev.find((t) => t.tab === item.tab);
        if (exists) {
          return prev.map((t) => (t.tab === item.tab ? item : t));
        }
        if (!tabOrderRef.current.includes(item.tab)) {
          tabOrderRef.current.push(item.tab);
        }
        return [...prev, item];
      });
    },
    unregister: (tab: string) => {
      tabOrderRef.current = tabOrderRef.current.filter((t) => t !== tab);
      setTabItems((prev) => prev.filter((t) => t.tab !== tab));
    },
  }), []);

  // 按注册顺序排序
  const sortedItems = useMemo(() => {
    const order = tabOrderRef.current;
    return [...tabItems].sort((a, b) => order.indexOf(a.tab) - order.indexOf(b.tab));
  }, [tabItems]);

  const [activeKey, setActiveKey] = useState<string | undefined>();
  const containerRef = useRef<HTMLDivElement>(null);
  const isClickScrollingRef = useRef(false);

  // 首个 tab 注册后设置默认 activeKey
  useEffect(() => {
    if (!activeKey && sortedItems.length > 0) {
      setActiveKey(sortedItems[0].tab);
    }
  }, [sortedItems, activeKey]);

  useEffect(() => {
    if (sortedItems.length === 0) return;

    const container = containerRef.current?.closest('.page-content');
    if (!container) return;

    const targets = sortedItems
      .map((item) => container.querySelector<HTMLElement>(`#${item.tab}`))
      .filter(Boolean) as HTMLElement[];

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          (entry.target as any)._isIntersecting = entry.isIntersecting;
        });
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
  }, [sortedItems, rootMargin]);

  const handleTabChange = useCallback((key: string) => {
    setActiveKey(key);
    isClickScrollingRef.current = true;
    const container = containerRef.current?.closest('.page-content');
    if (!container) return;
    container.querySelector<HTMLElement>(`#${key}`)?.scrollIntoView({
      block: 'start',
      behavior: 'smooth',
    });
    const onScrollEnd = () => {
      isClickScrollingRef.current = false;
      container.removeEventListener('scrollend', onScrollEnd);
    };
    container.addEventListener('scrollend', onScrollEnd, { once: true });
  }, []);

  return (
    <ScrollTabsContext.Provider value={contextValue}>
      <div ref={containerRef} className={styles['scroll-tabs-header']}>
        <Tabs activeKey={activeKey} onChange={handleTabChange}>
          {sortedItems.map((item) => (
            <Tabs.TabPane tab={item.label} key={item.tab} />
          ))}
        </Tabs>
      </div>
      {children}
    </ScrollTabsContext.Provider>
  );
}

ScrollTabs.ScrollTab = ScrollTab;

export default ScrollTabs;
