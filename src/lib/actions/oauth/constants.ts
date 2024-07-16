import type { OAuthCookieNames } from "./types";

export enum OAuthProviders {
	discord = "discord",
	google = "google",
}

export const oAuthCookieNames = {
	discord: {
		state: "discord_oauth_state",
	},
	google: {
		state: "google_oauth_state",
		codeVerifier: "google_oauth_code_verifier",
	},
} satisfies OAuthCookieNames;
