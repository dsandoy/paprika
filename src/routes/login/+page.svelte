<script lang="ts">
	import { goto } from '$app/navigation';
	import BottomCircles from '$lib/components/BottomCircles.svelte';
	import Icons from '$lib/components/Icons.svelte';
	import PrimaryButton from '$lib/components/PrimaryButton.svelte';
	import SecondaryButton from '$lib/components/SecondaryButton.svelte';
	import { auth, googleProvider } from '$lib/Firebase';
	import { user } from '$lib/stores';
	import { getRedirectResult, signInWithRedirect } from 'firebase/auth';
	import { onMount } from 'svelte';

	onMount(() => {
		getRedirectResult(auth).then((result) => {
			if (result) {
				user.set(result.user);
				goto('/dashboard');
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
	<img class="h-44 lg:h-52 lg:mt-56 mt-16" src="logo-red.svg" alt="Logo img" />
	<h1 class="text-2xl">Velkommen til Paprika</h1>
	<p class="text-base lg:text-lg w-[66%] text-center">
		Ta kontroll over hva du skal ha til middag! Logg inn og sett i gang!
	</p>
	<SecondaryButton
		on:click={() => SignInWithGoogle()}
		type="button"
		classNames="flex flex-row w-56 h-12 lg:w-64 lg:h-14 justify-center text-sm items-center gap-3 lg:text-lg"
	>
		<img src="google-logo.png" alt="Google logo" class="h-6" />
		Logg inn med Google
	</SecondaryButton>
	<!-- <a href="/dishes"><PrimaryButton>Til middager</PrimaryButton></a> -->
	<div>
		<p class="text-sm">Eller:</p>
	</div>
	<PrimaryButton classNames="p-2 w-56 h-12 lg:w-64 lg:h-14 text-sm lg:text-lg flex gap-3 ">
		<Icons iconName="zondicons:envelope" height="1.5rem" classNames="" />
		<a href="/login-email">Logg inn med epost</a>
	</PrimaryButton>

	<BottomCircles />
</section>
