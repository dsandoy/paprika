<script lang="ts">
	export let classNames = '';
	export let type: 'button' | 'submit' = 'submit';
	export let formaction = '';
</script>

<button
	class=" h-11 text-lg flex justify-center items-center rounded-lg px-5 cursor-pointer border-[1px] border-green bg-gradient-to-r from-gray-100 to-gray-100 via-white hover:from-green hover:to-green hover:text-white {classNames}"
	{type}
	{formaction}
	on:click
>
	<slot />
</button>
