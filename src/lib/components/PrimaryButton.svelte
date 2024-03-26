<script lang="ts">
	import Button from './Button.svelte';

	export let classNames = '';
	export let type: 'button' | 'submit' = 'submit';
	export let formaction = '';
	/** special attribute used to control reactivity from data attributes in tailwind*/
	export let data_ui = false;
</script>

<Button
	classNames="{classNames} rounded-lg border-[1px] px-5 border-green bg-gradient-to-r from-green to-green hover:from-gray-100 hover:to-gray-100 hover:via-white text-white hover:text-black hover:bg-p-green "
	{type}
	on:click
	{formaction}
	{data_ui}
>
	<slot />
</Button>
