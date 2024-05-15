import { DishQueries } from '$lib/server/queries.js';
import type { UpdateDish, UpdateImage, UpdateIngredient } from '$lib/types.js';
import { DishValidator, type ValidationResult } from '$lib/utils';
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
	edit: async ({ request }) => {
		const data = await request.formData();
		let v: ValidationResult = { is_valid: true, message: '' };

		// TODO: Ensure that ingredients dont have IDs...

		const dish: UpdateDish = {
			id: parseInt(data.get('id') as string),
			name: data.get('name') as string,
			url: data.get('url') as string,
			ingredients: JSON.parse(data.get('ingredients') as string) as UpdateIngredient[]
		};

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
		} catch (error) {
			console.error(error);
			let message = 'Database Error';
			if (error instanceof Error || (typeof error === 'object' && error?.constructor === Error)) {
				message = 'Database Error: ' + error.name;
			}
			return {
				data: dish,
				v: {
					is_valid: false,
					message: message
				}
			};
		}

		redirect(307, '/dishes/');
	},

	delete: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id') as string;
		try {
			await DishQueries.delete(parseInt(id));
			redirect(307, '/dishes/');
		} catch (e) {
			console.error(e);
			return {
				v: {
					is_valid: false,
					message: 'Failed to delete dish'
				}
			};
		}
	}
};
