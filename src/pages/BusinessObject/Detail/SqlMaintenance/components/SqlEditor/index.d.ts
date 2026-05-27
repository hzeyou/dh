import React from 'react';
import { monaco } from '@apaas/components/MonacoEditor';
interface Props {
    disabled?: boolean;
}
export interface SqlRefType {
    editorInstance: monaco.editor.IStandaloneCodeEditor | null;
}
declare const SqlEditor: React.ForwardRefExoticComponent<Props & React.RefAttributes<SqlRefType>>;
export default SqlEditor;
