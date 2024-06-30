import type { Post, User } from "@prisma/client";

export interface PostsPageProps {
	initialPosts: (Post & { author: { username: string } })[];
}

export type PostWithAuthor = Post & { author: User };
