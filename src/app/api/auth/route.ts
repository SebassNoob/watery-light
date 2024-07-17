import { cookies } from "next/headers";
import { lucia } from "@db";
import type { AuthResult } from "@lib/actions";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
	// grab the session id from the cookies
	const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

	// if there is no session id we are not logged in
	if (!sessionId) {
		return Response.json(
			{
				user: null,
				session: null,
			} satisfies AuthResult,
			{ status: 401 },
		);
	}

	// validate the session id
	const result = (await lucia.validateSession(
		sessionId,
	)) satisfies AuthResult;

	// if the session is fresh (ie cookie previously expired) we need to update the session cookie
	if (result.session?.fresh) {
		const sessionCookie = lucia.createSessionCookie(result.session.id);
		cookies().set(
			sessionCookie.name,
			sessionCookie.value,
			sessionCookie.attributes,
		);
	}
	// if session is invalid we need to clear the cookie
	if (!result.session) {
		const sessionCookie = lucia.createBlankSessionCookie();
		cookies().set(
			sessionCookie.name,
			sessionCookie.value,
			sessionCookie.attributes,
		);
	}

	const response = Response.json(result, { status: 200 });
	return response;
}
