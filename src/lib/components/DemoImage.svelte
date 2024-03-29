<script lang="ts">
	/** Use to show the demo image in the onboarding page */

	/** please set h and w only */
	export let classNames = 'w-[14rem] h-[21rem]';

	/** the hover text*/
	export let text: string;

	export let smallText = '';

	/** the image src */
	export let img: string;
</script>

<div class=" {classNames} rounded flex justify-center items-center">
	<div class=" group relative rounded">
		<img
			class="{classNames} rounded group-hover:brightness-[0.25] transition-all-300"
			src={img}
			alt="planner"
		/>
		<span
			class=" w-[100%] text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-all-300 group-hover:opacity-100 text-white"
			>{text}
			{#if smallText !== ''}<br /><span class="text-xs text-white">{smallText}</span>{/if}</span
		>
	</div>
</div>
