export const dynamic = "force-dynamic";
import { z } from "zod";
import { cookies } from "next/headers";
import { client } from "@db";
import { createSession, oAuthCookieNames, discord } from "@lib/actions";
import type { DiscordSigninCallbackData } from "./types";
import { revalidateTag } from "next/cache";
import { generateIdFromEntropySize } from "lucia";

// validate the query parameters
const validate = z.object({
	code: z.string(),
	state: z.string(),
});

const provider = "discord";
const { state: discordOAuthStateCookie } = oAuthCookieNames.discord;

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
	const { code, state } = v.data satisfies DiscordSigninCallbackData;
	const discordOauthState = cookies().get(discordOAuthStateCookie)?.value;
	if (state !== discordOauthState) {
		return new Response("Invalid state", { status: 400 });
	}
	// remove the state cookie
	cookies().set(discordOAuthStateCookie, "", { expires: new Date(0) });

	// exchange the code for tokens
	const tokens = await discord.validateAuthorizationCode(code);

	// fetch the user data
	let user: { id: string; email: string; username: string };
	try {
		const response = await fetch("https://discord.com/api/users/@me", {
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
			providerUserId: user.id,
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
				username: user.username,
				email: user.email,
			},
		});

		await client.oAuthAccount.create({
			data: {
				providerId: provider,
				providerUserId: user.id,
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