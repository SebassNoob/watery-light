"use server";
import { generateState } from "arctic";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { github } from "./constants";
import { oAuthCookieNames } from "@lib/actions/oauth";

export const githubSignin = async () => {
	const state = generateState();

	const url = await github.createAuthorizationURL(state, {
		scopes: ["user:email"],
	});

	cookies().set(oAuthCookieNames.github.state, state, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production", // set `Secure` flag in HTTPS
		maxAge: 60 * 10, // 10 minutes
		path: "/",
	});

	return redirect(url.toString());
};
