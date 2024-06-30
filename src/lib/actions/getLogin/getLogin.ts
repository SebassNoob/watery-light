"use server";
import { cookies } from "next/headers";
import { cache } from "react";
import { lucia, client } from "@db";
import type { GetLoginResult } from "./types";

export const getLogin = cache(async (): Promise<GetLoginResult> => {
	// grab the session id from the cookies
	const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

	// if there is no session id we are not logged in
	if (!sessionId) {
		return {
			user: null,
			sessions: null,
			currentSession: null,
		};
	}

	// from the database, get the user associated with the session
	const user = await client.user.findFirst({
		where: {
			sessions: {
				some: {
					id: sessionId,
				},
			},
		},
		include: {
			sessions: true,
		},
	});

	if (!user) {
		return {
			user: null,
			sessions: null,
			currentSession: null,
		};
	}

	return {
		user,
		sessions: user.sessions,
		currentSession: user.sessions.find(
			session => session.id === sessionId,
		)!,
	};
});
