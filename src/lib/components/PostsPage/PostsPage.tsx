"use client";
import { useOptimistic, useState, useContext } from "react";
import { AuthContext } from "@lib/providers";
import type { PostsPageProps, PostWithAuthor } from "./types";
import { SubmitForm, Post } from "@lib/components";
import { createPost } from "./actions";

export function PostsPage({ initialPosts }: PostsPageProps) {
	const [posts, setPosts] = useState(initialPosts);
	const [optimisticPosts, addOptimisticPost] = useOptimistic(
		posts.map(post => ({ ...post, loading: false })),
		(state, newPost: PostWithAuthor) => [
			{ ...newPost, loading: true },
			...state,
		],
	);

	const { user, loading: userLoading } = useContext(AuthContext);
	if (userLoading) {
		return (
			<div className="w-full h-screen animate-pulse bg-slate-200 dark:bg-slate-800 rounded-md" />
		);
	}

	const handleOptimisticUpdate = async (formData: FormData) => {
		if (!user) {
			throw new Error("User is not authenticated");
		}
		addOptimisticPost({
			id: Math.random().toString(),
			message: formData.get("message") as string,
			createdAt: new Date(),
			authorId: user.id,
			author: user,
		});
		const returned = await createPost(user, formData);
		setPosts(prev => [returned, ...prev]);
	};

	return (
		<>
			<section>
				<SubmitForm action={handleOptimisticUpdate} />
			</section>
			<section>
				{optimisticPosts.map(post => (
					<Post
						key={post.id}
						message={post.message}
						username={post.author.username}
						createdAt={post.createdAt}
						pending={post.loading}
					/>
				))}
			</section>
		</>
	);
}
