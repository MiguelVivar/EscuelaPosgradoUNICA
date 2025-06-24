import { IconType } from "react-icons";
import { ButtonHTMLAttributes, ReactNode, AnchorHTMLAttributes } from "react";

interface BaseButtonProps {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
  leftIcon?: IconType;
  rightIcon?: IconType;
  children: ReactNode;
  fullWidth?: boolean;
}

interface ButtonAsButton
  extends BaseButtonProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  href?: never;
}

interface ButtonAsLink
  extends BaseButtonProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children"> {
  href: string;
  target?: string;
  rel?: string;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

export type { ButtonProps, ButtonAsButton, ButtonAsLink, BaseButtonProps };
