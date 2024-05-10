import { DishValidator, type ValidationResult } from '$lib/utils.js';
import { redirect } from '@sveltejs/kit';
import { DemoData } from '../../../demodata.js';
import type { ClientDish } from '$lib/types.js';
import { DishQueries } from '$lib/server/queries.js';
import { checkUser, handleIngredients } from '$lib/server/utils.js';
import { DBService } from '$lib/Firebase.js';

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

		const dish = {
			name: data.get('name'),
			url: data.get('url'),
			user: data.get('user') as string
		} as ClientDish;

		const image = data.get('image') as File;
		console.log('IMAGE:');
		console.log(image);
		if (image.size != 0) v = DishValidator.validateImage(image);
		if (!v.is_valid)
			return {
				v: v,
				data: dish
			};

		const ingredients = handleIngredients(data.get('ingredients') as string);
		dish.ingredients = ingredients;

		// const dishes = await DishQueries.getMany({ all: true });
		const dishes = DemoData.dishes;

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

		// try {
		if (image) {
			const url = await DBService.uploadImage(image);
			console.log('URL of uploaded image!', url);
			dish.image = url;
		}
		// } catch (error) {
		// console.error(error);
		// }

		await DishQueries.create(dish);

		redirect(307, '/dishes/add/success');
	}
};
