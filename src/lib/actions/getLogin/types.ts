import type { User, Session } from "@prisma/client";
export type GetLoginResult =
	| {
			user: User;
			sessions: Session[];
			currentSession: Session;
	  }
	| {
			user: null;
			sessions: null;
			currentSession: null;
	  };
