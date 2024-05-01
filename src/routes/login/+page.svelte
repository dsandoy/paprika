<script lang="ts">
	import { goto } from '$app/navigation';
	import BottomCircles from '$lib/components/BottomCircles.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import SecondaryButton from '$lib/components/SecondaryButton.svelte';
	import { auth } from '$lib/Firebase';
	import { user } from '$lib/stores';
	import { signInWithEmailAndPassword } from 'firebase/auth';

	let email = '';
	let password = '';
	let errorMessage = '';
	let loading = false;

	function signIn() {
		loading = true;
		if (email === '' || password === '') {
			errorMessage = 'Du må fylle ut epost og passord';
			loading = false;
			return;
		}
		signInWithEmailAndPassword(auth, email, password)
			.then((result) => {
				user.set(result.user);
				goto('/dashboard');
			})
			.catch(() => {
				errorMessage = 'Ugyldig epost eller passord';
				errorMessage = errorMessage;
			});
		loading = false;
	}

	function resetErrorMessage() {
		errorMessage = '';
		errorMessage = errorMessage;
	}
</script>

<main
	class="absolute top-0 bottom-0 right-0 left-0 bg-gradient-to-tl from-red/20 to-green/30 via-white flex flex-col items-center justify-center gap-4"
>
	<img class="h-44 lg:h-52" src="logo-red.svg" alt="Logo img" />
	<h1 class="text-2xl">Velkommen til Paprika</h1>
	<form class="w-[23rem] flex flex-col items-center justify-center">
		<input
			type="email"
			placeholder="Epost"
			bind:value={email}
			class="input"
			required
			on:change={resetErrorMessage}
		/>
		<input
			type="password"
			placeholder="Passord"
			bind:value={password}
			class="input"
			required
			on:change={resetErrorMessage}
		/>
		{#if errorMessage}
			<div class="text-red">
				{errorMessage}
			</div>
		{/if}

		<SecondaryButton
			on:click={() => signIn()}
			classNames="flex flex-row w-32 h-10 lg:w-40 lg:h-12 justify-center items-center gap-3 lg:text-lg"
		>
			<Loading bind:loading>Logg inn</Loading>
		</SecondaryButton>
	</form>

	<BottomCircles />
</main>
