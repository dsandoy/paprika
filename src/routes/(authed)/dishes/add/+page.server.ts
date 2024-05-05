import { DishValidator, type ValidationResult } from '$lib/utils.js';
import type { Dish } from '@prisma/client';
import { redirect } from '@sveltejs/kit';
import { DemoData } from '../../../demodata.js';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		let v: ValidationResult = { is_valid: true, message: '' };

		const dish = {
			name: data.get('name'),
			url: data.get('url')
		} as Dish;
		const image = data.get('image') as File;
		if (image.size != 0) v = DishValidator.validateImage(image);
		if (!v.is_valid)
			return {
				v: v,
				data: dish
			};

		const ingredients = data.get('ingredients');
		console.log(ingredients);
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
		redirect(307, '/dishes/add/success');
	}
};
