import { PortsGroup } from "../constants/port";

/**
 * 是否为 port 属性数据
 * @param port
 */
export function isPortProps(port) {
  return !!(port !== null && port !== void 0 && port.id && port.group === PortsGroup.list);
}