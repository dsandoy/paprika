<script lang="ts">
	import FadeInElement from '$lib/components/FadeInElement.svelte';
	import SecondaryButton from '$lib/components/SecondaryButton.svelte';
	import FeatureTable from '$lib/components/featureTable.svelte';
	import { user } from '$lib/stores';
	import { onMount } from 'svelte';
	import { demoPlans } from './demodata';
	import DemoPlanEntry from '$lib/components/demo/DemoPlanEntry.svelte';

	function naviateToDashboard() {
		if (!$user) return;
		try {
			window.location.href = '/dashboard';
		} catch {
			return;
		}
	}

	let smallSize = true;
	onMount(() => {
		smallSize = window.matchMedia('(max-width: 800px)').matches;
	});

	$: naviateToDashboard(), $user;
</script>

<div class="flex flex-col items-center justify-center">
	<!-- top section -->
	<section
		class="bg-[url('headerbg.png')] bg-no-repeat bg-cover bg-fixed bg-top lg:bg-left-top w-full h-[40rem] lg:h-[44.5rem] flex flex-col items-center"
	>
		<h1 class="text-3xl lg:text-5xl w-full p-4 mb-16 mt-8 font-bold text-center">
			Ta kontroll over middagene med Paprika!
		</h1>
		<h3 class="text-1xl lg:text-3xl mb-8">Middagsplanlegging gjort på 1 2 3!</h3>
		<SecondaryButton
			type="button"
			on:click={() => (window.location.href = '/login')}
			classNames="flex flex-row  h-10 lg:h-14 justify-center items-center gap-3 text-base lg:text-lg font-semibold"
		>
			<img src="logo-green.svg" alt="paprika logo" class="h-10" />
			Kom i gang
		</SecondaryButton>
	</section>
	<section class=" w-full bg-gradient-to-tr pt-12 from-red/20 to-green/20 via-white p-8">
		<div class=" flex flex-col items-center justify-center gap-12">
			<h2 class="text-3xl">1. Hva skal jeg ha til middag?</h2>
			<div>
				<DemoPlanEntry plannerEntry={$demoPlans[0]} />
				<DemoPlanEntry plannerEntry={$demoPlans[1]} isOpen={!smallSize} />
				<DemoPlanEntry plannerEntry={$demoPlans[2]} />
			</div>
			<p class="w-[30%] text-center">
				Ved å legge til matrettene dine får du enkelt inspirasjon til å ta valget! Liker du å
				planlegge? Bestem middager for hele uka!
			</p>
		</div>
	</section>

	<!-- Dinnner planner section -->
	{#if !smallSize}
		<section class="w-screen pt-0 h-[28rem]">
			<div class="bg-red/50 rounded h-full p-8 grid lg:grid-cols-3 grid-cols-1 relative">
				<div class="flex flex-col justify-center gap-3 pl-12">
					<h3 class="text-3xl">2. Hvordan lager jeg det?</h3>
					<p class="h-[30%]">Gå enkelt til oppskriften fra Paprika!</p>

					<h3 class="text-3xl">3. Hva må jeg handle?</h3>
					<p class="h-[30%]">Legg inn ingrediensene og la Paprika lage handlelista!</p>
				</div>
				<FadeInElement>
					<!-- shopping list demo -->
					<div class="flex flex-col gap-3 justify-center items-center">shopping list demo</div>
				</FadeInElement>
			</div>
		</section>
	{/if}
	<!-- feature table section -->
	<section
		class="flex flex-col justify-center items-center w-full gap-10 py-10 bg-gradient-to-br from-red/20 to-green/20 via-white"
	>
		<FeatureTable />
		{#if !smallSize}
			<SecondaryButton
				type="button"
				on:click={() => (window.location.href = '/login')}
				classNames="flex flex-row  h-10 lg:h-12 justify-center items-center gap-3 text-base"
			>
				<img src="logo-red.svg" alt="paprika logo" class="h-10" />
				Logg Inn
			</SecondaryButton>
		{/if}
	</section>
</div>
