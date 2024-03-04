<script lang="ts">
	import SecondaryButton from '$lib/components/SecondaryButton.svelte';
	import { SignIn } from '@auth/sveltekit/components';
</script>

<section class="h-svh flex flex-col items-center justify-center gap-4">
	<img class="h-52" src="paprika_logos/white_g.png" alt="Logo img" />
	<SecondaryButton classNames="flex flex-row w-64 h-14 justify-center items-center gap-3">
		<img src="google-logo.png" alt="Google logo" class="h-6" />
		<SignIn provider="google" />
	</SecondaryButton>
</section>
