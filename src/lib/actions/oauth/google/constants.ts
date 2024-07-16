import { Google } from "arctic";

export const google = new Google(
	process.env.GOOGLE_OAUTH_CLIENT_ID as string,
	process.env.GOOGLE_OAUTH_CLIENT_SECRET as string,
	process.env.GOOGLE_OAUTH_REDIRECT_URI as string,
);
