<script lang="ts">
	import Icons from './Icons.svelte';

	export let classNames = '';
	export let checked = false;
	export let disableCheckToggle = false;

	function toggleChecked() {
		if (disableCheckToggle) return;
		checked = !checked;
	}
</script>

<button
	on:click={toggleChecked}
	data-ui={checked}
	class="{classNames} h-6 w-6 bg-gray-300 data-isOpen:bg-green rounded text-center flex justify-center items-center hover:border-[2px] hover:border-green"
>
	{#if checked}
		<Icons iconName="zondicons:checkmark" height="1.0rem" classNames="text-white" />
	{/if}</button
>
