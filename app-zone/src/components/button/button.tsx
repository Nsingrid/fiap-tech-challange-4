import { ReactNode } from "react";

export type ButtonProps = Readonly<{
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  variant:
    | "ghost"
    | "homePrimary"
    | "homeSecondary"
    | "dashPrimary"
    | "modalPrimary";
  size?: "ghost" | "small" | "medium" | "large" | "full";
}>;

const variantClasses = {
  ghost: "",
  homePrimary: "bg-gradient-to-br from-green-500 to-emerald-600 text-black border-2 border-transparent font-bold hover:from-emerald-600 hover:to-emerald-700 hover:shadow-[0_8px_20px_rgba(0,200,83,0.3)] hover:-translate-y-0.5",
  homeSecondary: "bg-black text-green-500 border-2 border-green-500 hover:bg-green-500 hover:text-white hover:shadow-[0_8px_20px_rgba(0,200,83,0.3)] hover:-translate-y-0.5",
  dashPrimary: "bg-gradient-to-br from-primary-500 to-secondary-600 text-white font-bold hover:shadow-[0_12px_25px_rgba(102,126,234,0.4)] hover:-translate-y-1",
  modalPrimary: "bg-primary-600 text-white font-medium hover:bg-primary-700 active:bg-primary-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
};

const sizeClasses = {
  ghost: "w-auto",
  small: "w-[140px]",
  medium: "w-[180px]",
  large: "w-[260px]",
  full: "w-full"
};

export const Button = ({
  children,
  onClick,
  variant,
  type = "button",
  disabled = false,
  size = "medium",
}: ButtonProps) => (
  <button
    type={type}
    disabled={disabled}
    onClick={onClick}
    className={`
      flex items-center justify-center cursor-pointer font-semibold text-center rounded-lg 
      transition-all duration-200 ease-in-out px-6 py-3
      shadow-sm hover:shadow-md active:scale-[0.98]
      disabled:opacity-60 disabled:cursor-not-allowed
      ${variantClasses[variant]}
      ${sizeClasses[size]}
    `}
  >
    {children}
  </button>
);
