import React from 'react';
import { PublishStatus } from '@apaas/constants/businessObject';
export declare enum TAB_KEYS {
    baseInfo = "baseInfo",
    fieldList = "fieldList",
    optionList = "optionList",
    pages = "pages",
    template = "template",
    buttons = "buttons",
    rules = "rules",
    eventFlow = "eventFlow",
    advancedRelationship = "advancedRelationship",
    permissionPolicy = "permissionPolicy",
    relationDetail = "relationDetail",
    commmonApi = "commmonApi",
    lineTrigger = "lineTrigger",
    auditEditItem = "auditEditItem",
    foundationCommmonApi = "foundationCommmonApi",
    sql = "sql"
}
export declare enum GROUP_KEYS {
    objectModel = "objectModel",
    objectInteractive = "objectInteractive",
    objectResource = "objectResource",
    unKnow = "unKnow"
}
export interface tabPaneItemInterface {
    tabKey: TAB_KEYS;
    title: string;
    visible?: boolean;
    props?: any;
    children?: any;
}
export declare const statusList: () => ({
    status: PublishStatus;
    color: string;
    text: string;
} | {
    status: PublishStatus;
    text: string;
    color?: undefined;
})[];
export declare const TabPaneRender: ({ tabKey, props, title, visible, children, }: tabPaneItemInterface) => React.JSX.Element | null;
export default function TabTitleList({ tabPaneList, activeKey, tabItemClick, baseInfoDS, domainId, history, match, readOnlyFlag, }: {
    tabPaneList: any;
    activeKey: any;
    tabItemClick: any;
    baseInfoDS: any;
    domainId: any;
    history: any;
    match: any;
    readOnlyFlag: any;
}): React.JSX.Element;
