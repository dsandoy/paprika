import { error, json } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';

export async function GET(event) {
	const session = await event.locals.auth();
	if (!session?.user) {
		error(401, 'unauthorized');
	}
	if (!session.user.email)
	{
		error(401, 'this user does not have an email?!');
	}
	const data = await prisma.dish.findMany({
			where: {
				user: session.user.email
			},
			include: {
				ingredients: true,
				image: true
			}
		})
		.catch((err) => {
			error(500, 'something went wrong when collecting data: ' + err);
		});
	return json(data);
}
