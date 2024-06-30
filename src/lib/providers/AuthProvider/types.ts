import type { User, Session } from "@prisma/client";

export interface AuthContextProps {
	user: User | null;
	session: Session | null;
	loading: boolean;
	signout: () => void;
}

export interface AuthProviderProps {
	children: React.ReactNode;
}
