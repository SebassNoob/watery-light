import type { ComponentPropsWithRef } from "react";

export interface TextInputProps extends ComponentPropsWithRef<"textarea"> {
	className?: string;
	label: string;
	name?: string;
	placeholder?: string;
	value?: string;
}
