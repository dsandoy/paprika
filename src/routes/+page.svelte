<script lang="ts">
	import SecondaryButton from '$lib/components/SecondaryButton.svelte';
	import FeatureTable from '$lib/components/featureTable.svelte';
	import ShoppingDemo from './ShoppingDemo.svelte';
	import DinnerDemo from './DinnerDemo.svelte';
	import UrlDemo from './URLDemo.svelte';
</script>

<div class="flex flex-col items-center justify-center w-full">
	<!-- top section -->
	<section
		class="bg-[url('/headerbg.png')] bg-no-repeat bg-cover bg-fixed bg-top lg:bg-left-top w-full h-[40rem] lg:h-[44.5rem] flex flex-col items-center"
	>
		<h1 class="text-3xl lg:text-5xl w-full p-4 mb-8 mt-8 font-bold text-center">
			Ta kontroll over middagene med Paprika!
		</h1>
		<h3 class="text-1xl lg:text-3xl mb-16">Middagsplanlegging gjort på 1 2 3!</h3>
		<SecondaryButton
			type="button"
			on:click={() => (window.location.href = '/login')}
			classNames="flex flex-row  h-16 lg:h-20 justify-center items-center gap-3 text-lg lg:text-xl"
		>
			<img src="logo-green.svg" alt="paprika logo" class="h-10" />
			Kom i gang
		</SecondaryButton>
	</section>

	<section class=" w-full bg-gradient-to-tr pt-12 from-red/20 to-green/20 via-white p-8">
		<DinnerDemo />
	</section>

	<!-- Dinnner planner section -->

	<section class="w-screen pt-0">
		<div class="bg-red/50 rounded h-[28rem] lg:p-8 p-4 relative grid lg:grid-cols-2 grid-cols-1">
			<div class="">
				<UrlDemo />
			</div>
			<div class="lg:pt-24 pt-0">
				<ShoppingDemo />
			</div>
		</div>
	</section>
	<!-- feature table section -->
	<section
		class="flex flex-col justify-center lg:items-start items-center w-full gap-14 lg:py-4 py-[30rem] bg-gradient-to-br from-red/20 to-green/20 via-white"
	>
		<div class="flex flex-col justify-center items-center lg:w-[50%] w-full">
			<FeatureTable />
		</div>
		<div class="flex justify-center items-center w-full">
			<SecondaryButton
				type="button"
				on:click={() => (window.location.href = '/login')}
				classNames="flex flex-row  h-12 lg:h-16 justify-center items-center gap-3 text-base"
			>
				<img src="logo-red.svg" alt="paprika logo" class="h-10" />
				Logg Inn
			</SecondaryButton>
		</div>
	</section>
</div>
