<script lang="ts">
	import { goto } from '$app/navigation';
	import BottomCircles from '$lib/components/BottomCircles.svelte';
	import Button from '$lib/components/Button.svelte';
	import SecondaryButton from '$lib/components/SecondaryButton.svelte';
	import { auth, googleProvider } from '$lib/Firebase';
	import { user } from '$lib/stores';
	import { getRedirectResult, signInWithRedirect } from 'firebase/auth';
	import { onMount } from 'svelte';

	onMount(() => {
		getRedirectResult(auth).then((result) => {
			if (result) {
				user.set(result.user);
				goto('/dishes');
			}
		});
	});

	/** Sign in through firebase with Google */
	async function SignInWithGoogle() {
		await signInWithRedirect(auth, googleProvider);
	}

	/** If the user is logged in, redirect to the dishes page */
	$: if ($user) window.location.href = '/dishes';
</script>

<section
	class="h-svh flex flex-col items-center justify-start gap-4 bg-gradient-to-tl from-red/20 to-green/30 via-white"
>
	<img class="h-44 lg:h-52 mt-56" src="logo-red.svg" alt="Logo img" />
	<h1 class="text-2xl">Velkommen til Paprika</h1>
	<p class="text-base lg:text-lg w-[66%] text-center">
		Ta kontroll over hva du skal ha til middag! Logg inn og sett i gang!
	</p>
	<SecondaryButton
		on:click={() => SignInWithGoogle()}
		type="button"
		classNames="flex flex-row w-56 h-12 lg:w-64 lg:h-14 justify-center items-center gap-3 lg:text-lg"
	>
		<img src="google-logo.png" alt="Google logo" class="h-6" />
		Logg inn
	</SecondaryButton>
	<!-- <a href="/dishes"><PrimaryButton>Til middager</PrimaryButton></a> -->
	<div>
		<p class="text-sm">Google innlogging funker ikke?</p>
	</div>
	<Button
		classNames="bg-nice-blue rounded-lg text-white text-sm p-2 hover:bg-white hover:border-green hover:text-black hover:border-[1px]"
	>
		<a href="/login-email">Logg inn med epost</a>
	</Button>

	<BottomCircles />
</section>
