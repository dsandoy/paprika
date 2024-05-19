<script lang="ts">
	import { dishes, shoppingList } from '$lib/stores';
	import ListEntry from '$lib/components/shopping/ListEntry.svelte';
	import SecondaryButton from '$lib/components/SecondaryButton.svelte';
	import DeleteDropdown from '$lib/components/DeleteDropdown.svelte';
	import Icons from '$lib/components/Icons.svelte';
	import { slide } from 'svelte/transition';
	import type { CreateListEntry } from '$lib/types.js';

	export let data;
	const dataDishes = data.dishes;
	dishes.set(dataDishes);
	shoppingList.set(data.shoppingList);

	let numTodo = 0;
	let numCompleted = 0;

	let modal: HTMLDialogElement;
	let hideComplete = false;

	let entryText = '';

	async function createNewEntry() {
		if (entryText == '') {
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

	$: countCompleted(), $shoppingList;
</script>

<section
	class="lg:flex lg:flex-col gap-5 justify-center items-center bg-base-100 w-full min-h-[92svh]"
>
	<!-- <h1 class="text-5xl my-8">Handleliste</h1> -->
	<div class="w-full lg:w-[60%] lg:my-8">
		<div class="min-h-[36rem]">
			<section class="flex flex-col gap-4 p-4 lg:p-8">
				{#if numTodo === 0}
					<h3 class="text-center text-2xl">Handlelista er tom..</h3>
				{:else}
					<div class="lg:max-h-[30rem] overflow-y-auto">
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
			{/if}
		</div>
		<section class="border-t-[1px] w-full border-t-base-300 px-8 pt-4 flex flex-col">
			<button class="btn btn-primary text-white" on:click={() => modal.showModal()}>
				<Icons iconName="zondicons:add-outline" />Legg til</button
			>
			<dialog id="modal" class="modal modal-middle lg:modal-bottom" bind:this={modal}>
				<div class="modal-box flex flex-col gap-3">
					<h3 class="font-bold text-lg">Legg til i lista</h3>
					<input
						class="border-[1px] border-base-300 px-8 bg-primary/20 input"
						type="text"
						name="entrytext"
						placeholder="Brød"
						bind:value={entryText}
					/>
					<form method="dialog" class="flex justify-between">
						<button class="btn btn-primary text-white" on:click={createNewEntry}>Legg til</button>
						<button class="btn btn-accent text-white">Avbryt</button>
					</form>
				</div>
			</dialog>
		</section>
	</div>
</section>
