<script lang="ts">
	import Icons from '$lib/components/Icons.svelte';
	import { DateHandler, navigations } from '$lib/utils';

	export let data;
</script>

<main class="flex flex-col items-center left-0 right-0 absolute top-16 bottom-0 gap-2">
	<div class="w-full p-4 mt-4">
		<h1 class="text-2xl lg:text-3xl lg:text-center">Dashbord</h1>
		<section class="flex flex-col justify-center items-center p-4 pt-8 lg:pt-16">
			<div class="stats bg-base-200 shadow-lg stats-horizontal">
				<div class="p-4 stat place-items-center">
					<h3 class="stat-title">Middager</h3>
					<div class="stat-value text-success">{data.planCount}</div>
					<p class="stat-desc">Planlagte middager</p>
					<div class="stat-actions">
						<a href="/dish-planner" class="btn btn-sm btn-primary">
							<Icons iconName="zondicons:calendar" height="0.8rem" />
							Planlegg
						</a>
					</div>
				</div>
				<div class="stat p-4 shadow-lg place-items-center">
					<h3 class="stat-title">Matretter</h3>
					<div class="stat-value text-nice-blue">{data.dishCount}</div>
					<div class="stat-desc">Antall matretter</div>
					<div class="stat-actions">
						<a href="/dishes/add" class="btn btn-sm bg-nice-blue/60">
							<Icons iconName="zondicons:location-food" height="0.8rem" />
							Legg til
						</a>
					</div>
				</div>
			</div>
		</section>

		<section class="flex flex-col justify-center items-center gap-4 p-4">
			<div class="bg-base-200 p-4 rounded flex flex-col gap-4">
				<h3 class="mb-2">Lag Middager</h3>
				{#each data.plans as plan}
					<div class="flex gap-2 justify-center items-center">
						<p class="text-sm">{DateHandler.showDate(plan.date)}</p>

						{#if plan.dish}
							<a
								href={plan.dish.url}
								class="flex bg-primary/40 hover:bg-primary/60 rounded p-2 pl-4 pr-4 justify-between h-14 w-64 items-center gap-2"
							>
								<div>{plan.dish.name}</div>
								<img
									src={`/api/dishes/${plan.dishId}/image/`}
									alt="dish"
									class="w-10 h-10 rounded"
								/>
							</a>
						{:else if plan.note}
							<div
								class="p-2 pl-4 pr-4 bg-base-100 rounded h-14 w-64 text-base flex justify-between items-center gap-2"
							>
								<div>{plan.note}</div>
								<Icons iconName="zondicons:edit-pencil" height="1.0rem" classNames="text-primary" />
							</div>
						{:else}
							<div
								class="p-2 pl-4 pr-4 bg-base-100 rounded h-14 w-64 text-base flex justify-between items-center gap-2"
							>
								<div class="text-accent">Ingen middag</div>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</section>
		<div class="flex flex-row gap-5 items-center justify-center pt-4">
			{#each navigations as nav}
				<a
					class="text-sm p-4 lg:pl-6 lg:pr-6 gap-2 rounded flex flex-col items-center shadow justify-center bg-base-200 hover:bg-base-300"
					href={nav.url}
				>
					<Icons iconName={nav.icon} height="2rem" />
					{nav.name}
				</a>
			{/each}
		</div>
	</div>
</main>
