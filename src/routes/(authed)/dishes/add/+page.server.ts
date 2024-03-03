import {
	validateName,
	validateURL,
	handleIngredients,
	DATABASE_ERROR,
	NAME_ALREADY_IN_USE,
	NAME_EMPTY,
	URL_INVALID,
} from '$lib/utils';
import { prisma } from '$lib/prisma';
import { redirect } from '@sveltejs/kit';
import type { CustomImage } from '$lib/types.js';

export const actions = {
	add: async ({ request }) => {
		const data = await request.formData();
		const user = data.get('user') as string;
		const name = data.get('name') as string;
		const ingredients = handleIngredients(data.get('ingredients') as string | null);
		const url = data.get('url') as string;
		const customImage = data.get('image') as File | null;
		const dish = {
			name: name,
			url: url,
			user: user,
			ingredients:ingredients,
			customImage: customImage,
		};
		const result = validateName(name);
		if (result === NAME_EMPTY) {
			return {
				error: NAME_EMPTY,
				message: 'Oppgi et navn',
				data: dish
			};
		}
		if (result === NAME_ALREADY_IN_USE) {
			return {
				error: NAME_ALREADY_IN_USE,
				message: 'Du har allerede en matrett med det navnet, kall denne noe annet',
				data: dish
			};
		}

		const result2 = validateURL(url);
		if (!result2) {
			return {
				error: URL_INVALID,
				message: 'Oppgi en gyldig URL',
				data: dish
			};
		}

		let customImageProcessed : CustomImage | null = null;
		if (customImage instanceof File) {
			const ciArray = await customImage?.arrayBuffer();
			const ciBuffer = ciArray ? Buffer.from(ciArray) : null;

			customImageProcessed = {
				name: customImage.name,
				size: customImage.size,
				type: customImage.type,
				lastModified: customImage.lastModified,
				data: ciBuffer,
			}
		}

		const myDish = await prisma.dish
			.create({
				data: {
					name: dish.name,
					url: dish.url,
					user: dish.user,
					ingredients: { create: dish.ingredients },
					customImage: customImageProcessed ?  { create: customImageProcessed } : undefined,
					},},).catch((err) => {
					return {
						error: DATABASE_ERROR,
						message: 'Noe gikk galt med databasen. Prøv igjen'+err,
						data: dish
					};
				});
		console.log('dish added');
		console.log(myDish);

		redirect(302, '/dishes/add/success');
	}
};
