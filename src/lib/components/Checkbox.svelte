<script lang="ts">
	export let checked = false;
	let color = 'bg-gray-400';
	$: color = checked ? 'bg-gray-400' : 'bg-green';
</script>

<button on:click={() => (checked = !checked)} class="h-5 w-6 {color}"></button>
