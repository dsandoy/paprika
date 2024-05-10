import type { User } from '@auth/sveltekit';
import { error, type RequestEvent } from '@sveltejs/kit';

/** used in server to verify that a user is logged in. Will throw errors if not.
 * @return the logged in user if it exists
 * @example
 * ```ts
 * export const load = async (event) =>  {
 *  const user = await checkUser(event);
 *  const data = await prisma.dishes.findMany({ where: { user: user.email } });
 * ...
 * }
 * ```
 */
export async function checkUser(event: RequestEvent) {
	const session = await event.locals.auth();
	if (!session?.user) {
		error(401, 'unauthorized');
	}
	if (!session.user.email) {
		error(401, 'this user does not have an email?!');
	}
	return session.user as User;
}

/** Handle the comma separated list of ingredients and returns ingredient array*/
export function handleIngredients(ingredients: string | null): string[] {
	if (ingredients === null) {
		return [];
	}
	const arr = ingredients.split(',');
	return arr;
}

export function getEmail(user: User | null) {
	if (!user || !user.email) {
		return;
	}
	return user.email;
}
