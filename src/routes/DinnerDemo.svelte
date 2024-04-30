<script lang="ts">
	import DemoPlanEntry from '$lib/components/demo/DemoPlanEntry.svelte';
	import { demoPlans } from './demodata';
</script>

<div class=" flex flex-col items-center justify-center gap-6">
	<div class="flex flex-col items-center justify-center gap-4">
		<h2 class="text-3xl">1. Hva skal jeg ha til middag?</h2>
		<p class="lg:w-[30rem]">
			Ved å legge til matrettene dine får du enkelt inspirasjon til å ta valget! Liker du å
			planlegge? Bestem middager for hele uka!
		</p>
	</div>
	<div class="rounded lg:bg-white lg:border-[1px] lg:border-green/20 lg:p-6 lg:shadow-sm">
		<DemoPlanEntry plannerEntry={$demoPlans[0]} />
		<DemoPlanEntry plannerEntry={$demoPlans[1]} />
		<DemoPlanEntry plannerEntry={$demoPlans[2]} />
	</div>
</div>
