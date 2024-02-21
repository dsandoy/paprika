<script lang="ts">
	import { showDate } from '$lib/utils';
	import { dishes } from '$lib/stores';
</script>

{#if $dishes.length === 0}
	<div>Ingen middager er funnet...</div>
{:else}
	<table class="w-[80%] h-80 bg-white mt-12">
		<!-- header section -->
		<div
			class="flex flex-row justify-between items-center h-12 px-5 border-solid border-b-[1px] border-grey-300"
		>
			<div class="h-16 w-16"></div>
			<div class="w-30 text-gray-400 text-base">Matrett</div>
			<div class="w-30 text-gray-400 text-base">Sist Laget</div>
			<div class="w-16 text-center text-gray-400 text-base">URL</div>
		</div>
		<!-- row section -->
		<div class="border-x-[1px] border-solidborder-grey-300">
			{#each $dishes as dish}
				<div class="flex flex-row justify-between items-center px-5 py-3">
					{#if dish.image == undefined}
						<div class="w-16"><div class="bg-gray-300 h-16 w-16 text-center">Img</div></div>
					{/if}
					<div class="w-30">{dish.name}</div>
					<div class="w-30 text-base">{showDate(dish.lastMade, 'Ikke laget')}</div>
					<a href={dish.url} class="w-16"
						><button class="btn border-[1px] border-solid border-grey-300 bg-gray-100">URL</button
						></a
					>
				</div>
			{/each}
		</div>
	</table>
{/if}
