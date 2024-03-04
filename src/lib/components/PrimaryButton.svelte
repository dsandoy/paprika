<script lang="ts">
	export let classNames = '';
	export let type: 'button' | 'submit' = 'submit';
	export let formaction = '';
</script>

<button
	class="h-11 border-[1px] border-green bg-gradient-to-r from-green to-green hover:from-gray-100 hover:to-gray-100 hover:via-white text-white hover:text-black rounded-lg px-5 text-lg cursor-pointer hover:bg-p-green {classNames}"
	{type}
	on:click
	{formaction}
>
	<slot />
</button>
