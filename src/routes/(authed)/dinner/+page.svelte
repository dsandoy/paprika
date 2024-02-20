<script lang="ts">
	import Table from '$lib/components/dinner/Table.svelte';
	import type { Dinner } from '@prisma/client';
	import { dinners } from '$lib/stores.js';

	// fetch data when loading..
	export let data;
	if (data.response) {
		$dinners = data.response as Dinner[];
	}
</script>

<section class="flex flex-col items-center align-center w-svw h-[92svh]">
	{#if data.error}
		<div>{data.error.message}</div>
	{:else}
		<Table />
	{/if}
</section>
