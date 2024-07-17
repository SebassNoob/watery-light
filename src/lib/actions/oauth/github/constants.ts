import { GitHub } from "arctic";

export const github = new GitHub(
	process.env.GITHUB_OAUTH_CLIENT_ID as string,
	process.env.GITHUB_OAUTH_CLIENT_SECRET as string,
);
