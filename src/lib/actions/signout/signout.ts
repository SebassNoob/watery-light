"use server";
import { lucia } from "@db";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import type { SignoutResult } from "./types";

export async function signout(): Promise<SignoutResult> {
	const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
	if (!sessionId) {
		return {
			success: false,
			error: "You are not signed in",
		};
	}

	await lucia.invalidateSession(sessionId);

	const sessionCookie = lucia.createBlankSessionCookie();
	cookies().set(
		sessionCookie.name,
		sessionCookie.value,
		sessionCookie.attributes,
	);

	revalidateTag("auth");
	return {
		success: true,
	};
}
