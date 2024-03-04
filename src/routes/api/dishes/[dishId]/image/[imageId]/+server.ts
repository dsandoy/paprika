import { prisma } from '$lib/prisma.js';
import { error } from '@sveltejs/kit';

export const GET = async ({ params, setHeaders }) => {
	if (!params.dishId) {
		error(404, 'Dish not found');
	}

	const imageId = parseInt(params.imageId);
	if (!imageId) {
		error(404, 'Image not found');
	}

	const image = await prisma.customImage.findUnique({
		where: {
			id: imageId
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
		'Cache-Control': 'public, max-age=600'
	});

	return new Response(imageBlob, {
		status: 200
	});
};
