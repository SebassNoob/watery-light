"use client";
import { signout } from "@lib/actions";
import { getLogin, type GetLoginResult } from "@lib/actions";
import { useState, useEffect, createContext } from "react";
import type { AuthContextProps, AuthProviderProps } from "./types";

export const AuthContext = createContext<AuthContextProps>({
	user: null,
	session: null,
	loading: true,
	signout: () => {},
});

export function AuthProvider({ children }: AuthProviderProps) {
	const [loading, setLoading] = useState(false);
	const [session, setSession] =
		useState<GetLoginResult["currentSession"]>(null);
	const [user, setUser] = useState<GetLoginResult["user"]>(null);

	useEffect(() => {
		setLoading(true);
		getLogin().then(({ user, currentSession }) => {
			setUser(user);
			setSession(currentSession);
			setLoading(false);
		});
	}, []);

	async function handleSignout() {
		setLoading(true);
		signout().then(() => {
			setUser(null);
			setSession(null);
			setLoading(false);
		});
	}

	return (
		<AuthContext.Provider
			value={{ user, session, loading, signout: handleSignout }}
		>
			{children}
		</AuthContext.Provider>
	);
}
