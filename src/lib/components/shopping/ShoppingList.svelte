<script lang="ts">
	import { DBShoppingList } from '$lib/Firebase';
	import type { CreateListEntry, ReadDish } from '$lib/types';
	import { slide } from 'svelte/transition';
	import EntryInput from './EntryInput.svelte';
	import ListEntry from './ListEntry.svelte';
	import Icons from '../Icons.svelte';
	import SecondaryButton from '../SecondaryButton.svelte';
	import DeleteDropdown from '../DeleteDropdown.svelte';
	import { dishes, user } from '$lib/stores';
	import DishSearch from '../DishSearch.svelte';
	import { ShoppingListHandler } from '$lib/utils';

	export let listName = 'Handleliste';
	export let enableCompleteSection = true;

	let entryText = '';
	function createNewEntry() {
		const value = entryText;
		if (value == '') {
			console.log('Skiping empty entry');
			return;
		}
		const newEntry: CreateListEntry = {
			text: value
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

	let filteredDishes: ReadDish[] = [];

	function getDishes() {}

	$: getDishes(), $user;

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

	function addToList(dish: ReadDish) {
		console.log('adding to list...');
		try {
			let list = shoppingList.list;
			list = ShoppingListHandler.addIngredients(list, dish);
			shoppingList.list = list;
			DBShoppingList.update(shoppingList);
		} catch (error) {
			console.warn(error);
		}
	}

	countCompleted();

	$: countCompleted(), shoppingList;
</script>

<div class="border-[1px] border-base-300 rounded flex flex-col gap-5">
	<section
		class="h-20 p-4 border-b-[1px] border-base-300 flex flex-row items-center justify-between"
	>
		<h2 class="text-3xl">{listName}</h2>
		<!-- add from dish -->
		<section class="dropdown dropdown-bottom dropdown-end">
			<div tabindex="-1" class="btn btn-primary text-white">
				<Icons iconName="zondicons:add-outline" />
				Fra matrett
			</div>
			<ul class="dropdown-content menu shadow p-2 rounded gap-3 flex bg-base-200 z-10">
				<strong>Legg til fra matrett</strong>
				<button>
					<DishSearch bind:filteredDishes dishes={$dishes} classNames="text-sm" />
				</button>
				<li>
					<button>Stuff</button>
				</li>
			</ul>
		</section>
	</section>

	<div class="min-h-[36rem]">
		<section class="flex flex-col gap-4 p-4 lg:p-8">
			{#if numTodo === 0}
				<h3 class="text-center text-2xl">Handlelista er tom..</h3>
			{:else}
				<div class="lg:max-h-[30rem] overflow-y-auto">
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
					class="flex flex-col gap-4 p-4 lg:p-8 max-h-[25rem] lg:max-h-[35rem] overflow-y-auto border-t-[1px] border-t-base-300"
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
									<span
										class="flex justify-center items-center"
										transition:slide={{ duration: 950 }}
									>
										<ListEntry bind:entry={list} />
									</span>
								{/if}
							{/each}
						</div>
					{/if}
				</section>
			{/if}
		{/if}
	</div>
	<section class="border-t-[1px] w-full border-t-base-300 px-8 pt-4 flex flex-col">
		<EntryInput bind:entryText on:change={createNewEntry} />
	</section>
</div>
