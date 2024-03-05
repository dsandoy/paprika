<script lang="ts">
	import { showDate } from '$lib/utils';
	import { dishes } from '$lib/stores';
	import SecondaryButton from '../SecondaryButton.svelte';
</script>

{#if $dishes.length === 0}
	<div>Ingen middager er funnet...</div>
{:else}
	<table class="bg-white w-[80%] mt-12 flex flex-col items-center justify-center">
		<!-- header section -->
		<div
			class="flex flex-row justify-between items-center h-12 px-5 border-solid border-b-[1px] border-grey-300 w-[100%]"
		>
			<div class="h-16 w-12 lg:w-16"></div>
			<div class="w-24 lg:w-32 text-gray-400 text-base">Matrett</div>
			<div class="w-24 lg:w-32 text-gray-400 text-base hidden lg:contents">Sist Laget</div>
			<div class="w-12 lg:w-24 text-center text-gray-400 text-base">URL</div>
		</div>
		<!-- row section -->
		<div class="border-x-[1px] border-solidborder-grey-300 w-[100%]">
			{#each $dishes as dish}
				<div class="flex flex-row justify-between items-center px-5 py-3">
					{#if !dish.customImageId}
						<div class=" w-12 lg:w-16">
							<div class="bg-gray-300 h-12 w-12 lg:h-16 lg:w-16 text-center">Img</div>
						</div>
					{:else}
						<div class=" w-12 lg:w-16">
							<img
								src={`/api/dishes/${dish.id}/image/${dish.customImageId}`}
								alt="uploaded"
								class="w-12 h-12 lg:w-16 lg:h-16"
							/>
						</div>
					{/if}
					<div class="w-24 lg:w-32 text-sm lg:text-lg">{dish.name}</div>
					<div class="w-24 hidden lg:contents lg:w-32 text-xs lg:text-base">
						{showDate(dish.lastMade, 'Ikke laget')}
					</div>
					<a href={dish.url} class="w-12 lg:w-16">
						<SecondaryButton classNames="w-12 lg:w-16 h-8 text-sm px-2 lg:text-base"
							>U</SecondaryButton
						>
					</a>
				</div>
			{/each}
		</div>
	</table>
{/if}
