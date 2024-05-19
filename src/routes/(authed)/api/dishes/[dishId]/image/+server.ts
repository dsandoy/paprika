import prisma from '$lib/prisma';
import { error } from '@sveltejs/kit';

export const GET = async ({ params, setHeaders }) => {
	if (!params.dishId) {
		error(404, 'Dish not found');
	}

	const image = await prisma.image.findUnique({
		where: {
			dishId: parseInt(params.dishId)
		}
	});

	if (!image || !image.data) {
		error(404, 'Image not found in the database...');
	}

	const imageBlob = new Blob([image.data], { type: image.type });

	setHeaders({
		'Content-Type': image.type,
		'Content-Length': image.size.toString(),
		'Last-Modified': new Date(image.lastModified).toUTCString(),
		'Cache-Control': 'public, max-age=31536000, immutable'
	});

	return new Response(imageBlob, {
		status: 200
	});
};
