declare const nodes: ({
    id: string;
    nodeName: string;
    nodeCode: string;
    category: string;
    nodeType: string;
    icon: any;
} | {
    nodeName: string;
    nodeCode: string;
    category: string;
    nodeType: string;
    icon: any;
    id?: undefined;
})[];
declare const regularNode: (image: any) => {
    width: number;
    height: number;
    nodeCode: string;
    nodeName: string;
    nodeType: string;
    markup: {
        tagName: string;
        selector: string;
    }[];
    attrs: {
        image: {
            x: number;
            refY: string;
            refY2: number;
            width: number;
            'xlink:href': any;
        };
        label: {
            x: number;
            cursor: string;
            text: string;
            fill: string;
            fontSize: number;
        };
        body: {
            stroke: string;
            strokeWidth: number;
            cursor: string;
        };
    };
    ports: {
        groups: {
            top: {
                position: string;
            };
            bottom: {
                position: string;
            };
        };
        items: {
            group: string;
            attrs: {
                circle: {
                    r: number;
                    magnet: boolean;
                    stroke: string;
                    strokeWidth: number;
                    fill: string;
                };
            };
        }[];
    };
};
declare const conditionNode: {
    width: number;
    height: number;
    nodeCode: string;
    nodeName: string;
    nodeType: string;
    shape: string;
    markup: {
        tagName: string;
        selector: string;
    }[];
    attrs: {
        image: {
            x: number;
            refY: string;
            refY2: number;
            width: number;
            xlinkHref: any;
        };
        label: {
            x: number;
            cursor: string;
            text: string;
            fill: string;
            fontSize: number;
        };
        body: {
            cursor: string;
            strokeWidth: number;
            fill: string;
            stroke: string;
            refPoints: string;
        };
    };
    ports: {
        groups: {
            left: {
                position: string;
            };
            bottom: {
                position: string;
            };
            right: {
                position: string;
            };
            top: {
                position: string;
            };
        };
        items: {
            id: string;
            group: string;
            attrs: {
                circle: {
                    r: number;
                    magnet: boolean;
                    stroke: string;
                    strokeWidth: number;
                    fill: string;
                };
            };
        }[];
    };
};
declare const endNode: {
    nodeCode: string;
    nodeName: string;
    nodeType: string;
    width: number;
    height: number;
    shape: string;
    attrs: {
        cursor: string;
        body: {
            fill: string;
            stroke: string;
            strokeWidth: number;
            cursor: string;
        };
    };
    ports: {
        groups: {
            end: {
                position: string;
            };
        };
        items: {
            id: string;
            group: string;
            attrs: {
                circle: {
                    r: number;
                    magnet: boolean;
                    stroke: string;
                    strokeWidth: number;
                    fill: string;
                };
            };
        }[];
    };
};
declare const fieldsMap: Map<string, string[]>;
declare const fieldsObjMap: Map<any, any>;
export { nodes, regularNode, conditionNode, endNode, fieldsMap, fieldsObjMap };
