"use client";
import { ToastContainer } from "react-toastify";
import { toastTypes } from "./constants";
import { twMerge } from "tailwind-merge";
import "react-toastify/dist/ReactToastify.css";

export function Toast() {
	return (
		<ToastContainer
			position="bottom-left"
			theme="colored"
			autoClose={2000}
			hideProgressBar
			toastClassName={context =>
				twMerge(
					toastTypes[context?.type || "default"],
					"relative flex p-4 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer",
				)
			}
		/>
	);
}
