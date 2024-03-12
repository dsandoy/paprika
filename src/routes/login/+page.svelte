<script lang="ts">
	import BottomCircles from '$lib/components/BottomCircles.svelte';
	import SecondaryButton from '$lib/components/SecondaryButton.svelte';
	import { SignedIn, SignedOut } from 'sveltefire';
	import { SignInWithGoogle } from '$lib/Firebase';
	import PrimaryButton from '$lib/components/PrimaryButton.svelte';
</script>

<section class="h-svh flex flex-col items-center justify-start gap-4">
	<img class="h-44 lg:h-52 mt-56" src="paprika_logos/white_g.png" alt="Logo img" />
	<h1 class="text-2xl">Velkommen til Paprika</h1>
	<p class="text-base lg:text-lg w-[66%] text-center">
		Ta kontroll over hva du skal ha til middag! Logg inn og sett i gang!
	</p>
	<SignedOut>
		<SecondaryButton
			on:click={() => SignInWithGoogle()}
			type="button"
			classNames="flex flex-row w-56 h-12 lg:w-64 lg:h-14 justify-center items-center gap-3 lg:text-lg"
		>
			<img src="google-logo.png" alt="Google logo" class="h-6" />
			Logg inn
		</SecondaryButton>
	</SignedOut>
	<SignedIn>
		<a href="/dishes"><PrimaryButton>Til middager</PrimaryButton></a>
	</SignedIn>

	<BottomCircles />
</section>
