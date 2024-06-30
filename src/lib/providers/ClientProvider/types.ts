import type { ReactNode } from "react";

export type Theme = "light" | "dark";

export type Breakpoint = "sm" | "md" | "lg" | "xl" | "2xl";

export interface ClientContextProps {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	breakpoint: Breakpoint;
	isMobile: boolean;
}

export interface ClientProviderProps {
	children: ReactNode;
}
