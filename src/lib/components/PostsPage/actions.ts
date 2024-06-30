"use server";
import { zfd } from "zod-form-data";
import { validateForm } from "@utils/validateForm";
import { client } from "@db";
import type { User } from "@prisma/client";

const postFormSchema = zfd.formData({
	message: zfd.text(),
});

export async function createPost(author: User, formData: FormData) {
	const result = validateForm(postFormSchema, formData);
	if (!result.isValid) {
		throw new Error("Invalid form data");
	}
	const {
		parsedData: { message },
	} = result;

	const post = await client.post.create({
		data: {
			message,
			authorId: author.id,
		},
		include: {
			author: true,
		},
	});
	return post;
}
