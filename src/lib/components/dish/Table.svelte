<script lang="ts">
	import type { Dish } from '$lib/types';
	import Icons from '../Icons.svelte';

	export let dishes: Dish[];

	function displayIngredients(dish: Dish) {
		const ingredients = dish.ingredients;
		if (ingredients) return ingredients.join(', ');
		return '';
	}
</script>

{#if !dishes || dishes?.length === 0}
	<div>
		Du har ingen middager ennå! Trykk Legg til for å gjøre noe med det (Sørg for at du er innlogget)
		...
	</div>
{:else}
	<div class="overflow-x-auto">
		<table class="table">
			<!--Head-->
			<thead>
				<tr>
					<th class="hidden lg:block"></th>
					<th>Matrett</th>
					<th class="hidden lg:block">Ingredienser</th>
					<th>URL</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#each dishes as dish}
					<tr>
						<td class="hidden lg:block">
							<!-- <div class="badge badge-success text-white">Ny</div> -->
						</td>
						<td>
							<div class="flex flex-row gap-4 items-center justify-start">
								{#if !dish.customImage}
									<div class="w-12 lg:w-16">
										<button
											class="bg-gray-200 h-12 w-12 lg:h-16 lg:w-16 flex align-center text-gray-500 items-center rounded hover:bg-gray-300 hover:text-gray-500"
										>
											<Icons iconName="zondicons:camera" height="2.3rem" classNames="m-auto"
											></Icons>
										</button>
									</div>
								{:else}
									<div class="avatar">
										<div class="mask mask-squircle w-12 h-12 lg:w-16 lg:h-16">
											<img src={dish.customImage} alt="Dish" />
										</div>
									</div>
								{/if}
								<div class="">{dish.name}</div>
							</div>
						</td>
						<td class="hidden lg:block max-w-96">
							{displayIngredients(dish)}
						</td>
						<td>
							{#if dish.url !== ''}
								<a href={dish.url} class="w-12 lg:w-16">
									<button class="btn btn-primary text-white rounded-lg lg:rounded-sm">
										<span class="hidden lg:block">Oppskrift</span>
										<Icons height="1rem" />
									</button>
								</a>
							{/if}
						</td>
						<td>
							<a href="/dishes/edit/{dish.name}" class="btn btn-secondary rounded-lg lg:rounded-sm">
								<span class="hidden lg:block">Endre</span>
								<Icons iconName="zondicons:edit-pencil" height="1rem" />
							</a>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}
