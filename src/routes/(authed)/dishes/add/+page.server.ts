import { validateName, validateURL, handleIngredients, URL_INVALID } from '$lib/utils';
import { redirect } from '@sveltejs/kit';
import type { CustomImage } from '$lib/types';

export const actions = {
	add: async ({ request }) => {
		const data = await request.formData();
		const user = data.get('user') as string;
		const name = data.get('name') as string;
		const ingredients = handleIngredients(data.get('ingredients') as string | null);
		const url = data.get('url') as string;
		const customImage = data.get('image') as File;
		/** the data passed back to the user if the form fails */
		const dish = {
			name: name,
			url: url,
			user: user,
			ingredients: ingredients
		};
		const result = validateName(name);
		if (result !== 0) {
			return {
				error: 1,
				message: 'Navnet er ikke gyldig, det er enten tomt eller finnes allerede',
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

		let customImageProcessed: CustomImage | null = null;
		if (customImage.size > 0) {
			const ciArray = await customImage?.arrayBuffer();
			const ciBuffer = Buffer.from(ciArray);

			customImageProcessed = {
				name: customImage.name,
				size: customImage.size,
				type: customImage.type,
				lastModified: customImage.lastModified,
				data: ciBuffer
			};
		}

		redirect(302, '/dishes/add/success');
	}
};
