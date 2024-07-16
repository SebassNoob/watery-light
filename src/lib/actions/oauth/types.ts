import type { OAuthProviders } from "./constants";

export type OAuthCookieNames = {
	[K in OAuthProviders]: {
		state: string;
		codeVerifier?: string;
	};
};

export type OAuthData = {
	username: string;
};

export type OAuthErrors = Partial<Record<keyof OAuthData, string[]>>;
