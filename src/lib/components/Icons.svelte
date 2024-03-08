<script lang="ts">
	/** Use to render icons from iconify!
	 * Manipulate the colors by assigning the icon css variables
	 * To see available icons, goto: https://icon-sets.iconify.design/zondicons/
	 */
	import Icon from '@iconify/svelte';

	/** defaults to link*/
	export let iconName = 'zondicons:link';
	/** Pass text-color to change the fill of the icons..*/
	export let classNames = 'm-auto';
	/** a valid string css height value*/
	export let height = '24px';
</script>

<span class={classNames}>
	<Icon icon={iconName} {height} />
</span>
