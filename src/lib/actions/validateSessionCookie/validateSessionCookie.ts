"use server";
import "server-only";
import { cookies } from "next/headers";
import { lucia } from "@db";
import type { AuthResult } from "./types";

export async function validateSessionCookie(): Promise<AuthResult> {
	const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
	if (!sessionId) {
		return {
			user: null,
			session: null,
		};
	}

	const result = await lucia.validateSession(sessionId);

	return result;
}
