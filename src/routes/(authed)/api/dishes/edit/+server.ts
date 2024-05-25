import type { EditDishBody } from '$lib/api';
import { DishQueries } from '$lib/server/queries';
import type { CreateIngredient, UpdateDish, UpdateImage, UpdateIngredient } from '$lib/types';
import { DishValidator, type ValidationResult } from '$lib/utils';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const formData = await request.formData();
	const data: EditDishBody = {
		id: parseInt(formData.get('id') as string),
		name: formData.get('name') as string,
		email: formData.get('email') as string,
		url: formData.get('url') as string,
		ingredients: JSON.parse(formData.get('ingredients') as string) as UpdateIngredient[],
		image: formData.get('image') as File | undefined
	};

	if (!data.email) {
		return new Response(
			JSON.stringify({
				va: {
					is_valid: false,
					message: 'A valid user is required to access this endpoint'
				}
			})
		);
	}
	let v: ValidationResult = { is_valid: true, message: '' };

	const dish: UpdateDish = {
		id: data.id,
		name: data.name,
		url: data.url,
		ingredients: data.ingredients
	};

	if (dish.ingredients && dish.ingredients.length > 0) {
		const processedIngredients: CreateIngredient[] = [];
		for (const ingredient of dish.ingredients) {
			processedIngredients.push({
				value: ingredient.value
			});
		}
		dish.ingredients = processedIngredients;
	}

	const image = data.image;
	if (image && image !== undefined && image.size != 0) v = DishValidator.validateImage(image);
	if (!v.is_valid)
		return new Response(
			JSON.stringify({
				va: v
			})
		);

	v = DishValidator.validateName(dish.name);
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

	try {
		let imagePr: UpdateImage | undefined = undefined;
		if (image instanceof File) {
			if (image.size !== 0) {
				const ciArray = await image?.arrayBuffer();
				const ciBuffer = Buffer.from(ciArray);

				imagePr = {
					name: image.name,
					size: image.size,
					type: image.type,
					lastModified: image.lastModified,
					data: ciBuffer
				};
			}
			if (imagePr) dish.image = imagePr;
		}
		await DishQueries.update(dish);
		return new Response(
			JSON.stringify({
				va: {
					is_valid: true,
					message: 'Success'
				}
			})
		);
	} catch (error) {
		console.error(error);
		let message = 'Database Error!';
		if (error instanceof Error || (typeof error === 'object' && error?.constructor === Error)) {
			message = 'Database Error: ' + error.name;
		}
		return new Response(
			JSON.stringify({
				va: {
					is_valid: false,
					message: message
				}
			})
		);
	}
};
