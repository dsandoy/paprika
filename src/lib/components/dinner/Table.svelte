<script lang="ts">
	import { showDate } from '$lib/utils';
	import { dinners } from '$lib/stores';
</script>

{#if $dinners.length === 0}
	<div>Ingen middager er funnet...</div>
{:else}
	<table class="w-[80%] h-80 bg-white box-border">
		<!-- header section -->
		<div
			class="flex flex-row justify-between items-center h-12 px-5 border-solid border-b-[1px] border-grey-300"
		>
			<div class="h-16 w-16"></div>
			<h2 class="w-30">Matrett</h2>
			<h2 class="w-30">Sist Laget</h2>
			<h2 class="w-16 text-center">URL</h2>
		</div>
		<!-- row section -->
		{#each $dinners as dinner}
			<div class="flex flex-row justify-between items-center px-5 py-3">
				{#if dinner.image == undefined}
					<div class="w-16"><div class="bg-gray-300 h-16 w-16 text-center">Img</div></div>
				{/if}
				<div class="w-30">{dinner.name}</div>
				<div class="w-30">{showDate(dinner.lastMade)}</div>
				<a href={dinner.url} class="w-16"
					><button class="btn border-[1px] border-solid border-grey-300 bg-gray-100">URL</button></a
				>
			</div>
		{/each}
	</table>
{/if}
