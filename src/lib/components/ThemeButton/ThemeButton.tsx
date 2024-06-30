"use client";
import { useContext } from "react";
import { ClientContext } from "@lib/providers";
import type { ThemeButtonProps } from "./types";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

export function ThemeButton({ className }: ThemeButtonProps) {
	const { theme, setTheme } = useContext(ClientContext);

	return (
		<button
			onClick={() => setTheme(theme === "light" ? "dark" : "light")}
			className={twMerge("p-2 rounded bg-white dark:bg-black", className)}
		>
			<Image
				src={`/common/${theme === "light" ? "moon" : "sun"}.svg`}
				alt={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
				width={28}
				height={28}
			/>
		</button>
	);
}
