<script lang="ts">
	import type { Dinner } from '$lib/types';

	const dinners: Dinner[] = [
		{
			image: undefined,
			name: 'SushiBowl',
			lastMade: new Date('02.11.2024'),
			url: 'https://vegetarentusiast.no/sushibowl/'
		},
		{
			image: undefined,
			name: 'Lasagne',
			lastMade: new Date('02.12.2024'),
			url: 'https://vegetarentusiast.no/sushibowl/'
		},
		{
			image: undefined,
			name: 'Soup',
			lastMade: new Date('02.11.2024'),
			url: 'https://vegetarentusiast.no/sushibowl/'
		}
	];
</script>

<table class="w-[80%] h-80 bg-white box-border">
	<!-- header section -->
	<div
		class="flex flex-row justify-between items-center h-12 px-5 border-solid border-b-[1px] border-grey-300"
	>
		<div class="h-16 w-16"></div>
		<h2 class="w-20">Matrett</h2>
		<h2 class="w-30">Sist Laget</h2>
		<h2 class="w-16 text-center">URL</h2>
	</div>
	<!-- row section -->
	{#each dinners as dinner}
		<div class="flex flex-row justify-between items-center px-5 py-3">
			{#if dinner.image == undefined}
				<div class="w-16"><div class="bg-gray-300 h-16 w-16 text-center">Img</div></div>
			{/if}
			<div class="w-20">{dinner.name}</div>
			<div class="w-30">{dinner.lastMade.toDateString()}</div>
			<a href={dinner.url} class="w-16"
				><button class="btn border-[1px] border-solid border-grey-300 bg-gray-100">URL</button></a
			>
		</div>
	{/each}
</table>
