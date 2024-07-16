export const dynamic = "force-dynamic";
import { z } from "zod";
import { cookies } from "next/headers";
import { client } from "@db";
import { createSession, oAuthCookieNames, google } from "@lib/actions";
import type { GoogleSigninCallbackData } from "./types";
import { revalidateTag } from "next/cache";
import { generateIdFromEntropySize } from "lucia";

// validate the query parameters
const validate = z.object({
	code: z.string(),
	state: z.string(),
});

const provider = "google";
const {
	state: googleOAuthStateCookie,
	codeVerifier: googleOAuthCodeVerifierCookie,
} = oAuthCookieNames.google;

export async function GET(request: Request): Promise<Response> {
	// grab the query params
	const { searchParams } = new URL(request.url);
	const [searchParamCode, searchParamState] = [
		searchParams.get("code"),
		searchParams.get("state"),
	];

	// validate the query params
	const v = validate.safeParse({
		code: searchParamCode,
		state: searchParamState,
	});
	if (!v.success) {
		return new Response("Invalid query parameters", { status: 400 });
	}

	// destructure the query params
	// and check if the state cookie is valid (prevents CSRF)
	const { code, state } = v.data satisfies GoogleSigninCallbackData;

	const googleOauthState = cookies().get(googleOAuthStateCookie)?.value;
	const googleCodeVerifier = cookies().get(
		oAuthCookieNames.google.codeVerifier,
	)?.value;

	// check if the state and code verifier cookie are valid
	if (state !== googleOauthState) {
		return new Response("Invalid state", { status: 400 });
	}
	if (!googleCodeVerifier) {
		return new Response("Invalid code verifier", { status: 400 });
	}

	// clear the cookies
	cookies().set(googleOAuthStateCookie, "", { expires: new Date(0) });
	cookies().set(googleOAuthCodeVerifierCookie, "", {
		expires: new Date(0),
	});

	// exchange the code for tokens
	const tokens = await google.validateAuthorizationCode(
		code,
		googleCodeVerifier,
	);

	// fetch the user data
	let user: { sub: string; email: string; name: string };
	try {
		const response = await fetch(
			"https://openidconnect.googleapis.com/v1/userinfo",
			{
				headers: {
					Authorization: `Bearer ${tokens.accessToken}`,
				},
			},
		);
		user = await response.json();
	} catch (e) {
		return new Response("Failed to fetch user data", { status: 500 });
	}

	// check if the user already has an account
	const account = await client.oAuthAccount.findFirst({
		where: {
			providerId: provider,
			providerUserId: user.sub,
		},
		include: {
			user: true,
		},
	});

	if (account) {
		await createSession(account.userId);
	} else {
		// account does not exist, sign them up

		const userId = generateIdFromEntropySize(10);

		await client.user.create({
			data: {
				id: userId,
				username: user.name,
				email: user.email,
			},
		});

		await client.oAuthAccount.create({
			data: {
				providerId: provider,
				providerUserId: user.sub,
				userId,
			},
		});

		await createSession(userId);
	}

	revalidateTag("auth");

	// redirect to home page
	return new Response(null, {
		status: 302,
		headers: {
			Location: "/",
		},
	});
}
