<script lang="ts">
	import { dishes, ingredients } from '$lib/stores';
	import { DishValidator, type ValidationResult } from '$lib/utils.js';
	import { onMount } from 'svelte';
	import BottomCircles from '$lib/components/BottomCircles.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import TextInput from '$lib/components/forms/TextInput.svelte';
	import Icons from '$lib/components/Icons.svelte';
	import ErrorAlert from '$lib/components/forms/ErrorAlert.svelte';
	import InfoDropdown from '$lib/components/dropdowns/InfoDropdown.svelte';
	import {
		APIURLS,
		fetchFromApi,
		type DeleteDishBody,
		type DeleteDishResponse,
		type EditDishBody,
		type EditDishResponse
	} from '$lib/api.js';

	export let data;
	let ingredient: { value: string } = {
		value: ''
	};
	let url_text = '';
	let name_text = '';
	let imageURL: string | null = null;
	let image: File | undefined;
	let loading = false;
	let loadingDelete = false;

	const dish = data.dish;
	// ingredients.set(dish.ingredients);
	url_text = dish.url;
	name_text = dish.name;
	imageURL = `/api/dishes/${dish.id}/image`;
	ingredients.set(dish.ingredients);

	/** Tell the user that the ingredient is already in the list */
	function validateIngredients() {
		if ($ingredients.some((i) => i.value === ingredient.value)) {
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
		if ($ingredients.some((i) => i.value === ingredient.value)) return;

		$ingredients.push(ingredient);
		ingredient = {
			value: ''
		};
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
		image = (event.target as HTMLInputElement)?.files?.[0];
		if (!image) {
			imageURL = null;
			return;
		}
		if (DishValidator.validateImage(image) === DishValidator.VALID) {
			imageURL = URL.createObjectURL(image);
		}
	}

	let v: ValidationResult = { is_valid: true, message: '' };
	$: if (!v.is_valid) {
		loading = false;
		loadingDelete = false;
	}

	async function saveChanges() {
		loading = true;
		const response = await fetchFromApi<EditDishBody>(APIURLS.EDIT_DISH, {
			id: dish.id,
			name: name_text,
			ingredients: $ingredients,
			url: url_text,
			image: image,
			email: data.user?.email as string
		});
		const { va } = (await response.json()) as EditDishResponse;
		v = va;
		window.location.href = '/dishes';
		loading = false;
	}

	async function deleteDish() {
		loadingDelete = true;
		// eslint-disable-next-line no-undef
		const response = await fetchFromApi<DeleteDishBody>(APIURLS.DELETE_DISH, {
			id: dish.id,
			email: data.user?.email as string
		});

		const { va } = (await response.json()) as DeleteDishResponse;
		v = va;
		window.location.href = '/dishes/';
		loadingDelete = false;
	}

	let smallSize = true;
	onMount(() => {
		smallSize = window.matchMedia('(max-width: 800px)').matches;
	});
</script>

<section class="flex flex-col items-center pb-8 justify-center">
	<h2 class="mb-12 mt-12 text-3xl">Endre {dish.name}</h2>
	<section class="w-[95%] md:w-auto flex flex-col justify-center items-center gap-4">
		<div class="card shadow-lg bg-base-200 border-[1px] border-base-300 w-full p-4">
			<h3 class="text-base-content/50 text-right p-3">Matrettdetaljer</h3>
			<div class="grid grid-cols-1 lg:grid-cols-2 w-full">
				<!-- upload image -->
				<div class="flex lg:flex-col flex-row justify-center items-center w-full mb-5 gap-5">
					{#if imageURL}
						<img src={imageURL} class="w-24 h-24 rounded" alt="uploaded" />
					{:else}
						<img class="h-24 w-24 bg-grey-100 rounded" src="/logo-green.svg" alt="upload" />
					{/if}
					<label
						class="cursor-pointer btn w-46 btn-outline font-normal btn-accent"
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
		<div class="w-full p-5 mb-6 card shadow-lg bg-base-200 border-base-300 border-[1px]">
			<h3 class="px-5 pb-5 text-base-content/50 flex items-center justify-end gap-3">
				Ingredienser <InfoDropdown
					>Ved å legge til ingredienser kan Paprika genere handleliste for deg</InfoDropdown
				>
			</h3>
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
				<!-- include ingredients -->
				<input type="hidden" value={JSON.stringify($ingredients)} name="ingredients" />
				<input type="hidden" value={data.user?.email} name="user" />
				<input type="hidden" value={dish.id} name="id" />
				<div class="flex flex-col items-center gap-6">
					<TextInput
						name="temp-ingredients"
						bind:value={ingredient.value}
						validateFunction={validateIngredients}
						placeholder="5dL melk"
					>
						<span slot="before">Ny</span></TextInput
					>
					<button
						type="button"
						class="btn-accent btn btn-outline w-32 text-base font-normal"
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
								>{ingredient.value}
								<Icons
									iconName="zondicons:trash"
									classNames="text-base-200"
									height="1rem"
								/></button
							>
						{/each}
					</div>
				</div>
			</div>
		</div>
		<ErrorAlert bind:v />
		<div class="flex justify-center items-center gap-12">
			<button
				class="btn btn-primary btn-lg text-white font-normal text-lg"
				type="submit"
				on:click={saveChanges}
			>
				<Loading bind:loading>Lagre endringer</Loading>
			</button>
			<button class="btn btn-accent btn-lg text-white font-normal text-lg" on:click={deleteDish}>
				<Loading bind:loading={loadingDelete}>Slett</Loading>
			</button>
		</div>
	</section>
	{#if !smallSize}
		<BottomCircles />
	{/if}
</section>
