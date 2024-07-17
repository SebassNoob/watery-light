import type { OAuthCookieNames } from "./types";

export enum OAuthProviders {
	discord = "discord",
	google = "google",
	github = "github",
}

export const oAuthCookieNames = {
	discord: {
		state: "discord_oauth_state",
	},
	google: {
		state: "google_oauth_state",
		codeVerifier: "google_oauth_code_verifier",
	},
	github: {
		state: "github_oauth_state",
	},
} satisfies OAuthCookieNames;
