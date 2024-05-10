<script lang="ts">
	import Icons from '$lib/components/Icons.svelte';
	import { ingredients } from '$lib/stores';
	// reset the client kept ingredients list
	$ingredients = [];
</script>

<section
	class="flex flex-col items-center gap-10 justify-center absolute top-16 left-0 right-0 bottom-0 bg-green-50"
>
	<Icons iconName="zondicons:checkmark-outline" height="10rem" classNames="text-success" />
	<h1 class="text-4xl font-semibold">Suksess!</h1>
	<p class="text-gray-500 text-xl">Du har lagt til en matrett! Hva vil du gjøre nå?</p>

	<div class="w-100vh flex flex-row items-center gap-5">
		<a class="btn btn-primary btn-lg text-white" href="/dishes">Se matrettene</a>
		<a class="btn btn-secondary btn-lg" href="/dishes/add">Legg til nytt matrett</a>
	</div>
</section>
