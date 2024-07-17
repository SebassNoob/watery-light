import { client } from "@db";
import { PostsPage } from "@lib/components";

export default async function Home() {
	const posts = await client.post.findMany({
		include: {
			author: {
				select: {
					username: true,
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	return <PostsPage initialPosts={posts} />;
}
