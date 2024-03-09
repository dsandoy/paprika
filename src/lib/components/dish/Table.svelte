<script lang="ts">
	import { showDate } from '$lib/utils';
	import { dishes } from '$lib/stores';
	import SecondaryButton from '../SecondaryButton.svelte';
	import Icons from '../Icons.svelte';
</script>

{#if $dishes.length === 0}
	<div>Ingen middager er funnet...</div>
{:else}
	<table
		class="bg-white w-[80%] mb-8 flex flex-col items-center justify-center overflow-y-auto py-32 overscroll-contain"
	>
		<!-- header section -->
		<div
			class="flex flex-row justify-between items-center h-12 px-5 border-solid border-b-[1px] border-grey-300 w-[100%]"
		>
			<div class="h-16 w-12 lg:w-16"></div>
			<div class="w-24 lg:w-32 text-gray-400 text-base">Matrett</div>
			<div class="w-24 lg:w-32 text-gray-400 text-base hidden lg:contents">Sist Laget</div>
			<div class="w-12 lg:w-16 text-center text-gray-400 text-base">URL</div>
		</div>
		<!-- row section -->
		<div class="border-x-[1px] border-solidborder-grey-300 w-[100%]">
			{#each $dishes as dish}
				<div class="flex flex-row justify-between items-center px-5 py-3">
					{#if !dish.customImageId}
						<div class="w-12 lg:w-16">
							<button
								class="bg-gray-200 h-12 w-12 lg:h-16 lg:w-16 flex align-center text-gray-500 items-center rounded hover:bg-gray-300 hover:text-gray-500"
							>
								<Icons iconName="zondicons:camera" height="2.3rem" classNames="m-auto"></Icons>
							</button>
						</div>
					{:else}
						<div class=" w-12 lg:w-16">
							<img
								src={`/api/dishes/${dish.id}/image/${dish.customImageId}`}
								alt="uploaded"
								class="w-12 h-12 lg:w-16 lg:h-16 rounded"
							/>
						</div>
					{/if}
					<div class="w-24 lg:w-32 text-sm lg:text-lg">{dish.name}</div>
					<div class="w-24 hidden lg:contents lg:w-32 text-xs lg:text-base">
						{showDate(dish.lastMade, 'Ikke laget')}
					</div>
					<a href={dish.url} class="w-12 lg:w-16">
						<SecondaryButton classNames="w-12 lg:w-16 h-8 text-sm px-2 lg:text-base">
							<Icons />
						</SecondaryButton>
					</a>
				</div>
			{/each}
		</div>
	</table>
{/if}
