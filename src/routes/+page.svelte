<script lang="ts">
	import DemoImage from '$lib/components/DemoImage.svelte';
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
		class="flex flex-col items-center justify-center w-full h-[85svh] bg-gradient-to-tr from-red/20 to-green/20 via-white pt-12"
	>
		<h1 class="text-3xl lg:text-5xl w-full p-4 mb-5 text-center">
			Ta kontroll over middagene med Paprika!
		</h1>
		<h3 class="text-1xl lg:text-3xl mb-8">Middagsplanlegging gjort på 1 2 3!</h3>
		<SecondaryButton
			type="button"
			on:click={() => (window.location.href = '/login')}
			classNames="flex flex-row  h-10 lg:h-12 justify-center items-center gap-3 text-base"
		>
			<img src="google-logo.png" alt="Google logo" class="h-6" />
			Kom i gang
		</SecondaryButton>
		<div class="pt-20">
			<DemoPlanEntry plannerEntry={$demoPlans[0]} />
			<DemoPlanEntry plannerEntry={$demoPlans[1]} isOpen={!smallSize} />
			<DemoPlanEntry plannerEntry={$demoPlans[2]} />
		</div>
	</section>

	<!-- Dinnner planner section -->
	{#if !smallSize}
		<section class="w-screen pt-0 h-[28rem]">
			<div class="bg-red/50 rounded h-full p-8 grid lg:grid-cols-3 grid-cols-1 relative">
				<div class="flex flex-col items-center justify-center gap-3">
					<h3 class="text-2xl">1. Opprett Matretter</h3>
					<span class="">
						<DemoImage
							classNames="w-[18rem]"
							text="Legg til Matretter"
							smallText="Endre og opprette matretter du liker å lage"
							img="demo/matretter.png"
						/>
					</span>
				</div>
				<FadeInElement>
					<div class="flex flex-col gap-3 justify-center items-center">
						<h2 class="text-xl lg:text-3xl w-full text-center text-black">
							Med Paprika blir middagsplanlegging enkelt!
						</h2>
						<div class="flex flex-col justify-center items-center gap-3">
							<h3 class="text-2xl">2. Planlegg middager!</h3>
							<DemoImage
								classNames="h-[16rem]"
								text="Planlegg Middag"
								smallText="Velg dagen du vil endre på"
								img="peaks/plan2.png"
							/>
						</div>
					</div>
				</FadeInElement>
				<FadeInElement>
					<div class="flex flex-col justify-center items-center">
						<span class="lg:absolute lg:top-[6rem]">
							<div class="mt-24" />
							<div class="flex flex-col justify-center items-center gap-3">
								<h3 class="text-2xl">3. Lag dagens middag!</h3>
								<DemoImage
									classNames="w-[18rem]"
									text="3. Lag dagens middag"
									img="demo/dashboard.png"
									smallText="Paprika tar deg med til oppskriften"
								/>
							</div>
						</span>
					</div>
				</FadeInElement>
			</div>
		</section>
	{/if}
	<!-- feature table section -->
	<section
		class="flex flex-col justify-center items-center w-full gap-10 py-10 bg-gradient-to-br from-red/20 to-green/20 via-white"
	>
		<div class="flex flex-col items-center justify-center gap-4">
			<h2 class="text-4xl">Må du handle inn ingredienser?</h2>
			Lag din egen handleliste, eller velg hvilke middager du vil handle inn for!
			<DemoImage text="Handlelista" img="demo/shoppinglist.png" classNames="w-[15rem]" />
		</div>
		<FeatureTable />
		{#if !smallSize}
			<SecondaryButton
				type="button"
				on:click={() => (window.location.href = '/login')}
				classNames="flex flex-row  h-10 lg:h-12 justify-center items-center gap-3 text-base"
			>
				<img src="google-logo.png" alt="Google logo" class="h-6" />
				Logg Inn
			</SecondaryButton>
		{/if}
	</section>
</div>
