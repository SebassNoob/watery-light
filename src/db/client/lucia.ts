import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import client from "./prisma";

const adapter = new PrismaAdapter(client.session, client.user);

const lucia = new Lucia(adapter, {
	sessionCookie: {
		expires: false,
		attributes: {
			// set to `true` when using HTTPS
			secure: process.env.NODE_ENV === "production",
		},
	},
});

export default lucia;

declare module "lucia" {
	interface Register {
		// biome-ignore lint: these are internals of Lucia typings
		Lucia: typeof lucia;
	}
}
