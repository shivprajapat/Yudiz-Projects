import React from "react"

export interface IActionColumnProps {
    handleView: () => void;
    handleEdit: () => void;
    handleDelete: () => void;
    className?: string;
    permissions: {
        READ?: string;
        UPDATE?: string;
        DELETE?: string;
    };
    disabled?: boolean;
    isVisibleCost?: boolean;
}

export interface ITargetType {
    current: React.RefObject<HTMLElement>; 
}