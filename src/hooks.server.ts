import {
	redirect,
	type Handle,
	type MaybePromise,
	type RequestEvent,
	type ResolveOptions
} from '@sveltejs/kit';
import { handle as authenticationHandle } from '$lib/auth';
import { sequence } from '@sveltejs/kit/hooks';
import { AUTH_REQUIRED_URLS } from '$lib/urls';

async function authorizationHandle({
	event,
	resolve
}: {
	event: RequestEvent;
	resolve: (event: RequestEvent, opts?: ResolveOptions) => MaybePromise<Response>;
}): Promise<Response> {
	// Protect any routes under /api
	for (const path of AUTH_REQUIRED_URLS) {
		if (event.url.pathname.startsWith(path)) {
			const session = await event.locals.auth();
			if (!session) {
				// Redirect to the signin page
				throw redirect(303, '/login');
			}
		}
	}

	// If the request is still here, just proceed as normally
	return resolve(event);
}

// First handle authentication, then authorization
// Each function acts as a middleware, receiving the request handle
// And returning a handle which gets passed to the next function
export const handle: Handle = sequence(authenticationHandle, authorizationHandle);
