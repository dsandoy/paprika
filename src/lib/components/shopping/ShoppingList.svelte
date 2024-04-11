<script lang="ts">
	import { DBShoppingList } from '$lib/Firebase';
	import type { ShoppingList, ShoppingListEntry } from '$lib/types';
	import EntryInput from './EntryInput.svelte';
	import ListEntry from './ListEntry.svelte';

	export let listName = 'Handleliste';
	export let enableCompleteSection = true;
	export let shoppingList: ShoppingList = {
		user: '',
		list: [
			{
				text: 'melk',
				is_complete: false,
				dish: 'Kjøttkaker'
			},
			{
				text: 'mel',
				is_complete: false
			}
		]
	};

	let entryText = '';
	function createNewEntry() {
		const value = entryText;
		if (value == '') {
			console.log('Skiping empty entry');
			return;
		}
		const newEntry: ShoppingListEntry = {
			text: value,
			is_complete: false
		};
		shoppingList.list.push(newEntry);
		shoppingList = shoppingList;
		try {
			DBShoppingList.update(shoppingList);
		} catch (error) {
			console.error(error);
		}
		entryText = '';
	}

	let numCompleted = 0;
	let numTodo = 0;

	function countCompleted() {
		numTodo = 0;
		numCompleted = 0;

		if (!shoppingList.list || shoppingList.list.length === 0) {
			return;
		}
		shoppingList.list.forEach((element) => {
			if (element.is_complete) {
				numCompleted = numCompleted + 1;
			} else {
				numTodo = numTodo + 1;
			}
		});
	}

	countCompleted();

	$: countCompleted(), shoppingList;
</script>

<div class="border-[1px] border-gray-200 rounded flex flex-col gap-5">
	<section class="h-20 p-4 border-b-[1px] border-b-gray-200 flex flex-row justify-between">
		<h2 class="text-3xl">{listName}</h2>
		<!-- <PrimaryButton>Legg til fra matrett</PrimaryButton> -->
	</section>

	<section class="flex flex-col gap-4 p-8 max-h-[30rem] overflow-y-auto">
		{#if numTodo === 0}
			<h3 class="text-center text-2xl">Handlelista er tom..</h3>
		{:else}
			{#each shoppingList.list as list}
				{#if !list.is_complete}
					<ListEntry bind:entry={list} />
				{/if}
			{/each}
		{/if}
	</section>

	{#if enableCompleteSection}
		{#if numCompleted !== 0}
			<section
				class="flex flex-col gap-4 p-8 max-h-[10rem] overflow-y-auto border-t-[1px] border-t-gray-200"
			>
				<h3 class="text-center text-2xl">Fullførte:</h3>
				{#each shoppingList.list as list}
					{#if list.is_complete}
						<ListEntry bind:entry={list} />
					{/if}
				{/each}
			</section>
		{/if}
	{/if}

	<section class="border-t-[1px] border-t-gray-200 px-8 pt-4 flex flex-col">
		<EntryInput bind:entryText on:change={createNewEntry} />
	</section>
</div>
