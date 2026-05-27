import React from 'react';
export interface CardProps {
    id: any;
    text: string;
    index: number;
    moveCard: (dragIndex: number, hoverIndex: number) => void;
    handleDelete: (id: any) => void;
    tenantReadOnly: boolean;
    physicalModelType?: string;
}
declare const _default: ({ id, text, index, moveCard, handleDelete, tenantReadOnly, physicalModelType, }: CardProps) => React.JSX.Element;
export default _default;
