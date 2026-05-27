import { monaco } from '@apaas/components/MonacoEditor';
export declare const registryAutoSelectBlocks: (editor: monaco.editor.IStandaloneCodeEditor, blocks: string[]) => {
    dispose(): void;
};
export declare const registryEditorTheme: (themeName: string) => void;
export declare const registryMonarchTokensProvider: (languageId: string, blocks: string[]) => monaco.IDisposable;
/**
 * 将公式上的cascade字段替换成它的别名
 * @param formula
 * @param analyzeResultList
 * @returns
 */
export declare const NewCodeTransfer: (formula: any, analyzeResultList: any, value: any, meaning: any) => any;
