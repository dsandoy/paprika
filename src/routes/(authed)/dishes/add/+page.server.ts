import { get } from 'svelte/store';
import {
	validateName,
	validateURL,
	DATABASE_ERROR,
	NAME_ALREADY_IN_USE,
	NAME_EMPTY,
	URL_INVALID
} from '$lib/utils';
import { page } from '$app/stores';
import { prisma } from '$lib/prisma';

const USER_INVALID = -10;
export const actions = {
	default: async ({ request }) => {
		const user = get(page).data.session?.user?.email;
		if (!user) {
			return {
				error: USER_INVALID,
				message: 'Du må være innlogget for å legge til en matrett'
			};
		}
		const data = request.formData();
		const name = data.get('name');
		const result = validateName(name);
		if (result === NAME_EMPTY) {
			return {
				error: NAME_EMPTY,
				message: 'Du kan ikke ha et tomt navn'
			};
		}
		if (result === NAME_ALREADY_IN_USE) {
			return {
				error: NAME_ALREADY_IN_USE,
				message: 'Du har allerede en matrett med det navnet, kall denne noe annet'
			};
		}

		const url = data.get('url');
		const result2 = validateURL(url);
		if (!result2) {
			return {
				error: URL_INVALID,
				message: 'Oppgi en gyldig URL'
			};
		}
		const dish = {
			name: name,
			url: url,
			user: user
		};
		await prisma.dish
			.create({
				data: dish
			})
			.catch((error) => {
				return {
					error: DATABASE_ERROR,
					message: 'Klarte ikke å opprette matretten i databasen.. Noe gikk galt...' + error
				};
			});

		return {
			success: true
		};
	}
};
