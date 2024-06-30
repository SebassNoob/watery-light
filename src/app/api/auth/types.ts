import type { Session as LuciaSession, User as LuciaUser } from "lucia";

export type AuthResult =
	| {
			user: LuciaUser;
			session: LuciaSession;
	  }
	| {
			user: null;
			session: null;
	  };
