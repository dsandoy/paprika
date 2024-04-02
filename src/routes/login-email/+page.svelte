<script lang="ts">
	import { goto } from '$app/navigation';
	import BottomCircles from '$lib/components/BottomCircles.svelte';
	import SecondaryButton from '$lib/components/SecondaryButton.svelte';
	import { auth } from '$lib/Firebase';
	import { user } from '$lib/stores';
	import { signInWithEmailAndPassword } from 'firebase/auth';

	let email = '';
	let password = '';
	let errorMessage = '';

	function signIn() {
		if (email === '' || password === '') {
			errorMessage = 'Du må fylle ut epost og passord';
			return;
		}
		signInWithEmailAndPassword(auth, email, password)
			.then((result) => {
				user.set(result.user);
				goto('/dishes');
			})
			.catch(() => {
				errorMessage = 'Ugyldig epost eller passord';
				errorMessage = errorMessage;
			});
	}

	function resetErrorMessage() {
		errorMessage = '';
		errorMessage = errorMessage;
	}
</script>

<section
	class="h-svh flex flex-col items-center justify-start gap-4 bg-gradient-to-tl from-red/20 to-green/30 via-white"
>
	<img class="h-44 lg:h-52 lg:mt-56 mt-24" src="logo-red.svg" alt="Logo img" />
	<h1 class="text-2xl">Velkommen til Paprika</h1>
	<div class="w-[23rem]">
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
	</div>
	{#if errorMessage}
		<div class="text-red">
			{errorMessage}
		</div>
	{/if}

	<SecondaryButton
		on:click={() => signIn()}
		type="button"
		classNames="flex flex-row w-32 h-10 lg:w-40 lg:h-12 justify-center items-center gap-3 lg:text-lg"
	>
		Logg inn
	</SecondaryButton>

	<BottomCircles />
</section>
