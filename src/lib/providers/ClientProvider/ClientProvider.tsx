"use client";
import { createContext } from "react";
import { useMemo, useState, useEffect, useLayoutEffect } from "react";
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

	const [breakpoint, setBreakpoint] = useState<Breakpoint>(() => {
		// Find the first breakpoint that matches the current window size
		const indexOfLastQuery = Object.values(queries)
			.map(query => window.matchMedia(query).matches)
			.lastIndexOf(true);
		return Object.keys(queries)[indexOfLastQuery] as Breakpoint;
	});

	const [isMobile, setIsMobile] = useState<boolean>(() => {
		// Check if the current window size is mobile
		return window.matchMedia(MOBILE_MEDIA_QUERY).matches;
	});

	useEffect(() => {
		// Create a list of media query lists
		const mediaQueryLists = Object.values(queries).map(query =>
			window.matchMedia(query),
		);

		// Handle window resize events
		const handleResize = () => {
			const indexOfLastQuery = mediaQueryLists
				.map(mql => mql.matches)
				.lastIndexOf(true);
			setBreakpoint(Object.keys(queries)[indexOfLastQuery] as Breakpoint);
			setIsMobile(window.matchMedia(MOBILE_MEDIA_QUERY).matches);
		};

		// Add the resize event listener
		window.addEventListener("resize", handleResize);
		// Call the resize handler once to set the initial breakpoint
		handleResize();

		// Remove the resize event listener on cleanup
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [queries]);

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
		[theme, setTheme, breakpoint, isMobile],
	);

	return (
		<ClientContext.Provider value={value}>
			{children}
		</ClientContext.Provider>
	);
};
