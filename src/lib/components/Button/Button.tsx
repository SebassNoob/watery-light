import { twMerge } from "tailwind-merge";
import type { ButtonProps } from "./types";

export function Button({
	children,
	onClick,
	className,
	disabled = false,
	...rest
}: ButtonProps) {
	const baseStyles = `
  px-5 py-2.5 text-sm font-medium 
  text-gray-700 rounded-lg border border-gray-200 
  hover:bg-gray-100 focus:ring-2 focus:ring-offset-2 focus:outline-none focus:ring-gray-200 
  dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700
  disabled:opacity-50 disabled:cursor-not-allowed
  `;

	return (
		<button
			onClick={onClick}
			className={twMerge(baseStyles, className)}
			disabled={disabled}
			{...rest}
		>
			{children}
		</button>
	);
}
