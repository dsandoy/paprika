import {
	validateName,
	validateURL,
	handleIngredients,
	DATABASE_ERROR,
	NAME_ALREADY_IN_USE,
	NAME_EMPTY,
	URL_INVALID
} from '$lib/utils';
import { prisma } from '$lib/prisma';

export const actions = {
	ingredients: async ({request}) => {
		const data = await request.formData();
		const dish = {
			name : data.get('name') as string,
			url : data.get('url') as string,
			user : data.get('user') as string
		}
		return {
		data: dish,
		}
	},
	add: async ({ request }) => {
		const data = await request.formData();
		const user = data.get('user') as string;
		const name = data.get('name') as string;
		const ingredients = handleIngredients(data.get('ingredients') as string | null);
		const url = data.get('url') as string;
		const dish = {
			name: name,
			url: url,
			user: user,
			ingredients:ingredients,
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

		await prisma.dish
			.create({
				data: {
					name: dish.name,
					url: dish.url,
					user: dish.user,
					ingredients: { create: dish.ingredients },
				},},).catch((err) => {
					return {
						error: DATABASE_ERROR,
						message: 'Noe gikk galt med databasen. Prøv igjen'+err,
						data: dish
					};
				});

		return {
			success: true
		};
	}
};
