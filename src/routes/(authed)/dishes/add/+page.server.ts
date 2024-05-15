import { DishValidator, type ValidationResult } from '$lib/utils.js';
import { redirect } from '@sveltejs/kit';
import type { CreateDish, CreateImage, CreateIngredient } from '$lib/types.js';
import { DishQueries } from '$lib/server/queries.js';
import { checkUser } from '$lib/server/utils.js';

export const load = async (event) => {
	// note that parent fetches dishes...
	const user = await checkUser(event);
	return {
		user: user
	};
};

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		let v: ValidationResult = { is_valid: true, message: '' };

		const dish: CreateDish = {
			name: data.get('name') as string,
			url: data.get('url') as string,
			user: data.get('user') as string,
			ingredients: JSON.parse(data.get('ingredients') as string) as CreateIngredient[]
		};

		const image = data.get('image') as File;
		if (image.size != 0) v = DishValidator.validateImage(image);
		if (!v.is_valid)
			return {
				v: v,
				data: dish
			};

		const dishes = await DishQueries.getMany(data.get('user') as string);

		v = DishValidator.validateName(dish.name, dishes);
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

		redirect(307, '/dishes/add/success');
	}
};
