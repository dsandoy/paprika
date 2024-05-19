import { SvelteKitAuth } from '@auth/sveltekit';
import Google from '@auth/sveltekit/providers/google';
import { AUTH_SECRET, GOOGLE_ID, GOOGLE_SECRET } from '$env/static/private';

export const { handle, signIn, signOut } = SvelteKitAuth(async () => {
	const authOptions = {
		providers: [Google({ clientId: GOOGLE_ID, clientSecret: GOOGLE_SECRET })],
		secret: AUTH_SECRET,
		trustHost: true
	};
	return authOptions;
});
