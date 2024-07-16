"use server";
import { generateState, generateCodeVerifier } from "arctic";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { google } from "./constants";
import { oAuthCookieNames } from "@lib/actions/oauth";

export const googleSignin = async () => {
	const state = generateState();
	const codeVerifier = generateCodeVerifier();

	const url = await google.createAuthorizationURL(state, codeVerifier, {
		scopes: ["profile", "email"],
	});

	cookies().set(oAuthCookieNames.google.state, state, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production", // set `Secure` flag in HTTPS
		maxAge: 60 * 10, // 10 minutes
		path: "/",
	});

	cookies().set(oAuthCookieNames.google.codeVerifier, codeVerifier, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production", // set `Secure` flag in HTTPS
		maxAge: 60 * 10, // 10 minutes
		path: "/",
	});

	return redirect(url.toString());
};
