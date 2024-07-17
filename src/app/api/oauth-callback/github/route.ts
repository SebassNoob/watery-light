export const dynamic = "force-dynamic";
import { z } from "zod";
import { validateUrlParams } from "@utils/validateUrlParams";
import { cookies } from "next/headers";
import { client } from "@db";
import {
	createSession,
	oAuthCookieNames,
	github,
	OAuthProviders,
} from "@lib/actions";
import type { DiscordSigninCallbackData } from "./types";
import { revalidateTag } from "next/cache";
import { generateIdFromEntropySize } from "lucia";
import type { GitHubTokens } from "arctic";

// validate the query parameters
const validate = z.object({
	code: z.string(),
	state: z.string(),
});

const provider = OAuthProviders.github;
const { state: githubOAuthStateCookie } = oAuthCookieNames.github;

export async function GET(request: Request): Promise<Response> {
	const data = validateUrlParams(validate, new URL(request.url));
	if (!data) {
		return new Response("Invalid query params", { status: 400 });
	}

	// destructure the query params
	// and check if the state cookie is valid (prevents CSRF)
	const { code, state } = data satisfies DiscordSigninCallbackData;
	const githubOauthState = cookies().get(githubOAuthStateCookie)?.value;
	if (state !== githubOauthState) {
		return new Response("Invalid state", { status: 400 });
	}
	// remove the state cookie
	cookies().set(githubOAuthStateCookie, "", { expires: new Date(0) });

	// exchange the code for tokens
	let tokens: GitHubTokens;
	try {
		tokens = await github.validateAuthorizationCode(code);
	} catch (e) {
		return new Response("Failed to validate authorization code", {
			status: 500,
		});
	}

	// fetch the user data
	let user: { id: number; email: string; login: string };
	try {
		const response = await fetch("https://api.github.com/user", {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`,
			},
		});
		user = await response.json();
	} catch (e) {
		return new Response("Failed to fetch user data", { status: 500 });
	}

	// check if the user already has an account
	const account = await client.oAuthAccount.findFirst({
		where: {
			providerId: provider,
			providerUserId: user.id.toString(),
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
				username: user.login,
				email: user.email,
			},
		});

		await client.oAuthAccount.create({
			data: {
				providerId: provider,
				providerUserId: user.id.toString(),
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
			Location: "/?authenticated=true",
		},
	});
}
