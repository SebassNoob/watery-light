import type { ComponentPropsWithRef, ReactNode } from "react";

export interface ButtonProps extends ComponentPropsWithRef<"button"> {
	children: ReactNode;
	onClick?: () => void;
	className?: string;
	disabled?: boolean;
}
