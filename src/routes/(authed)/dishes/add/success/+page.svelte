<script lang="ts">
	import PrimaryButton from '$lib/components/PrimaryButton.svelte';
	import SecondaryButton from '$lib/components/SecondaryButton.svelte';
	import { ingredients } from '$lib/stores';
	// reset the client kept ingredients list
	$ingredients = [];
</script>

<section
	class="flex flex-col items-center gap-10 justify-center absolute top-16 left-0 right-0 bottom-0 bg-green-50"
>
	<h1 class="text-4xl font-semibold">Suksess!</h1>
	<p class="text-gray-500 text-xl">Du har lagt til en matrett! Hva vil du gjøre nå?</p>

	<div class="w-100vh flex flex-row items-center gap-5">
		<a href="/dishes"><PrimaryButton>Se matrettene</PrimaryButton></a>
		<a href="/dishes/add"><SecondaryButton>Legg til nytt matrett</SecondaryButton></a>
	</div>
</section>
