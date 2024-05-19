<script lang="ts">
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Icons from '$lib/components/Icons.svelte';
	import type { ReadListEntry, UpdateListEntry } from '$lib/types.ts';
	import EntryInput from './EntryInput.svelte';

	export let entry: ReadListEntry;

	let isEditMode = false;
	let checked = entry.is_complete;
	let entryText = entry.text;

	async function updateDB(entry: UpdateListEntry) {
		const response = await fetch('/api/list/update', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				listEntry: entry
			})
		});
		if (response.ok) {
			console.log('Entry updated');
		}
	}

	async function toggleIsComplete() {
		checked = !checked;

		if (entry.is_complete) {
			entry.is_complete = false;
			await updateDB(entry as UpdateListEntry);
		} else {
			setTimeout(() => {
				entry.is_complete = true;
				updateDB(entry as UpdateListEntry);
			}, 1000);
		}
	}

	function enableEditMode() {
		if (entry.is_complete) return;
		isEditMode = true;
	}

	async function updateEntry() {
		if (entryText == '') return;
		entry.text = entryText;
		isEditMode = false;
	}
</script>

{#if isEditMode}
	<EntryInput
		bind:entryText
		on:change={updateEntry}
		on:focusout={() => {
			isEditMode = false;
		}}
	/>
{:else}
	<button
		class="border-[1px] border-base-100 rounded-lg px-4 p-2 flex flex-row justify-between items-center w-[95%] bg-base-200 btn font-normal"
		on:click={toggleIsComplete}
	>
		<div class="flex flex-row lg:gap-8 gap-4 relative items-center">
			<Checkbox bind:checked disableCheckToggle />
			{#if checked && !entry.is_complete}
				<div
					class="animation-sparkle absolute bottom-[-6px] left-[-7px] z-2 animate-sparkle h-[2.4rem] w-[2.4rem] rounded-lg border-dotted border-[3px] border-green opacity-0"
				></div>
			{/if}
			<p data-ui={checked} class="lg:text-lg text-sm data-isOpen:line-through">{entry.text}</p>
		</div>
		<div class="flex flex-row gap-2 lg:gap-8 items-center">
			<span class="text-xs text-nice-blue pr-8"
				>{#if entry.dishName}{entry.dishName}{/if}</span
			>
			{#if !entry.is_complete}
				<button class="rounded-lg p-1 hover:text-green" on:click={enableEditMode}
					><Icons iconName="zondicons:edit-pencil" height="1.2rem" /></button
				>
			{/if}
		</div>
	</button>
{/if}
