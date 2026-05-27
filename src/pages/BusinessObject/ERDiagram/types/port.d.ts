import { PortsGroup } from '../constants/port';
export interface PortProp {
    id: string;
    group: PortsGroup.list;
    attrs: {
        portNameLabel: {
            text: string;
        };
        portTypeLabel: {
            text: string;
        };
    };
}
