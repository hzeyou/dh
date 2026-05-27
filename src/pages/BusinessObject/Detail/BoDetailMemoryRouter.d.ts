import React from 'react';
import { RouteComponentProps } from 'react-router';
interface Props extends RouteComponentProps<{
    id: string;
}> {
}
declare const BoRouter: React.FC<Props>;
export default BoRouter;
