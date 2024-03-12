<script lang="ts">
	import BottomCircles from '$lib/components/BottomCircles.svelte';
	import SecondaryButton from '$lib/components/SecondaryButton.svelte';
</script>

<section class="h-svh flex flex-col items-center justify-start gap-4">
	<img class="h-44 lg:h-52 mt-56" src="paprika_logos/white_g.png" alt="Logo img" />
	<SecondaryButton
		type="button"
		classNames="flex flex-row w-56 h-12 lg:w-64 lg:h-14 justify-center items-center gap-3 lg:text-lg"
	>
		<img src="google-logo.png" alt="Google logo" class="h-6" />
		Logg inn
	</SecondaryButton>
	<BottomCircles />
</section>
