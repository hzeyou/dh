import React, { CSSProperties } from 'react';
import { EditorDidMount } from '@apaas/components/MonacoEditor';
import { Suggestion } from '@hmde/businessComponents/FormulaEditorCore/types';
export interface FormulaEditorInstance {
    checkMakers: () => boolean;
    clear: () => void;
    appendText: (value?: string) => void;
    setInitValue: (value: string) => void;
    editorInstance: any;
}
interface Props {
    autoSelectBlocks?: string[];
    blocks?: string[];
    disabled?: boolean;
    highLightBlocks?: string[];
    initLanguage?: string;
    initValue?: string;
    onChange?: (code: string) => void;
    onBlur?: () => void;
    onEditorDidMounted?: EditorDidMount;
    style?: CSSProperties;
    suggestions?: Suggestion[];
    handleCheckFormula?: () => void;
}
declare const FormulaEditor: React.ForwardRefExoticComponent<Props & React.RefAttributes<FormulaEditorInstance>>;
export default FormulaEditor;
