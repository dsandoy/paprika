import { DishQueries } from '$lib/server/queries.js';
import { IngredientConverter } from '$lib/server/utils.js';
import { ingredients } from '$lib/stores.js';
import { DishValidator, type ValidationResult } from '$lib/utils';
import type { Dish, Image, Ingredient } from '@prisma/client';
import { error, redirect } from '@sveltejs/kit';

export const load = async ({ params, parent }) => {
	const { user } = await parent();
	try {
		const dish = await DishQueries.getById(parseInt(params.slug as string), user?.email);
		return {
			dish: dish
		};
	} catch (e) {
		console.error(e);
		throw error(404, 'Page not found');
	}
};

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		let v: ValidationResult = { is_valid: true, message: '' };

		const dish = {
			id: parseInt(data.get('id') as string),
			name: data.get('name') as string,
			url: data.get('url') as string,
			user: data.get('user') as string,
			ingredients: JSON.parse(data.get('ingredients') as Ingredient[])
		};

		console.log('Yo! Pay attention:');
		console.log('ingredients:', dish.ingredients[0]);

		const image = data.get('image') as File;
		if (image.size != 0) v = DishValidator.validateImage(image);
		if (!v.is_valid)
			return {
				v: v,
				data: dish
			};

		v = DishValidator.validateName(dish.name);
		if (!v.is_valid)
			return {
				v: v,
				data: dish
			};

		v = DishValidator.validateURL(dish.url);
		if (!v.is_valid)
			return {
				v: v,
				data: dish
			};

		try {
			let imagePr: Omit<Image, 'id'> | null = null;
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
			}

			const dbDish: Dish = {
				id: dish.id,
				name: dish.name,
				url: dish.url,
				user: dish.user,
				ingredients: dish.ingredients
			};
			if (imagePr) {
				dbDish.image = imagePr;
			}
			await DishQueries.update(dbDish);
		} catch (error) {
			console.error(error as Error);
			return {
				data: dish,
				v: {
					is_valid: false,
					message: 'Database Error: ' + error.name
				}
			};
		}

		redirect(307, '/dishes/');
	}
};
