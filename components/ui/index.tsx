import { ReactNode } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "font-semibold transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500 dark:text-slate-100 dark:hover:bg-slate-800",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? "Chargement..." : props.children}
    </button>
  );
}

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = "", hover = true }: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-xl shadow-md p-6 border border-slate-200
        dark:bg-slate-800 dark:border-slate-700
        ${hover ? "hover:shadow-lg transition-shadow duration-300" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

interface BadgeProps {
  children: ReactNode;
  variant?: "primary" | "success" | "warning" | "danger";
  size?: "sm" | "md";
}

export function Badge({ children, variant = "primary", size = "sm" }: BadgeProps) {
  const variants = {
    primary: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
    success: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200",
    danger: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
  };

  const sizes = {
    sm: "px-2 py-1 text-xs rounded",
    md: "px-3 py-1.5 text-sm rounded-md",
  };

  return <span className={`${variants[variant]} ${sizes[size]} font-semibold`}>{children}</span>;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: ReactNode;
}

export function Input({ label, error, helperText, icon, className = "", ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>}
        <input
          className={`
            w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-slate-900
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-all duration-200 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600
            ${icon ? "pl-10" : ""}
            ${error ? "border-red-500 focus:ring-red-500" : ""}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">{helperText}</p>}
    </div>
  );
}

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
}

export function LoadingSpinner({ size = "md" }: LoadingSpinnerProps) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizes[size]} border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin`}
      />
    </div>
  );
}
