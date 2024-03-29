<script lang="ts">
	import { auth } from '$lib/Firebase';
	import DemoImage from '$lib/components/DemoImage.svelte';
	import SecondaryButton from '$lib/components/SecondaryButton.svelte';
	import SideBar from '$lib/components/SideBar.svelte';
	import FeatureTable from '$lib/components/featureTable.svelte';
	import ProfileDropdown from '$lib/components/user/ProfileDropdown.svelte';
	import { user } from '$lib/stores';
	import { onMount } from 'svelte';

	const usr = auth.currentUser;
	if (usr) {
		user.set(usr);
	}

	let smallSize = true;
	onMount(() => {
		smallSize = window.matchMedia('(max-width: 800px)').matches;
	});
</script>

<header class="w-svw h-16 flex bg-green justify-between px-5 items-center text-white">
	<SideBar />
	<a href="/dishes"><img class=" h-14 lg:w-16 lg:h-16" src="/logo-green.svg" alt="Logo img" /> </a>
	<div>
		<ProfileDropdown></ProfileDropdown>
	</div>
</header>

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
	<section class="w-screen pt-0">
		<div class="bg-red/50 rounded p-8 grid lg:grid-cols-3 grid-cols-1 relative">
			<div>
				{#if !smallSize}
					<span class="lg:absolute lg:top-[-3rem] lg:left-[5rem]">
						<DemoImage
							classNames="h-[28rem]"
							text="1. Se planen din"
							smallText="Planen viser denne og neste uke"
							img="peaks/plan1.png"
						/>
					</span>
				{/if}
			</div>
			<div class="flex flex-col gap-3 justify-center items-center">
				<h3 class="text-xl lg:text-3xl w-full text-center text-black">
					Med Paprika blir middagsplanlegging enkelt!
				</h3>
				{#if !smallSize}
					<p>Kun 3 enkle steg:</p>
					<DemoImage
						classNames="h-[16rem]"
						text="2. Velg Dag"
						smallText="Velg dagen du vil endre på"
						img="peaks/plan2.png"
					/>
				{:else}
					<div class="flex flex-row justify-center items-center gap-4 w-screen">
						<ol class="border-red border-l-[4px] pl-2 text-lg">
							<li>1. Se plan</li>
							<li>2. Velg dag</li>
							<li>3. Velg mat</li>
						</ol>
						<img src="peaks/plan4.png" alt="planner" class="h-[24rem]" />
					</div>
				{/if}
			</div>
			<div class="flex flex-col justify-center items-center">
				{#if !smallSize}
					<span class="lg:absolute lg:bottom-[-2rem]">
						<DemoImage
							classNames="h-[14rem]"
							text="3. Velg middag"
							img="peaks/plan3.png"
							smallText="Søk eller bla etter ønsket middag"
						/>
					</span>
				{/if}
			</div>
		</div>
	</section>
	<!-- feature table section -->
	<section
		class="flex flex-col justify-center items-center w-full gap-10 py-10 bg-gradient-to-br from-red/20 to-green/20 via-white"
	>
		<FeatureTable />
		<SecondaryButton
			type="button"
			on:click={() => (window.location.href = '/login')}
			classNames="flex flex-row  h-10 lg:h-12 justify-center items-center gap-3 text-base"
		>
			<img src="google-logo.png" alt="Google logo" class="h-6" />
			Logg Inn
		</SecondaryButton>
	</section>
</div>
