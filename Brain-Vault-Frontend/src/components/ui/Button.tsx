import React, { ReactElement } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "xs" | "sm" | "md" | "lg";

interface ButtonProps {
  startIcon?: ReactElement<{ size: Size }>;
  endIcon?: ReactElement<{ size: Size }>;
  variant?: Variant;
  title?: string;
  size?: Size;
  onClick?: (x?: any) => void;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  ariaLabel?: string;
  type?: "button" | "submit" | "reset";
}

const baseClasses = `
  inline-flex items-center justify-center
  rounded-lg
  transition-all duration-200 ease-in-out
  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
  active:scale-[0.98]
  font-medium
`;

// Updated size classes to be responsive
const sizeClasses: Record<Size, string> = {
  xs: "px-2.5 py-1 text-xs",
  sm: "px-3 py-1.5 text-sm md:px-3 md:py-1.5 md:text-sm", // Responsive sm
  md: "px-3 py-1.5 text-sm md:px-4 md:py-2 md:text-base", // Defaults to sm on mobile, md on desktop
  lg: "px-4 py-2 text-base md:px-6 md:py-3 md:text-lg"    // Defaults to md on mobile, lg on desktop
};

const variantClasses: Record<Variant, string> = {
  primary: "bg-blue-700 text-white hover:bg-blue-800 focus-visible:outline-blue-700",
  secondary: "bg-blue-50 text-blue-700 hover:bg-blue-100 focus-visible:outline-blue-200",
  outline: "border border-blue-300 text-blue-700 hover:bg-blue-50 focus-visible:outline-blue-300",
  ghost: "text-gray-700 hover:bg-gray-100 focus-visible:outline-gray-200"
};

export const Button = ({
  startIcon,
  endIcon,
  variant = "primary",
  title,
  size = "md",
  onClick,
  disabled = false,
  fullWidth = false,
  className = "",
  ariaLabel,
  type = "button",
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel || title}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? "w-full" : "w-fit"}
        ${className}
      `}
    >
      {startIcon && (
        <span className={title ? "mr-2" : ""}>
          {React.cloneElement(startIcon, { size: size === "md" ? "sm" : size })}
        </span>
      )}
      {title}
      {endIcon && (
        <span className={title ? "ml-2" : ""}>
          {React.cloneElement(endIcon, { size: size === "md" ? "sm" : size })}
        </span>
      )}
    </button>
  );
};