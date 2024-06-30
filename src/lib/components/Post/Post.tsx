import type { PostProps } from "./types";
import { twMerge } from "tailwind-merge";

export function Post({
	message,
	username,
	createdAt,
	className,
	pending,
}: PostProps) {
	return (
		<div
			className={twMerge(
				"min-w-48 p-6",
				pending ? "animate-pulse opacity-80" : "",
				className,
			)}
		>
			<div className="flex gap-4 items-center">
				<p className="text-indigo-600 dark:text-indigo-300 text-sm">
					{username}
				</p>
				<p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
					{createdAt.toLocaleString("en-GB")}
				</p>
				{pending && (
					<p className="text-slate-800 dark:text-slate-100 text-sm">
						Uploading...
					</p>
				)}
			</div>
			<div className="border-l-2 border-indigo-700 pl-4">
				<p className="text-slate-900 dark:text-slate-50 text-lg sm:text-xl text-wrap break-words">
					{message}
				</p>
			</div>
		</div>
	);
}
