import React from 'react';
import { Modal } from 'choerodon-ui/pro';
import { ModalProps } from 'choerodon-ui/pro/lib/modal/Modal';

// Modal 实例类型定义
interface ModalInstance {
  close: () => void;
  update: (props: Partial<ModalProps>) => void;
  props: ModalProps & { active?: boolean };
}

interface ModalWrapperProps<T = Record<string, any>> {
  modal?: ModalInstance;
  data?: T;
}

interface OpenModalHelperOptions<T = Record<string, any>> {
  title?: string;
  content: React.ComponentType<{ modal?: ModalInstance } & T>;
  drawer?: boolean;
  closable?: boolean;
  onOk?: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
  footer?: (okBtn: React.ReactElement, cancelBtn: React.ReactElement) => React.ReactElement;
  modalProps?: Partial<ModalProps>;
  data?: T;
}

/**
 * 通用弹窗工具函数
 * @param options 弹窗配置选项
 * @returns Modal 实例
 *
 * @example
 * // 基础用法
 * const MyModalContent = ({ modal }) => {
 *   return <div>弹窗内容</div>;
 * };
 *
 * openModalHelper({
 *   title: '我的弹窗',
 *   content: MyModalContent,
 * });
 *
 * @example
 * // 带数据传递（数据会被扁平化到组件 props 上）
 * interface MyData {
 *   id: number;
 *   name: string;
 * }
 *
 * const MyModalContent = ({ modal, id, name }: { modal?: ModalInstance; id: number; name: string }) => {
 *   return <div>{name}</div>;
 * };
 *
 * openModalHelper<MyData>({
 *   title: '我的弹窗',
 *   content: MyModalContent,
 *   data: { id: 1, name: '张三' },
 * });
 *
 * @example
 * // 带自定义按钮
 * openModalHelper({
 *   title: '自定义按钮',
 *   content: MyModalContent,
 *   footer: (okBtn, cancelBtn) => (
 *     <div>
 *       {okBtn}
 *       <Button color="primary">自定义按钮</Button>
 *       {cancelBtn}
 *     </div>
 *   ),
 * });
 */
export function openModalHelper<T = Record<string, any>>(options: OpenModalHelperOptions<T>) {
  const {
    title = '弹窗',
    content: ContentComponent,
    drawer = true,
    closable = true,
    data,
    ...other
  } = options;

  // 包装组件，处理 modal 激活状态
  const ModalWrapper: React.FC<ModalWrapperProps<T>> = ({ modal }) => {
    if (!modal?.props?.active) {
      return null;
    }
    // 将 data 扁平化到 ContentComponent 上
    return <ContentComponent modal={modal} {...(data as T)} />;
  };

  const modalInstance = Modal.open({
    title,
    children: <ModalWrapper />,
    drawer,
    closable,
    ...other,
  });

  return modalInstance;
}


