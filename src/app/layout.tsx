import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeButton } from "@lib/components";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import dynamic from "next/dynamic";
const AuthProvider = dynamic(
	() => import("@lib/providers").then(mod => mod.AuthProvider),
	{ ssr: false },
);
const ClientProvider = dynamic(
	() => import("@lib/providers").then(mod => mod.ClientProvider),
	{ ssr: false },
);

import "./globals.css";

const inter = Inter({
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Watery Light",
	description: "Simple OAuth example",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<ClientProvider>
					<AuthProvider>
						<main className="bg-slate-100 dark:bg-slate-900 min-h-screen w-full transition-all p-8">
							{children}
							<ThemeButton className="fixed bottom-0 right-0 m-4" />
							<ToastContainer
								position="bottom-left"
								theme="colored"
								autoClose={2000}
								hideProgressBar
							/>
						</main>
					</AuthProvider>
				</ClientProvider>
			</body>
		</html>
	);
}
