<script lang="ts">
	import { DBShoppingList } from '$lib/Firebase';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import { shoppingList } from '$lib/stores';
	import Icons from '$lib/components/Icons.svelte';
	import type { ShoppingListEntry } from '$lib/types.ts';
	import EntryInput from './EntryInput.svelte';

	export let entry: ShoppingListEntry;

	export let disableDatabaseUpdate = false;

	let isEditMode = false;
	let checked = entry.is_complete;
	let entryText = entry.text;

	function toggleIsComplete() {
		checked = !checked;

		if (entry.is_complete) {
			entry.is_complete = false;
			updateInDatabase(entry);
		} else {
			setTimeout(() => {
				entry.is_complete = true;
				updateInDatabase(entry);
			}, 1000);
		}
	}

	function enableEditMode() {
		if (entry.is_complete) return;
		isEditMode = true;
	}

	async function updateInDatabase(entry: ShoppingListEntry) {
		if (disableDatabaseUpdate) return;
		try {
			const index = $shoppingList.list.findIndex((el) => el.text === entry.text);
			$shoppingList.list[index] = entry;
		} catch (error) {
			console.error(error);
		}
		try {
			await DBShoppingList.update($shoppingList);
		} catch (error) {
			console.error(error);
		}
	}

	async function updateEntry() {
		if (entryText == '') return;
		entry.text = entryText;
		await updateInDatabase(entry);
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
		class="border-[1px] border-gray-200 rounded-lg px-4 p-2 flex flex-row justify-between items-center bg-white w-full hover:bg-gray-100"
		on:click={toggleIsComplete}
	>
		<div class="flex flex-row lg:gap-8 gap-4 relative items-center">
			<Checkbox bind:checked classNames="rounded-lg h-6 w-6" disableCheckToggle />
			{#if checked && !entry.is_complete}
				<div
					class="animation-sparkle absolute bottom-[-6px] left-[-7px] z-2 animate-sparkle h-[2.4rem] w-[2.4rem] rounded-lg border-dotted border-[3px] border-green opacity-0"
				></div>
			{/if}
			<p data-ui={checked} class="lg:text-lg text-sm data-isOpen:line-through">{entry.text}</p>
		</div>
		<div class="flex flex-row gap-2 lg:gap-8 items-center">
			<span class="text-xs text-nice-blue pr-8"
				>{#if entry.dish}{entry.dish}{/if}</span
			>
			{#if !entry.is_complete}
				<button class="rounded-lg p-1 hover:text-green" on:click={enableEditMode}
					><Icons iconName="zondicons:edit-pencil" height="1.2rem" /></button
				>
			{/if}
		</div>
	</button>
{/if}
