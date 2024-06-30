"use server";
import { generateState } from "arctic";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { discord } from "./constants";
import { oAuthCookieNames } from "@lib/actions/oauth";

export const discordSignin = async () => {
	const state = generateState();

	const url = await discord.createAuthorizationURL(state, {
		scopes: ["identify", "email"],
	});

	cookies().set(oAuthCookieNames.discord.state, state, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production", // set `Secure` flag in HTTPS
		maxAge: 60 * 10, // 10 minutes
		path: "/",
	});

	return redirect(url.toString());
};
