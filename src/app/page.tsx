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

	return (
		<div className="w-7/8 sm:w-3/4 md:w-5/8 lg:w-1/2 m-auto">
			<PostsPage initialPosts={posts} />
		</div>
	);
}
