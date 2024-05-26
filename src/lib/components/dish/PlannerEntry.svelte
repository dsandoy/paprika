<script lang="ts">
	import type { Note, ReadDish, ReadPlan } from '$lib/types.js';
	import { DateHandler } from '$lib/utils';
	import DishImage from './DishImage.svelte';
	import { dishes } from '$lib/stores';
	import DishSearch from '../DishSearch.svelte';
	import Icons from '../Icons.svelte';

	export let plannerEntry: ReadPlan;

	export let filteredDishes: ReadDish[] = [];
	let note = plannerEntry.note || '';
	let modal: HTMLDialogElement;

	let chosenDish: ReadDish | null | Note | undefined = plannerEntry.dish;

	function fetchDish() {
		chosenDish = plannerEntry.dish;
		if (chosenDish === null) {
			chosenDish = plannerEntry.note;
		}
		if (chosenDish === undefined) {
			chosenDish = null;
		}
	}

	fetchDish();
	export let searchWord = '';
	// $: fetchDish(), $dishes;

	async function setChosenDish(dish: ReadDish) {
		if (chosenDish !== dish) {
			chosenDish = dish;
		} else {
			chosenDish = null;
		}

		plannerEntry.note = null;
	}

	async function removeNote() {
		note = '';
		chosenDish = null;
		plannerEntry.note = null;
	}

	async function addNote() {
		chosenDish = note;
		plannerEntry.note = note;
	}

	async function updateDatabase() {
		let body;
		if (chosenDish && typeof chosenDish === 'object') {
			body = {
				plan: plannerEntry,
				dishId: chosenDish?.id
			};
		} else {
			body = {
				plan: plannerEntry,
				dishId: null
			};
		}

		const response = await fetch('/api/plans/update', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		});
		if (response.ok) {
			console.log('updated');
		}
	}

	let iconColor;
	if (
		DateHandler.isTimestampToday(plannerEntry.date) === 'after' ||
		DateHandler.isTimestampToday(plannerEntry.date) === 'today'
	) {
		iconColor = 'text-success';
	} else {
		iconColor = 'text-primary';
	}
</script>

<li>
	<hr class:bg-success={DateHandler.isTimestampToday(plannerEntry.date) === 'after'} />
	<div class="timeline-start">
		<p
			class="w-16 text-sm text-left"
			class:text-primary={DateHandler.isTimestampToday(plannerEntry.date) === 'after' ||
				DateHandler.isTimestampToday(plannerEntry.date) === 'today'}
		>
			{DateHandler.showDate(plannerEntry.date)}
		</p>
	</div>
	<div class="timeline-middle">
		{#if plannerEntry.note || plannerEntry.dish}
			<Icons iconName="zondicons:location-food" classNames={iconColor} height="1.0rem" />
		{:else}
			<Icons iconName="zondicons:calendar" classNames={iconColor} height="1.0rem" />
		{/if}
	</div>
	<div class="timeline-end timeline-box border-none shadow-none flex flex-row gap-4">
		<a
			class="border-[1px] border-base-300 flex flex-row h-14 w-52 lg:w-64 gap-4 rounded align-center items-center hover:border-primary p-2 bg-base-200 cursor-pointer"
			href={chosenDish && typeof chosenDish === 'object' ? chosenDish.url : ''}
		>
			{#if chosenDish && typeof chosenDish === 'object'}
				<DishImage
					classNames="w-10 lg:w-11 h-10 lg:h-11"
					imagesrc={`/api/dishes/${chosenDish.id}/image/`}
				/>

				<p class="lg:text-base text-sm">
					{chosenDish.name}
				</p>
			{:else if chosenDish && typeof chosenDish === 'string'}
				<div class="flex justify-center items-center pl-3 pr-3">
					<Icons iconName="zondicons:edit-pencil" classNames="text-primary" height="1.0rem" />
				</div>
				<p class="lg:text-base text-sm">{chosenDish}</p>
			{/if}
		</a>

		<!-- set dish modal  -->
		<button class="p-3 btn text-neutral cursor-pointer" on:click={() => modal.showModal()}>
			<Icons iconName="zondicons:compose" />
		</button>
		<dialog bind:this={modal} class="modal">
			<div class="modal-box bg-base-200 w-[24rem] lg:w-[40rem]">
				<ul class="menu rounded-box z-10">
					<div class="flex gap-2 justify-between pr-4">
						<strong class="mb-4">Legg til matrett</strong>
						{DateHandler.showDate(plannerEntry.date)}
					</div>
					<button class="pb-4">
						<DishSearch bind:filteredDishes dishes={$dishes} bind:searchWord />
					</button>
					<div class="overflow-x-auto h-60">
						{#each filteredDishes as dish}
							<li>
								<button
									class="flex gap-2 justify-between items-center"
									on:click={() => setChosenDish(dish)}
								>
									<p>{dish.name}</p>
									<img
										class="h-8 w-8 lg:h-10 lg:w-10 rounded"
										src={`/api/dishes/${dish.id}/image/`}
										alt="dish"
									/>
								</button>
							</li>
						{/each}
					</div>
				</ul>
				<div class="mt-4 mb-4 text-sm flex flex-col gap-4">
					<strong>Eller legg til notat</strong>
					<div class="flex flex-col lg:flex-row gap-3 w-full justify-center items-center">
						<label class="input input-primary text-sm flex-row">
							Notat
							<input type="text" bind:value={note} placeholder="Restemat" class=" mt-3 mb-3" />
						</label>

						<div class="flex flex-row gap-3">
							<button class="btn btn-neutral" on:click={addNote}>Legg til</button>
							<button class="btn btn-accent" on:click={removeNote}>Fjern</button>
						</div>
					</div>
					<form method="dialog" class="flex flex-col gap-4 justify-center items-center">
						<div
							class="flex flex-row gap-2 p-2 justify-start items-center w-full min-h-14 border-base-300 border-[1px] rounded"
						>
							{#if chosenDish && typeof chosenDish === 'object'}
								<DishImage
									classNames="w-10 lg:w-11 h-10 lg:h-11"
									imagesrc={`/api/dishes/${chosenDish.id}/image/`}
								/>

								<p class="text-base">
									{chosenDish.name}
								</p>
							{:else if chosenDish && typeof chosenDish === 'string'}
								<div class="flex justify-center items-center pl-3 pr-3">
									<Icons
										iconName="zondicons:edit-pencil"
										classNames="text-primary"
										height="1.0rem"
									/>
								</div>
								<p class="text-base">{chosenDish}</p>
							{/if}
						</div>
						<button class="btn btn-primary w-full" on:click={updateDatabase}>Ferdig</button>
					</form>
				</div>
			</div>
		</dialog>
	</div>
	<hr
		class:bg-success={DateHandler.isTimestampToday(plannerEntry.date) === 'after' ||
			DateHandler.isTimestampToday(plannerEntry.date) === 'today'}
	/>
</li>
