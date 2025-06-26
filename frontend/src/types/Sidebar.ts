import { ReactNode } from "react";

export interface SidebarItemProps {
  id: string;
  icon: ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  isActive?: boolean;
  hasHover?: boolean;
  hoverContent?: {
    title?: string;
    items?: string[];
  };
}

export interface SidebarProps {
  items: SidebarItemProps[];
  className?: string;
  width?: "narrow" | "wide";
  position?: "left" | "right";
  backgroundColor?: string;
}

export interface SidebarItemComponentProps extends SidebarItemProps {
  width: "narrow" | "wide";
}
