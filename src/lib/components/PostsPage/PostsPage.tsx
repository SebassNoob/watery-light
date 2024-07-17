"use client";
import { useOptimistic, useState, useContext, useEffect } from "react";
import { AuthContext } from "@lib/providers";
import type { PostsPageProps, PostWithAuthor } from "./types";
import { SubmitForm, Post } from "@lib/components";
import { createPost } from "./actions";
import { toast } from "react-toastify";
import { useSearchParams, useRouter } from "next/navigation";

export function PostsPage({ initialPosts }: PostsPageProps) {
	const searchParams = useSearchParams();
	const router = useRouter();

	useEffect(() => {
		if (searchParams.has("authenticated")) {
			toast.success("Successfully authenticated!");
			// remove the query param
			router.replace("/", undefined);
		}
	}, []);

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
		try {
			const returned = await createPost(user, formData);
			setPosts(prev => [returned, ...prev]);
		} catch (e) {
			toast.error("Failed to create post");
		}
	};

	return (
		<div className="w-7/8 sm:w-3/4 md:w-5/8 lg:w-1/2 m-auto">
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
		</div>
	);
}
