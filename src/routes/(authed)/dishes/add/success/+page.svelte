<script lang="ts">
	import { ingredients } from '$lib/stores';
	// reset the client kept ingredients list
	$ingredients = [];
</script>

<section class="w-100vh flex flex-col items-center gap-10 justify-center h-[50svh]">
	<h1>Suksess!</h1>
	<p class="text-gray-500">Du har lagt til matrett! Hva vil du gjøre nå?</p>

	<div class="w-100vh flex flex-row items-center gap-5">
		<a href="/dishes"><button class="btn-primary"> Se matrettene </button></a>
		<a href="/dishes/add"><button class="btn-secondary"> Legg til nytt matrett </button></a>
	</div>
</section>
