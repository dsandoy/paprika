<script lang="ts">
	import SecondaryButton from '$lib/components/SecondaryButton.svelte';
	import { SignIn } from '@auth/sveltekit/components';
</script>

<section class="h-svh flex flex-col items-center justify-center gap-4">
	<img class="h-52" src="paprika_logos/white_g.png" alt="Logo img" />
	<SecondaryButton>
		<SignIn provider="google" />
	</SecondaryButton>
</section>
