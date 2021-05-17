
export interface Child {
    label?: string;
    data?: string;
    expandedIcon?: string;
    collapsedIcon?: string;
    children?: Child[];
    icon?: string;
    leaf?: any;
}

export interface Root {
    label?: string;
    data?: string;
    expandedIcon?: string;
    collapsedIcon?: string;
    children?: Child[];
    leaf?: any;
}
