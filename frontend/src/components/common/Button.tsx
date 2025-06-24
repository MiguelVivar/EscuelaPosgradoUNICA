"use client";

import { forwardRef } from "react";
import Link from "next/link";
import { ButtonProps, ButtonAsButton, ButtonAsLink } from "@/types";

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      children,
      fullWidth = false,
      className = "",
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg";

    const variantClasses = {
      primary:
        "bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-500 shadow-sm hover:shadow-md",
      secondary:
        "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 shadow-sm hover:shadow-md",
      outline:
        "border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white focus:ring-amber-500 bg-transparent",
      ghost:
        "text-gray-700 hover:bg-gray-100 focus:ring-gray-500 bg-transparent",
      danger:
        "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm hover:shadow-md",
    };

    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm gap-1.5",
      md: "px-4 py-2 text-base gap-2",
      lg: "px-6 py-3 text-lg gap-2.5",
      xl: "px-8 py-4 text-xl gap-3",
    };

    const iconSizeClasses = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
      xl: "w-7 h-7",
    };

    const loadingSpinnerClasses = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
      xl: "w-7 h-7",
    };

    const classes = [
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      fullWidth ? "w-full" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const content = (
      <>
        {isLoading ? (
          <>
            <svg
              className={`animate-spin ${loadingSpinnerClasses[size]}`}
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Cargando...</span>
          </>
        ) : (
          <>
            {LeftIcon && <LeftIcon className={iconSizeClasses[size]} />}
            {children}
            {RightIcon && <RightIcon className={iconSizeClasses[size]} />}
          </>
        )}
      </>
    ); 
    // Si tiene href, renderizar como Link
    if ("href" in props && props.href) {
      const { href, target, rel, onClick, ...linkProps } =
        props as ButtonAsLink;

      // Si target es _blank, agregar rel="noopener noreferrer" por seguridad
      const linkRel =
        target === "_blank"
          ? rel
            ? `${rel} noopener noreferrer`
            : "noopener noreferrer"
          : rel;

      // Si es un enlace externo o tiene target="_blank", usar <a> en lugar de Link
      const isExternalLink =
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        target === "_blank";

      if (isExternalLink) {
        return (
          <a
            href={href}
            target={target}
            rel={linkRel}
            ref={ref as React.Ref<HTMLAnchorElement>}
            className={classes}
            onClick={onClick}
            {...linkProps}
          >
            {content}
          </a>
        );
      }

      // Para enlaces internos, usar Link de Next.js
      return (
        <Link
          href={href}
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={classes}
          onClick={onClick}
          {...linkProps}
        >
          {content}
        </Link>
      );
    }

    // Si no tiene href, renderizar como button
    const buttonProps = props as ButtonAsButton;
    const isDisabled = buttonProps.disabled || isLoading;

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classes}
        disabled={isDisabled}
        {...buttonProps}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
