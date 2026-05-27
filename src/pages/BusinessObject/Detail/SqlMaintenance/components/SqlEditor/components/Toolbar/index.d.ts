import React, { MutableRefObject } from 'react';
import { monaco } from 'hzero-front-apaas/lib/components/MonacoEditor';
interface Props {
    disabled?: boolean;
    editorInstanceRef: MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>;
}
declare const _default: React.FunctionComponent<Props>;
export default _default;
