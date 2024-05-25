import { DishQueries } from '$lib/server/queries';
import type { CreateDish, CreateImage } from '$lib/types';
import { DishValidator, type ValidationResult } from '$lib/utils';
import { type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }): Promise<Response> => {
	const formData = await request.formData();
	const name = formData.get('name') as string;
	const url = formData.get('url') as string;
	const ingredients = JSON.parse(
		formData.get('ingredients') as string
	) as CreateDish['ingredients'];
	const email = formData.get('email') as string;
	const image = formData.get('image') as File;

	let v: ValidationResult = {
		is_valid: true,
		message: ''
	};
	const dish: CreateDish = {
		name: name,
		url: url,
		user: email,
		ingredients: ingredients
	};
	if (image && image.size != 0) v = DishValidator.validateImage(image);
	if (!v.is_valid)
		return new Response(
			JSON.stringify({
				va: v
			})
		);
	const dishes = await DishQueries.getMany(email);

	v = DishValidator.validateName(dish.name, dishes);
	if (!v.is_valid)
		return new Response(
			JSON.stringify({
				va: v
			})
		);
	v = DishValidator.validateURL(dish.url);
	if (!v.is_valid)
		return new Response(
			JSON.stringify({
				va: v
			})
		);

	let imagePr: CreateImage | null = null;
	if (image instanceof File) {
		const ciArray = await image?.arrayBuffer();
		const ciBuffer = Buffer.from(ciArray);

		imagePr = {
			name: image.name,
			size: image.size,
			type: image.type,
			lastModified: image.lastModified,
			data: ciBuffer
		};
		dish.image = imagePr;
	}
	await DishQueries.create(dish);
	return new Response(
		JSON.stringify({
			va: {
				is_valid: true,
				message: ''
			}
		})
	);
};
