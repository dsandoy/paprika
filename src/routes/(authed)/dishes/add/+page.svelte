<script lang="ts">
	import { dishes, ingredients, user } from '$lib/stores';
	import { DishValidator, type ValidationResult } from '$lib/utils.js';
	import { onMount } from 'svelte';
	import BottomCircles from '$lib/components/BottomCircles.svelte';
	import { DBService } from '$lib/Firebase';
	import type { Dish } from '$lib/types.js';
	import Loading from '$lib/components/Loading.svelte';
	import TextInput from '$lib/components/forms/TextInput.svelte';
	import Icons from '$lib/components/Icons.svelte';
	import ErrorAlert from '$lib/components/forms/ErrorAlert.svelte';
	import InfoDropdown from '$lib/components/dropdowns/InfoDropdown.svelte';

	let formElement: HTMLFormElement;
	let ingredient = '';
	let url_text = '';
	let name_text = '';
	let customImageUrl: string | null = null;
	let customImage: File | undefined;
	let loading = false;

	/** Tell the user that the ingredient is already in the list */
	function validateIngredients() {
		if ($ingredients.some((i) => i === ingredient)) {
			return {
				is_valid: false,
				message: 'Ingrediensen er allerede lagt til'
			};
		}
		return {
			is_valid: true,
			message: ''
		};
	}

	/** add ingredient to client kept ingredients list */
	const addIngrendient = () => {
		// prevent empty or duplicated ingredients
		if (!ingredient) return;
		if ($ingredients.some((i) => i === ingredient)) return;

		$ingredients.push(ingredient);
		ingredient = '';
		$ingredients = $ingredients;
	};

	/** offer a validation on the url in real time... */
	function validateUrl() {
		return DishValidator.validateURL(url_text);
	}

	/** Validate the name in real time...*/
	function validateName() {
		const result = DishValidator.validateName(name_text, $dishes);
		return result as ValidationResult;
	}

	/** Let the user see the image they uploaded..*/
	function handleImageUpload(event: Event) {
		customImage = (event.target as HTMLInputElement)?.files?.[0];
		if (!customImage) {
			customImageUrl = null;
			return;
		}
		if (DishValidator.validateImage(customImage) === DishValidator.VALID) {
			customImageUrl = URL.createObjectURL(customImage);
		}
	}

	let v: ValidationResult = {
		is_valid: true,
		message: ''
	};

	async function AddDish() {
		loading = true;
		const dish: Dish = {
			name: name_text,
			url: url_text,
			user: $user?.uid as string,
			ingredients: $ingredients
		};
		const result = DishValidator.validateAll(dish, $dishes);
		v = result;
		if (!result.is_valid) {
			loading = false;
			return;
		}

		if (customImage) {
			const url = await DBService.uploadImage(customImage as File);
			dish.customImage = url;
		}
		await DBService.createDish(dish);
		window.location.href = '/dishes/add/success';
		loading = false;
	}
	let smallSize = true;
	onMount(() => {
		smallSize = window.matchMedia('(max-width: 800px)').matches;
	});
</script>

<section class="flex flex-col items-center pb-8 justify-center bg-green-50">
	<h2 class="mb-12 mt-12 text-3xl">Legg til ny Matrett</h2>
	<form
		class="w-[95%] md:w-auto flex flex-col justify-center items-center gap-4"
		method="post"
		bind:this={formElement}
		enctype="multipart/form-data"
	>
		<div class="card shadow-lg border-[1px] border-grey-100 w-full p-4">
			<h3 class="text-grey-300 text-right p-3">Matrettdetaljer</h3>
			<div class="grid grid-cols-1 lg:grid-cols-2 w-full">
				<!-- upload image -->
				<div class="flex lg:flex-col flex-row justify-center items-center w-full mb-5 gap-5">
					{#if customImageUrl}
						<img src={customImageUrl} class="w-24 h-24 rounded" alt="uploaded" />
					{:else}
						<img class="h-24 w-24 bg-grey-100 rounded" src="/logo-green.svg" alt="upload" />
					{/if}
					<label
						class="cursor-pointer btn btn-outline w-46 font-normal btn-primary"
						for="upload_image"
						>Velg Bilde
						<input
							class="hidden"
							type="file"
							id="upload_image"
							name="image"
							accept="image/*"
							on:change={handleImageUpload}
						/>
					</label>
				</div>
				<div class="flex flex-col gap-4">
					<!-- set name  -->
					<TextInput
						bind:value={name_text}
						name="name"
						placeholder="Søtjordepler med paprika"
						required
						validateFunction={validateName}
					>
						<span slot="before">Navn</span>
					</TextInput>
					<!-- set recipe url -->
					<TextInput
						name="url"
						placeholder="Link til oppskrift"
						bind:value={url_text}
						validateFunction={validateUrl}
					>
						<span slot="before">URL</span>
					</TextInput>
				</div>
			</div>
		</div>

		<!-- ingredients -->
		<div class="w-full p-5 mb-6 card shadow-lg border-grey-100 border-[1px]">
			<h3 class="px-5 pb-5 text-grey-300 flex items-center justify-end gap-3">
				ingredienser <InfoDropdown
					>Ved å legge til ingredienser kan Paprika genere handleliste for deg</InfoDropdown
				>
			</h3>
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
				<!-- include ingredients -->
				<input type="hidden" value={$ingredients} name="ingredients" />
				<div class="flex flex-col items-center gap-6">
					<TextInput
						name="temp-ingredients"
						bind:value={ingredient}
						validateFunction={validateIngredients}
						placeholder="5dL melk"
					>
						<span slot="before">Ny</span></TextInput
					>
					<button
						type="button"
						class=" btn btn-primary btn-outline w-32 text-base font-normal"
						on:click={addIngrendient}>Legg til</button
					>
				</div>
				<div>
					<div class="overflow-auto h-48">
						{#each $ingredients as ingredient}
							<button
								type="button"
								class="flex flex-row hover:bg-red hover:text-white focus:bg-red focus:text-white text-sm lg:text-base btn min-h-0 h-8 font-normal bg-inherit border-none shadow-none pl-5 pr-5"
								on:click={() => ($ingredients = $ingredients.filter((i) => i !== ingredient))}
								>{ingredient}
								<Icons
									iconName="zondicons:trash"
									classNames="text-base-100"
									height="1rem"
								/></button
							>
						{/each}
					</div>
				</div>
			</div>
		</div>
		<button
			class="w-48 btn btn-primary text-white font-normal text-lg"
			type="button"
			on:click={AddDish}
		>
			<Loading bind:loading>Legg til matrett</Loading>
		</button>
		<ErrorAlert bind:v />
	</form>
	{#if !smallSize}
		<BottomCircles />
	{/if}
</section>
