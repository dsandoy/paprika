<script lang="ts">
	import BottomCircles from '$lib/components/BottomCircles.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import ThemeController from '$lib/components/ThemeController.svelte';
	import { SignIn } from '@auth/sveltekit/components';

	let loading = false;
</script>

<main
	class="absolute top-0 bottom-0 right-0 left-0 bg-gradient-to-tl from-red/20 to-green/30 via-base-100 flex flex-col items-center justify-center gap-8"
>
	<img class="h-44 lg:h-52" src="logo-red.svg" alt="Logo img" />
	<h1 class="text-2xl">Velkommen til Paprika</h1>

	<SignIn provider="google">
		<button
			on:click={() => (loading = true)}
			class="btn btn-accent btn-lg text-white"
			slot="submitButton"
		>
			<Loading bind:loading>
				<img src="google-logo.png" alt="Google logo" class="h-6" />
				Logg inn
			</Loading>
		</button>
	</SignIn>
	<ThemeController />

	<BottomCircles />
</main>
