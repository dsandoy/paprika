<script lang="ts">
	import { dishes, shoppingList } from '$lib/stores';
	import ListEntry from '$lib/components/shopping/ListEntry.svelte';
	import DeleteDropdown from '$lib/components/DeleteDropdown.svelte';
	import Icons from '$lib/components/Icons.svelte';
	import { slide } from 'svelte/transition';
	import type { CreateListEntry, ReadDish } from '$lib/types.js';
	import DishSearch from '$lib/components/DishSearch.svelte';
	import Loading from '$lib/components/Loading.svelte';

	export let data;
	const dataDishes = data.dishes;
	dishes.set(dataDishes);
	shoppingList.set(data.shoppingList);
	let numTodo = 0;
	let numCompleted = 0;
	// modals
	let modal: HTMLDialogElement;
	let modal2: HTMLDialogElement;
	let hideComplete = getHideComplete();
	let filteredDishes: ReadDish[] = [];
	let selectedDish: ReadDish | null = null;
	// loaders
	let dishLoading = false;
	let todoLoading = false;
	let entryText = '';
	/**
	 * Get the local storage value for showComplete
	 */
	function getHideComplete() {
		try {
			if (typeof localStorage === 'undefined') return;
			if (!localStorage) return false;
			if (localStorage.getItem('hide_complete') === null) {
				localStorage.setItem('hide_complete', JSON.stringify(false));
				return;
			}
			const checked = JSON.parse(localStorage.getItem('hide_complete') as string);
			if (checked !== '') return checked;
		} catch {
			return false;
		}
	}

	async function createNewEntry() {
		todoLoading = true;
		if (entryText == '') {
			todoLoading = false;
			return;
		}
		const newEntry: CreateListEntry = {
			text: entryText,
			user: data.user.email as string
		};
		const response = await fetch('/api/list/create', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(newEntry)
		});
		if (response.ok) {
			entryText = '';
			$shoppingList.push({ ...newEntry, is_complete: false });
			await fetchList();
		}
		todoLoading = false;
		return;
	}

	async function fetchList() {
		const response = await fetch('/api/list/get', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				user: data.user.email
			})
		});
		if (response.ok) {
			$shoppingList = await response.json();
		}
		return;
	}

	async function deleteCompleted() {
		const response = await fetch('/api/list/delete', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				user: data.user.email
			})
		});
		if (response.ok) {
			$shoppingList = $shoppingList.filter((entry) => !entry.is_complete);
		}
		return;
	}

	function countCompleted() {
		numTodo = 0;
		numCompleted = 0;

		for (let list of $shoppingList) {
			if (list.is_complete) {
				numCompleted = numCompleted + 1;
			} else {
				numTodo = numTodo + 1;
			}
		}
	}

	function setChosenDish(dish: ReadDish) {
		selectedDish = dish;
		selectedDish = selectedDish;
	}

	async function addDishIngredients() {
		dishLoading = true;
		const response = await fetch('/api/list/add-dish', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: data.user.email,
				dish: selectedDish
			})
		});
		if (response.ok) {
			selectedDish = null;
			fetchList();
		}
		dishLoading = false;
	}

	function toggleHideComplete() {
		hideComplete = !hideComplete;
		localStorage.setItem('hide_complete', JSON.stringify(hideComplete));
	}

	$: countCompleted(), $shoppingList;
</script>

<section class="lg:flex lg:flex-col gap-5 justify-center items-center bg-base-100 w-full">
	<div class="flex justify-between w-full lg:w-[35%] items-center pr-4 pl-4 mt-8">
		<h2 class=" p-4 h2">Handleliste</h2>
		<button class="btn btn-primary" on:click={() => modal2.showModal()} title="Generer handleliste">
			<Icons iconName="mdi:add-shopping-cart" height="2.2rem" />
		</button>
	</div>
	<dialog class="modal" bind:this={modal2}>
		<ul class="modal-box w-6/10 lg:w-96 menu p-4 shadow bg-base-200 rounded-sm lg:rounded-box z-10">
			<div class="flex gap-2 justify-between pr-4">
				<strong class="mb-4 mt-2 text-base">Velg matrett til handleliste</strong>
			</div>
			<button class="pb-4">
				<DishSearch bind:filteredDishes dishes={$dishes} classNames="text-sm" />
			</button>
			<div class="overflow-x-auto h-60">
				{#each filteredDishes as dish}
					<li
						class="hover:bg-primary hover:text-white rounded-box"
						class:bg-primary={selectedDish?.id === dish.id}
						class:text-white={selectedDish?.id === dish.id}
					>
						<button
							class="flex gap-2 justify-between items-center
							"
							on:click={() => setChosenDish(dish)}
						>
							<p class:text-white={selectedDish?.id === dish.id}>{dish.name}</p>
							<img
								class="h-8 w-8 lg:h-10 lg:w-10 rounded"
								src={`/api/dishes/${dish.id}/image/`}
								alt="dish"
							/>
						</button>
					</li>
				{/each}
			</div>
			<div>
				<button class="btn btn-warning" on:click={addDishIngredients}>
					<Loading bind:loading={dishLoading}>Legg til valgte matrett</Loading>
				</button>
			</div>
		</ul>
		<form method="dialog" class="modal-backdrop">
			<button>close</button>
		</form>
	</dialog>
	<div class="w-full lg:w-[40%]">
		<div class="">
			<section class="flex flex-col gap-4 lg:p-8">
				{#if numTodo === 0}
					<h3 class="text-center text-2xl">Handlelista er tom..</h3>
				{:else}
					<div class="overflow-y-auto mt-4 h-[32rem]">
						{#each $shoppingList as list}
							{#if !list.is_complete}
								<span class="flex justify-center items-center" transition:slide={{ duration: 250 }}>
									<ListEntry bind:entry={list} />
								</span>
							{/if}
						{/each}
					</div>
				{/if}
			</section>

			<section class="sticky bottom-[30px] p-4">
				<button class="btn btn-primary" on:click={() => modal.showModal()} title="Legg til">
					<Icons iconName="zondicons:add-outline" height="1.7rem" /></button
				>
				<dialog id="modal" class="modal modal-middle" bind:this={modal}>
					<div
						class="modal-box flex flex-col gap-4 justify-center
					 items-center w-8/10 lg:w-auto rounded-sm lg:rounded-box border border-base-300"
					>
						<h3 class="font-bold text-lg w-full text-left">Legg til i lista</h3>
						<input
							class="border-[1px] bg-base-100 px-8 input input-primary"
							type="text"
							name="entrytext"
							placeholder="Brød"
							bind:value={entryText}
						/>
						<button class="btn btn-primary" on:click={createNewEntry}>
							<Loading bind:loading={todoLoading}>
								<Icons iconName="zondicons:add-outline" />
								Legg til
							</Loading>
						</button>
					</div>
					<form method="dialog" class="modal-backdrop">
						<button></button>
					</form>
				</dialog>
			</section>
			{#if numCompleted !== 0}
				<section class="flex flex-col gap-4 p-4 lg:p-8 border-t-[1px] border-t-base-300">
					<div class="flex flex-row justify-between items-center">
						<div class="flex flex-row gap-5 items-center justify-center px-2">
							<button
								on:click={toggleHideComplete}
								class="h-12 w-12 text-info hover:text-secondary"
							>
								{#if hideComplete}<Icons
										height="2.3rem"
										iconName="zondicons:view-show"
									/>{:else}<Icons height="2.3rem" iconName="zondicons:view-hide" />{/if}</button
							>
							<h3 class="text-center text-2xl">Fullførte:</h3>
						</div>
						<DeleteDropdown text="alle fullførte" deleteFunction={deleteCompleted} />
					</div>
					{#if !hideComplete}
						<div class="" transition:slide={{ duration: 150 }}>
							{#each $shoppingList as list}
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
			{:else}
				<!-- Make mobile look good if no completed -->
				<div class="h-16"></div>
			{/if}
		</div>
	</div>
</section>
