"use client";
import { createContext } from "react";
import {
	useMemo,
	useState,
	useLayoutEffect,
	useSyncExternalStore,
} from "react";
import { Breakpoints, MOBILE_MEDIA_QUERY } from "./constants";
import type {
	ClientContextProps,
	ClientProviderProps,
	Breakpoint,
	Theme,
} from "./types";

export const ClientContext = createContext<ClientContextProps>({
	theme: "light",
	setTheme: () => {},
	breakpoint: "sm",
	isMobile: false,
});

export const ClientProvider = ({ children }: ClientProviderProps) => {
	const queries = useMemo(() => {
		return Object.entries(Breakpoints).reduce(
			(prev, [breakpoint, size]) => {
				prev[breakpoint as Breakpoint] = `(min-width: ${size}px)`;
				return prev;
			},
			{} as Record<Breakpoint, string>,
		);
	}, []);

	const subscribeToWindowResize = (callback: () => void) => {
		window.addEventListener("resize", callback);
		return () => window.removeEventListener("resize", callback);
	};

	const getBreakpoint = () => {
		// Find the first breakpoint that matches the current window size
		const indexOfLastQuery = Object.values(queries)
			.map(query => window.matchMedia(query).matches)
			.lastIndexOf(true);
		return Object.keys(queries)[indexOfLastQuery] as
			| Breakpoint
			| undefined;
	};

	const getIsMobile = () => window.matchMedia(MOBILE_MEDIA_QUERY).matches;

	const breakpoint = useSyncExternalStore(
		subscribeToWindowResize,
		getBreakpoint,
	);
	const isMobile = useSyncExternalStore(
		subscribeToWindowResize,
		getIsMobile,
	);

	const [theme, setTheme] = useState<Theme>(() => {
		const localStorageTheme = localStorage.getItem("theme");
		if (localStorageTheme === "light" || localStorageTheme === "dark") {
			return localStorageTheme;
		}
		const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
			.matches
			? "dark"
			: "light";
		return systemTheme;
	});

	useLayoutEffect(() => {
		localStorage.setItem("theme", theme);
		if (theme === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [theme]);

	const value = useMemo(
		() => ({ theme, setTheme, breakpoint, isMobile }),
		[theme, breakpoint, isMobile],
	);

	return (
		<ClientContext.Provider value={value}>
			{children}
		</ClientContext.Provider>
	);
};
