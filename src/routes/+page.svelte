<script lang="ts">
	import DemoImage from '$lib/components/DemoImage.svelte';
	import FadeInElement from '$lib/components/FadeInElement.svelte';
	import SecondaryButton from '$lib/components/SecondaryButton.svelte';
	import FeatureTable from '$lib/components/featureTable.svelte';
	import { user } from '$lib/stores';
	import { onMount } from 'svelte';

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
		<h3 class="text-3xl lg:text-5xl w-full p-4 mb-5 text-center">
			Ta kontroll over middagene med Paprika!
		</h3>
		<SecondaryButton
			type="button"
			on:click={() => (window.location.href = '/login')}
			classNames="flex flex-row  h-10 lg:h-12 justify-center items-center gap-3 text-base"
		>
			<img src="google-logo.png" alt="Google logo" class="h-6" />
			Kom i gang
		</SecondaryButton>
	</section>

	<!-- Dinnner planner section -->
	{#if !smallSize}
		<section class="w-screen pt-0 h-[28rem]">
			<div class="bg-red/50 rounded h-full p-8 grid lg:grid-cols-3 grid-cols-1 relative">
				<div>
					<span class="lg:absolute lg:top-[-3rem] lg:left-[5rem]">
						<DemoImage
							classNames="h-[28rem]"
							text="1. Se planen din"
							smallText="Planen viser denne og neste uke"
							img="peaks/plan1.png"
						/>
					</span>
				</div>
				<FadeInElement>
					<div class="flex flex-col gap-3 justify-center items-center">
						<h3 class="text-xl lg:text-3xl w-full text-center text-black">
							Med Paprika blir middagsplanlegging enkelt!
						</h3>
						<p>Kun 3 enkle steg:</p>
						<DemoImage
							classNames="h-[16rem]"
							text="2. Velg Dag"
							smallText="Velg dagen du vil endre på"
							img="peaks/plan2.png"
						/>
					</div>
				</FadeInElement>
				<div class="flex flex-col justify-center items-center">
					<span class="lg:absolute lg:bottom-[-2rem]">
						<FadeInElement>
							<DemoImage
								classNames="h-[14rem]"
								text="3. Velg middag"
								img="peaks/plan3.png"
								smallText="Søk eller bla etter ønsket middag"
							/>
						</FadeInElement>
					</span>
				</div>
			</div>
		</section>
	{/if}
	<!-- feature table section -->
	<section
		class="flex flex-col justify-center items-center w-full gap-10 py-10 bg-gradient-to-br from-red/20 to-green/20 via-white h-[40rem]"
	>
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
