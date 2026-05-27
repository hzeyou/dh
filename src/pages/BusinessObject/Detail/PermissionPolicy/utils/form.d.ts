import React from 'react';
import { Renderer, RenderProps } from 'choerodon-ui/pro/lib/field/FormField';
/**
 * 显示数据操作权限
 * @param value
 */
export declare const rendererDataPermissions: Renderer<RenderProps>;
/**
 * 显示数据范围
 * @param value
 */
export declare const rendererDataRanges: Renderer<RenderProps>;
/**
 * 显示权限类型
 * @param value
 */
export declare const rendererType: Renderer<RenderProps>;
/**
 * 仅对主对象生效的帮助
 */
export declare const getOnlyMasterFlagHelp: () => {
    help: React.JSX.Element;
    helpTooltipProps: {
        popupClassName: any;
    };
};
