<script lang="ts">
	import Icons from './Icons.svelte';

	export let checked = false;
</script>

<button
	on:click={() => (checked = !checked)}
	data-ui={checked}
	class="h-5 w-5 bg-gray-300 data-isOpen:bg-green rounded text-center flex justify-center items-center hover:border-[2px] hover:border-green"
>
	{#if checked}
		<Icons iconName="zondicons:checkmark" height="1.0rem" classNames="text-white" />
	{/if}</button
>
