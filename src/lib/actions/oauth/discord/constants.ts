import { Discord } from "arctic";

export const discord = new Discord(
	process.env.DISCORD_OAUTH_CLIENT_ID as string,
	process.env.DISCORD_OAUTH_CLIENT_SECRET as string,
	process.env.DISCORD_OAUTH_REDIRECT_URI as string,
);
