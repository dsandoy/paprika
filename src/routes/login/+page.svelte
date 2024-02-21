<script lang="ts">
	import { SignIn } from '@auth/sveltekit/components';
</script>

<section class="h-svh flex flex-col items-center justify-center gap-4">
	<img class="h-52" src="paprika_logos/white_g.png" alt="Logo img" />
	<button class="btn box-border">
		<SignIn provider="google" />
	</button>
</section>
