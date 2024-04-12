<script lang="ts">
	import { DBShoppingList } from '$lib/Firebase';
	import type { ShoppingList, ShoppingListEntry } from '$lib/types';
	import { slide } from 'svelte/transition';
	import EntryInput from './EntryInput.svelte';
	import ListEntry from './ListEntry.svelte';
	import Icons from '../Icons.svelte';
	import SecondaryButton from '../SecondaryButton.svelte';
	import DeleteDropdown from '../DeleteDropdown.svelte';

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

	let hideComplete = false;

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

	function deleteCompleted() {
		shoppingList.list = shoppingList.list.filter((element) => !element.is_complete);
		shoppingList = shoppingList;
		try {
			DBShoppingList.update(shoppingList);
			console.log('Deleted completed items');
		} catch (error) {
			console.error(error);
		}
	}

	countCompleted();

	$: countCompleted(), shoppingList;
</script>

<div class="border-[1px] border-gray-200 rounded flex flex-col gap-5">
	<section class="h-20 p-4 border-b-[1px] border-b-gray-200 flex flex-row justify-between">
		<h2 class="text-3xl">{listName}</h2>
		<!-- <PrimaryButton>Legg til fra matrett</PrimaryButton> -->
	</section>

	<section class="flex flex-col gap-4 p-4 lg:p-8">
		{#if numTodo === 0}
			<h3 class="text-center text-2xl">Handlelista er tom..</h3>
		{:else}
			<div class=" max-h-[25rem] lg:max-h-[30rem] overflow-y-auto">
				{#each shoppingList.list as list}
					{#if !list.is_complete}
						<span class="flex justify-center items-center" transition:slide={{ duration: 250 }}>
							<ListEntry bind:entry={list} />
						</span>
					{/if}
				{/each}
			</div>
		{/if}
	</section>

	{#if enableCompleteSection}
		{#if numCompleted !== 0}
			<section
				class="flex flex-col gap-4 p-4 lg:p-8 max-h-[25rem] lg:max-h-[35rem] overflow-y-auto border-t-[1px] border-t-gray-200"
			>
				<div class="flex flex-row justify-between items-center">
					<div class="flex flex-row gap-5 items-center justify-center px-2">
						<SecondaryButton
							on:click={() => (hideComplete = !hideComplete)}
							classNames="h-12 w-12 text-green"
						>
							{#if hideComplete}<Icons
									height="1.5rem"
									iconName="zondicons:view-show"
								/>{:else}<Icons
									height="1.5rem"
									iconName="zondicons:view-hide"
								/>{/if}</SecondaryButton
						>
						<h3 class="text-center text-2xl">Fullførte:</h3>
					</div>
					<DeleteDropdown text="alle fullførte" deleteFunction={deleteCompleted} />
				</div>
				{#if !hideComplete}
					<div
						class="max-h-[20rem] lg:max-h-[30rem] overflow-y-auto"
						transition:slide={{ duration: 150 }}
					>
						{#each shoppingList.list as list}
							{#if list.is_complete}
								<span class="flex justify-center items-center" transition:slide={{ duration: 950 }}>
									<ListEntry bind:entry={list} />
								</span>
							{/if}
						{/each}
					</div>
				{/if}
			</section>
		{/if}
	{/if}

	<section
		class="sticky bottom-0 border-t-[1px] border-t-gray-200 px-8 pt-4 flex flex-col bg-white"
	>
		<EntryInput bind:entryText on:change={createNewEntry} />
	</section>
</div>
