import { error } from '@sveltejs/kit';

export const GET = async ({ params }) => {
	if (!params.dishId) {
		error(404, 'Dish not found');
	}

	const imageId = parseInt(params.imageId);
	if (!imageId) {
		error(404, 'Image not found');
	}

	return new Response('To be implemented', {
		status: 200
	});
};
