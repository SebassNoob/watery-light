import { NextResponse, type NextRequest } from "next/server";
import type { Session as LuciaSession, User as LuciaUser } from "lucia";

const apiUrl = process.env.API_URL;

if (!apiUrl) {
	throw new Error("API_URL is not defined");
}

type AuthResult =
	| {
			user: LuciaUser;
			session: LuciaSession;
	  }
	| {
			user: null;
			session: null;
	  };

export async function middleware(request: NextRequest) {
	// https://github.com/vercel/next.js/discussions/46722
	const authResponse = await fetch(`${apiUrl}/auth`, {
		next: { tags: ["auth"] },
		cache: "force-cache",
		headers: {
			cookie: request.headers.get("cookie") ?? "",
		},
	});

	const parsed = (await authResponse.json()) as AuthResult;

	return NextResponse.next({
		headers: {
			"Set-Cookie": authResponse.headers.get("Set-Cookie") ?? "",
		},
	});
}

export const config = {
	matcher: ["/"],
};
