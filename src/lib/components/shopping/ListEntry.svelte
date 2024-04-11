<script lang="ts">
	import { DBShoppingList } from '$lib/Firebase';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import { shoppingList } from '$lib/stores';
	import Icons from '$lib/components/Icons.svelte';
	import type { ShoppingListEntry } from '$lib/types.ts';
	import EntryInput from './EntryInput.svelte';

	export let entry: ShoppingListEntry;

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
	<EntryInput bind:entryText on:change={updateEntry} />
{:else}
	<button
		class="border-[1px] border-gray-200 rounded-lg px-4 p-2 flex flex-row justify-between items-center"
		on:click={toggleIsComplete}
	>
		<div class="flex flex-row gap-8">
			<Checkbox bind:checked classNames="rounded-lg h-8 w-8" disableCheckToggle />
			<p class="lg:text-lg">{entry.text}</p>
		</div>
		<div class="flex flex-row gap-8 items-center">
			<span class="text-xs text-nice-blue pr-8"
				>{#if entry.dish}{entry.dish}{/if}</span
			>
			{#if !entry.is_complete}
				<button class="rounded-lg" on:click={enableEditMode}
					><Icons iconName="zondicons:edit-pencil" height="1.2rem" /></button
				>
			{/if}
		</div>
	</button>
{/if}
