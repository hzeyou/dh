import React from 'react';
interface Props {
    businessObjectCode: string;
    domainId: string;
    data: any;
    isPublished: boolean;
    handleSaveCheckPage?: (list: any) => void;
}
declare const PublishPageTable: React.FC<Props>;
export default PublishPageTable;
